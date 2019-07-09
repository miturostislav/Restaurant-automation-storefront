import { cloneCanvas } from '../utils/canvasUtils';
import { getAngle } from '../utils/mathUtils'

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
  let initialStartPoint = null;
  let initialFinalPoint = null;
  let clonedCanvas = cloneCanvas(canvas);

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
        return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: startPoint.y, point });
      },
      transform(point) {
        const heightDiff = startPoint.y - point.y;
        transform({ startPoint: { x: startPoint.x, y: startPoint.y - heightDiff }, finalPoint });
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
        return isIndicatorActive({ x: startPoint.x, y: startPoint.y + (finalPoint.y - startPoint.y) / 2, point });
      },
      transform(point) {
        const widthDiff = startPoint.x - point.x;
        transform({ startPoint: { x: startPoint.x - widthDiff, y: startPoint.y }, finalPoint });
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
        return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: finalPoint.y, point });
      },
      transform(point) {
        const heightDiff = point.y - finalPoint.y;
        transform({ startPoint, finalPoint : { x: finalPoint.x, y: finalPoint.y + heightDiff } });
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
        return isIndicatorActive({ x: finalPoint.x, y: startPoint.y + (finalPoint.y - startPoint.y) / 2, point });
      },
      transform(point) {
        const widthDiff = point.x - finalPoint.x;
        transform({ startPoint, finalPoint: { x: finalPoint.x + widthDiff, y: finalPoint.y } });
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
        return isIndicatorActive({ x: startPoint.x, y: startPoint.y, point });
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
        return isIndicatorActive({ x: finalPoint.x, y: startPoint.y, point });
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
        return isIndicatorActive({ x: startPoint.x, y: finalPoint.y, point });
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
        return isIndicatorActive({ x: finalPoint.x, y: finalPoint.y, point });
      },
      transform(point) {
        indicators.RIGHT.transform(point);
        indicators.BOTTOM.transform(point);
      }
    },
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
          return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: startPoint.y - indicatorWidth * 4, point });
        },
        transform(point) {
          const middlePoint = {
            x: (startPoint.x + finalPoint.x) / 2,
            y: (startPoint.y + finalPoint.y) / 2
          };
          const angle = getAngle(middlePoint, point);
          clearRectangle();
          ctx.save();
          ctx.translate(middlePoint.x, middlePoint.y);
          ctx.rotate(angle);
          ctx.translate(-middlePoint.x, -middlePoint.y);
          shouldDrawIndicator = false;
          drawTransformerRectangle({ startPoint, finalPoint });
          drawTransformedImage();
          drawIndicators();
          shouldDrawIndicator = true;
          ctx.restore();
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
      return startPoint && finalPoint &&  Object.values(indicators).find((indicator) => indicator.isActive(point)) || null;
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
      ctx.drawImage(cloneOuterCanvas(), 0, 0);
      drawTransformedImage();
      clonedCanvas = cloneCanvas(canvas);
      startPoint = finalPoint = initialStartPoint = initialFinalPoint = null;
    }
  }

  function drawTransformer({ startPoint, finalPoint }) {
    initialStartPoint = startPoint;
    initialFinalPoint = finalPoint;
    clearRectangle();
    drawTransformerRectangle({ startPoint, finalPoint });
    drawTransformedImage();
  }

  function transform(points) {
    clearRectangle();
    drawTransformerRectangle(points);
    drawTransformedImage();
    drawIndicators();
  }

  function clearRectangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cloneOuterCanvas(), 0, 0);
  }

  function drawTransformerRectangle({ startPoint: currentStartPoint, finalPoint: currentFinalPoint }) {
    startPoint = currentStartPoint;
    finalPoint = currentFinalPoint;
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
    ctx.drawImage(clonedCanvas, sImageX, sImageY, sImageWidth, sImageHeight, dImageX, dImageY, dImageWidth, dImageHeight);
  }

  function drawIndicators() {
    Object.values(indicators).forEach(({ draw }) => draw());
  }

  function isIndicatorActive({ point, x, y }) {
    return Math.abs(x - point.x) <= indicatorWidth && Math.abs(y - point.y) <= indicatorWidth;
  }

  function cloneOuterCanvas() {
    const { imageX, imageY, imageWidth, imageHeight } = getInnerCoordinates({ startPoint: initialStartPoint, finalPoint: initialFinalPoint });
    const clonedOuterCanvas = cloneCanvas(clonedCanvas);
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