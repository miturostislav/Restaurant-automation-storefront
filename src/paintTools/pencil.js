export default {
  id: 'pencil',
  icon: '../public/icons/edit.svg',
  getPainter: getPencilPainter
}

function getPencilPainter(canvas) {
  const lineWidth = 10;
  const ctx = canvas.getContext('2d');
  let startPoint = null;

  ctx.lineWidth = lineWidth;

  return {
    onMouseDown(event) {
      startPoint = {
        x: event.offsetX,
        y: event.offsetY
      };
      ctx.lineWidth = lineWidth;
    },
    onMouseUp() {
      startPoint = null;
    },
    onMouseMove(event) {
      if (startPoint) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, 2 * Math.PI);
        ctx.arc(event.offsetX, event.offsetY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        startPoint.x = event.offsetX;
        startPoint.y = event.offsetY;
      }
    }
  }
}