export default function buildCanvasPainting(canvas, tool) {
  const painter = tool.getPainter(canvas);

  return {
    start() {
      canvas.addEventListener('mousedown', painter.onMouseDown);
      canvas.addEventListener('mouseup', painter.onMouseUp);
      canvas.addEventListener('mousemove', painter.onMouseMove);
    },
    stop() {
      canvas.removeEventListener('mousedown', painter.onMouseDown);
      canvas.removeEventListener('mouseup', painter.onMouseUp);
      canvas.removeEventListener('mousemove', painter.onMouseMove);
    }
  }
}