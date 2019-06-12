export default {
  id: 'pencil',
  icon: '../public/icons/edit.svg',
  getPainter: getPencilPainter
}

function getPencilPainter(canvas) {
  const lineWidth = 50;
  const ctx = canvas.getContext('2d');
  let startOfLine = null;

  return {
    onMouseDown() {
      startOfLine = {
        x: event.offsetX,
        y: event.offsetY
      };
    },
    onMouseUp() {
      startOfLine = null;
    },
    onMouseMove(event) {
      if (startOfLine) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(startOfLine.x, startOfLine.y);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.arc(startOfLine.x, startOfLine.y, lineWidth / 2, 0, 2 * Math.PI);
        ctx.arc(event.offsetX, event.offsetY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        startOfLine.x = event.offsetX;
        startOfLine.y = event.offsetY;
      }
    }
  }
}