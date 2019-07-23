import { cloneCanvas } from '../utils/canvasUtils';

export default {
  id: 'line',
  icon: '../public/icons/line.svg',
  getPainter({ canvas, lineWidth, saveCanvas }) {
    const ctx = canvas.getContext('2d');
    let startPoint = null;
    let finalPoint = null;
    let clonedCanvas = null;

    return {
      start() {
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
      },
      stop() {
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
      finalPoint = { ...startPoint };
      clonedCanvas = cloneCanvas(canvas);
      ctx.lineWidth = lineWidth;
    }
    function onMouseUp() {
      startPoint = null;
      finalPoint = null;
      clonedCanvas = null;
      saveCanvas();
    }
    function onMouseMove(event) {
      if (startPoint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(clonedCanvas, 0, 0);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, 2 * Math.PI);
        ctx.arc(event.offsetX, event.offsetY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        finalPoint.x = event.offsetX;
        finalPoint.y = event.offsetY;
      }
    }
  }
}