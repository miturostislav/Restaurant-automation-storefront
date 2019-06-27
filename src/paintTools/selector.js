import {cloneCanvas} from "../utils/canvasUtils";

export default {
  id: 'selecter',
  icon: '../public/icons/select.svg',
  getPainter({ canvas, lineWidth, saveCanvas }) {
    const ctx = canvas.getContext('2d');
    const selecterLineWidth = 2;
    let resizeCanvas = null;
    let clonedCanvas = null;
    let transformer = null;
    let activeIndicator = null;
    let startPoint;
    let finalPoint;

    return {
      start() {
        ctx.save();
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
      },
      stop() {
        ctx.restore();
        if (clonedCanvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(clonedCanvas, 0, 0);
        }
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
      }
    };

    function onMouseDown(event) {
      const point = {
        x: event.offsetX,
        y: event.offsetY
      };
      if (transformer) {
        activeIndicator = transformer.getActiveIndicator(point);
        if (!activeIndicator) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(clonedCanvas, 0, 0);
          transformer = null;
        }
      }

      if (!transformer) {
        ctx.fillStyle = '#4285f4';
        ctx.strokeStyle = '#4285f4';
        ctx.lineWidth = selecterLineWidth;
        startPoint = point;
        finalPoint = { ...startPoint };
        clonedCanvas = cloneCanvas(canvas);
      }
    }
    function onMouseUp() {
      activeIndicator = null;
      if (startPoint && finalPoint && !transformer) {
        resizeCanvas = cloneCanvas(canvas);
        transformer = buildResizer({ canvas, startPoint, finalPoint });
        transformer.drawIndicators();
        // ctx.save();
        // ctx.scale(1.2, 1.2);
        // ctx.drawImage(
        //   clonedCanvas,
        //   startPoint.x + selecterLineWidth,
        //   startPoint.y + selecterLineWidth,
        //   finalPoint.x - startPoint.x - (2 * selecterLineWidth),
        //   finalPoint.y - startPoint.y - (2 * selecterLineWidth),
        //   startPoint.x + selecterLineWidth,
        //   startPoint.y + selecterLineWidth,
        //   finalPoint.x - startPoint.x - (2 * selecterLineWidth),
        //   finalPoint.y - startPoint.y - (2 * selecterLineWidth)
        // );
        // ctx.restore();
      }
      startPoint = null;
      finalPoint = null;
    }
    function onMouseMove() {
      if (activeIndicator) {
        activeIndicator.transform({
          x: event.offsetX,
          y: event.offsetY
        });
      } else if (startPoint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(clonedCanvas, 0, 0);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(event.offsetX, startPoint.y);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.lineTo(startPoint.x, event.offsetY);
        ctx.closePath();
        ctx.stroke();
        finalPoint.x = event.offsetX;
        finalPoint.y = event.offsetY;
      }
    }
  }
}

function buildResizer({ canvas, startPoint: initialStartPoint, finalPoint: initialFinalPoint }) {
  const ctx = canvas.getContext('2d');
  const lineWidth = ctx.lineWidth * 5;
  let startPoint = { ...initialStartPoint };
  let finalPoint = { ...initialFinalPoint };
  let activeIndicator = null;

  const indicators = {
    TOP: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x + (finalPoint.x - startPoint.x) / 2,
          startPoint.y,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: startPoint.y, point });
      },
      transform(point) {
        console.log('TOP');
      }
    },
    LEFT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x,
          startPoint.y + (finalPoint.y - startPoint.y) / 2,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x, y: startPoint.y + (finalPoint.y - startPoint.y) / 2, point });
      },
      transform(point) {
        console.log('LEFT');
      }
    },
    BOTTOM: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x + (finalPoint.x - startPoint.x) / 2,
          finalPoint.y,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x + (finalPoint.x - startPoint.x) / 2, y: finalPoint.y, point });
      },
      transform(point) {
        console.log('BOTTOM');
      }
    },
    RIGHT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          finalPoint.x,
          startPoint.y + (finalPoint.y - startPoint.y) / 2,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: finalPoint.x, y: startPoint.y + (finalPoint.y - startPoint.y) / 2, point });
      },
      transform(point) {
        console.log('RIGHT');
      }
    },
    TOP_LEFT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x,
          startPoint.y,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x, y: startPoint.y, point });
      },
      transform(point) {
        console.log('TOP_LEFT');
      }
    },
    TOP_RIGHT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          finalPoint.x,
          startPoint.y,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: finalPoint.x, y: startPoint.y, point });
      },
      transform(point) {
        console.log('TOP_RIGHT');
      }
    },
    BOTTOM_LEFT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          startPoint.x,
          finalPoint.y,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: startPoint.x, y: finalPoint.y, point });
      },
      transform(point) {
        console.log('BOTTOM_LEFT');
      }
    },
    BOTTOM_RIGHT: {
      draw() {
        ctx.beginPath();
        ctx.arc(
          finalPoint.x,
          finalPoint.y,
          lineWidth,
          0,
          2 * Math.PI
        );
        ctx.fill();
      },
      isActive(point) {
        return isIndicatorActive({ x: finalPoint.x, y: finalPoint.y, point });
      },
      transform(point) {
        console.log('BOTTOM_RIGHT');
      }
    },
  };

  return {
    drawIndicators() {
      Object.values(indicators).forEach(({ draw }) => draw());
    },
    getActiveIndicator(point) {
      return activeIndicator = Object.values(indicators).find((indicator) => indicator.isActive(point)) || null;
    },
  };

  function isIndicatorActive({ point, x, y }) {
    return Math.abs(x - point.x) <= lineWidth && Math.abs(y - point.y) <= lineWidth;
  }
}