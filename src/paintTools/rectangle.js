import { cloneCanvas } from '../utils/canvasUtils';

export default {
  id: 'rectangle',
  icon: '../public/icons/edit.svg',
  getPainter: getPencilPainter
}

function getPencilPainter(canvas) {
  const lineWidth = 10;
  const ctx = canvas.getContext('2d');
  let startPoint = null;
  let finalPoint = null;
  let clonedCanvas = null;

  return {
    onMouseDown(event) {
      startPoint = {
        x: event.offsetX,
        y: event.offsetY
      };
      finalPoint = { ...startPoint };
      clonedCanvas = cloneCanvas(canvas);
      ctx.lineWidth = lineWidth;
    },
    onMouseUp() {
      startPoint = null;
      finalPoint = null;
      clonedCanvas = null;
    },
    onMouseMove(event) {
      if (startPoint) {
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