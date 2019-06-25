export function setSizeAndRedrawCanvas(canvas) {
  const tempCanvas = cloneCanvas(canvas);
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  redrawCanvas(canvas, tempCanvas);
}

export function redrawCanvas(canvas, newCanvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(newCanvas,0, 0, newCanvas.width, newCanvas.height,0,0,canvas.width, canvas.height);
}

export function cloneCanvas(canvas) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
  return tempCanvas;
}