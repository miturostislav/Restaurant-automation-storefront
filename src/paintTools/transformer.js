import { cloneCanvas } from '../utils/canvasUtils';
import { getAngle, getRotatedPointByAngle } from '../utils/mathUtils'

export default {
  id: 'transformer',
  icon: '../public/icons/transformer.svg',
  getPainter({ canvas, saveCanvas }) {
    const ctx = canvas.getContext('2d');
    let transformer = null;
    let activeIndicator = null;
    let startPoint;
    let finalPoint;
    let isTransformedAfterSave = false;

    return {
      start() {
        ctx.save();
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
      },
      stop() {
        ctx.restore();
        if (transformer) {
          transformer.save();
        }
        if (isTransformedAfterSave) {
          saveCanvas();
          isTransformedAfterSave = false;
        }
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
      }
    };

    function onMouseDown(event) {
      startPoint = {
        x: event.offsetX,
        y: event.offsetY
      };
      if (transformer) {
        activeIndicator = transformer.getActiveIndicator(startPoint);
        if (!activeIndicator) {
          transformer.save();
          if (isTransformedAfterSave) {
            saveCanvas();
            isTransformedAfterSave = false;
          }
        }
      } else {
        transformer = buildTransformer({ canvas });
      }
    }
    function onMouseUp() {
      activeIndicator = null;
      if (finalPoint) {
        transformer.drawTransformerWithIndicators({ startPoint, finalPoint });
      }
      startPoint = null;
      finalPoint = null;
    }
    function onMouseMove(event) {
      if (activeIndicator) {
        activeIndicator.transform({
          x: event.offsetX,
          y: event.offsetY
        });
        isTransformedAfterSave = true;
      } else if (startPoint) {
        finalPoint = {
          x: event.offsetX,
          y: event.offsetY
        };
        transformer.drawTransformer({ startPoint, finalPoint });
      }
    }
  }
}

function buildTransformer({ canvas }) {
  const ctx = canvas.getContext('2d');
  const transformerLineWidth = 2;
  const indicatorWidth = transformerLineWidth * 5;
  let startPoint = null;
  let finalPoint = null;
  let angle = 0;
  let middlePoint = null;
  let initialStartPoint = null;
  let initialFinalPoint = null;
  let clonedOriginalCanvas = cloneCanvas(canvas);
  let clonedModifiedCanvas = clonedOriginalCanvas;

  const indicators = {
    TOP: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x + (finalPoint.x - startPoint.x) / 2,
          startPoint.y,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: startPoint.y }, point);
      },
      transform(point) {
        startPoint.y -= startPoint.y - getRotatedPoint(point).y;
        transform();
      }
    },
    LEFT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x,
          startPoint.y + (finalPoint.y - startPoint.y) / 2,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x, y: startPoint.y + (finalPoint.y - startPoint.y) / 2 }, point);
      },
      transform(point) {
        startPoint.x -= startPoint.x - getRotatedPoint(point).x;
        transform();
      }
    },
    BOTTOM: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x + (finalPoint.x - startPoint.x) / 2,
          finalPoint.y,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: finalPoint.y }, point);
      },
      transform(point) {
        finalPoint.y += getRotatedPoint(point).y - finalPoint.y;
        transform();
      }
    },
    RIGHT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          finalPoint.x,
          startPoint.y + (finalPoint.y - startPoint.y) / 2,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: finalPoint.x, y: startPoint.y + (finalPoint.y - startPoint.y) / 2 }, point);
      },
      transform(point) {
        finalPoint.x += getRotatedPoint(point).x - finalPoint.x;
        transform();
      }
    },
    TOP_LEFT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x,
          startPoint.y,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x, y: startPoint.y }, point);
      },
      transform(point) {
        indicators.TOP.transform(point);
        indicators.LEFT.transform(point);
      }
    },
    TOP_RIGHT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          finalPoint.x,
          startPoint.y,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: finalPoint.x, y: startPoint.y }, point);
      },
      transform(point) {
        indicators.TOP.transform(point);
        indicators.RIGHT.transform(point);
      }
    },
    BOTTOM_LEFT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x,
          finalPoint.y,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x, y: finalPoint.y }, point);
      },
      transform(point) {
        indicators.LEFT.transform(point);
        indicators.BOTTOM.transform(point);
      }
    },
    BOTTOM_RIGHT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          finalPoint.x,
          finalPoint.y,
          indicatorWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: finalPoint.x, y: finalPoint.y }, point);
      },
      transform(point) {
        indicators.RIGHT.transform(point);
        indicators.BOTTOM.transform(point);
      }
    },
    MOVE: (() => {
      let previousPoint = null;
      return {
        draw() {},
        isActive(point) {
          const leftUpperPoint = { x: Math.min(finalPoint.x, startPoint.x), y: Math.min(finalPoint.y, startPoint.y) };
          const rightLowerPoint = { x: Math.max(finalPoint.x, startPoint.x), y: Math.max(finalPoint.y, startPoint.y) };

          if (
            point.x > leftUpperPoint.x && point.x < rightLowerPoint.x &&
            point.y > leftUpperPoint.y && point.y < rightLowerPoint.y
          ) {
            previousPoint = point;
            return true;
          }
          return false;
        },
        transform(point) {
          const rotatedPoint = getRotatedPoint(point);
          const diff = { x: rotatedPoint.x - previousPoint.x, y: rotatedPoint.y - previousPoint.y };
          startPoint.x += diff.x;
          startPoint.y += diff.y;
          finalPoint.x += diff.x;
          finalPoint.y += diff.y;
          transform();
          previousPoint = rotatedPoint;
        }
      }
    })(),
    ROTATE: (() => {
      let shouldDrawIndicator = true;

      return {
        draw(point) {
          if (shouldDrawIndicator) {
            const { x, y } = point || { x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: startPoint.y - indicatorWidth * 4 };
            ctx.beginPath();
            ctx.arc(
              x,
              y,
              indicatorWidth,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        },
        isActive(point) {
          return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: startPoint.y - indicatorWidth * 4 }, point);
        },
        transform(point) {
          const rotatedStartPoint = middlePoint ? getRotatedPointByAngle(middlePoint, startPoint, angle) : startPoint;
          const rotatedFinalPoint = middlePoint ? getRotatedPointByAngle(middlePoint, finalPoint, angle) : finalPoint;

          middlePoint = {
            x: (rotatedStartPoint.x + rotatedFinalPoint.x) / 2,
            y: (rotatedStartPoint.y + rotatedFinalPoint.y) / 2
          };
          startPoint = getRotatedPointByAngle(middlePoint, rotatedStartPoint, -angle);
          finalPoint = getRotatedPointByAngle(middlePoint, rotatedFinalPoint, -angle);
          angle = getAngle(middlePoint, point);
          shouldDrawIndicator = false;
          transform();
          shouldDrawIndicator = true;
          indicators.ROTATE.draw(point);
        }
      };
    })()
  };

  ctx.fillStyle = '#4285f4';
  ctx.strokeStyle = '#4285f4';
  ctx.lineWidth = transformerLineWidth;

  return {
    getActiveIndicator(point) {
      return startPoint && finalPoint && Object.values(indicators)
        .find((indicator) => indicator.isActive(getRotatedPoint(point))) || null;
    },
    drawTransformer,
    drawTransformerWithIndicators(points) {
      drawTransformer(points);
      drawIndicators();
    },
    save
  };

  function save() {
    if (startPoint && finalPoint) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(clonedModifiedCanvas, 0, 0);
      clonedOriginalCanvas = clonedModifiedCanvas;
      startPoint = finalPoint = initialStartPoint = initialFinalPoint = middlePoint = null;
      angle = 0;
    }
  }

  function drawTransformer({ startPoint: currentStartPoint, finalPoint: currentFinalPoint }) {
    initialStartPoint = { ...currentStartPoint };
    startPoint = { ...currentStartPoint };
    initialFinalPoint = { ...currentFinalPoint };
    finalPoint = { ...currentFinalPoint };
    clearRectangle();
    drawTransformerRectangle();
    drawTransformedImage();
  }

  function transform() {
    clearRectangle();
    ctx.save();
    rotateCanvas();
    drawTransformedImage();
    cloneModifiedCanvas();
    drawTransformerRectangle();
    drawIndicators();
    ctx.restore();
  }

  function rotateCanvas() {
    if (middlePoint) {
      ctx.translate(middlePoint.x, middlePoint.y);
      ctx.rotate(angle);
      ctx.translate(-middlePoint.x, -middlePoint.y);
    }
  }

  function getRotatedPoint(point) {
    return middlePoint ? getRotatedPointByAngle(middlePoint, point, -angle) : point;
  }

  function cloneModifiedCanvas() {
    clonedModifiedCanvas = cloneCanvas(canvas);
  }

  function clearRectangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cloneOuterCanvas(), 0, 0);
  }

  function drawTransformerRectangle() {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(finalPoint.x, startPoint.y);
    ctx.lineTo(finalPoint.x, finalPoint.y);
    ctx.lineTo(startPoint.x, finalPoint.y);
    ctx.closePath();
    ctx.stroke();
  }

  function drawTransformedImage() {
    const {
      imageX: sImageX,
      imageY: sImageY,
      imageWidth: sImageWidth,
      imageHeight: sImageHeight
    } = getInnerCoordinates({ startPoint: initialStartPoint,  finalPoint: initialFinalPoint });
    const {
      imageX: dImageX,
      imageY: dImageY,
      imageWidth: dImageWidth,
      imageHeight: dImageHeight
    } = getInnerCoordinates({ startPoint,  finalPoint });
    ctx.drawImage(clonedOriginalCanvas, sImageX, sImageY, sImageWidth, sImageHeight, dImageX, dImageY, dImageWidth, dImageHeight);
  }

  function drawIndicators() {
    Object.values(indicators).forEach(({ draw }) => draw());
  }

  function isIndicatorActive(indicatorPoint, mousePoint) {
    return Math.abs(indicatorPoint.x - mousePoint.x) <= indicatorWidth && Math.abs(indicatorPoint.y - mousePoint.y) <= indicatorWidth;
  }

  function cloneOuterCanvas() {
    const { imageX, imageY, imageWidth, imageHeight } = getInnerCoordinates({ startPoint: initialStartPoint, finalPoint: initialFinalPoint });
    const clonedOuterCanvas = cloneCanvas(clonedOriginalCanvas);
    const clonedOuterCanvasCtx = clonedOuterCanvas.getContext('2d');

    clonedOuterCanvasCtx.clearRect(imageX, imageY, imageWidth, imageHeight);
    return clonedOuterCanvas;
  }

  function getInnerCoordinates({ startPoint, finalPoint }) {
    return {
      imageX: startPoint.x + transformerLineWidth,
      imageY: startPoint.y + transformerLineWidth,
      imageWidth: finalPoint.x - startPoint.x - (2 * transformerLineWidth),
      imageHeight: finalPoint.y - startPoint.y - (2 * transformerLineWidth),
    }
  }
}