export function setSizeAndRedrawCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const tempCanvas = cloneCanvas(canvas);
  canvas.width = null;
  canvas.height = null;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.drawImage(tempCanvas,0, 0, tempCanvas.width, tempCanvas.height,0,0,canvas.width, canvas.height);
}

export function cloneCanvas(canvas) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
  return tempCanvas;
}