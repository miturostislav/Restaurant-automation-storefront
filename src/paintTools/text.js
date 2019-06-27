export default {
  id: 'text',
  icon: '../public/icons/letter.svg',
  getPainter({ canvas, lineWidth, saveCanvas }) {
    const ctx = canvas.getContext('2d');
    let startPoint;
    let textareaLeftPosition;
    const textarea = document.createElement('textarea');

    ctx.font = `${lineWidth}px Arial`;

    return {
      start() {
        canvas.addEventListener('mousedown', onMouseDown);
        textarea.addEventListener('input', onInput);
        textarea.style.setProperty('position', 'fixed');
        textarea.style.setProperty('font', `400 ${ctx.font}`);
        textarea.classList.add('canvas-text');
        document.body.appendChild(textarea);
      },
      stop() {
        canvas.removeEventListener('mousedown', onMouseDown);
        document.body.removeChild(textarea);
      }
    };

    function onMouseDown(e) {
      saveCanvas();
      textareaLeftPosition =  e.clientX;
      textarea.style.setProperty('top', `${e.clientY}px`);
      textarea.style.setProperty('left', `${textareaLeftPosition}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          textarea.focus();
        })
      });

      startPoint = {
        x: event.offsetX,
        y: event.offsetY
      };
    }

    function onInput(e) {
      if (e.data) {
        const adjustedTextHeight = lineWidth * 100 / 110;
        ctx.fillText(e.data, startPoint.x, startPoint.y + adjustedTextHeight);
        textareaLeftPosition += ctx.measureText(e.data).width;
        textarea.style.setProperty('left', `${textareaLeftPosition}px`);
        textarea.value = '';
        startPoint.x += ctx.measureText(e.data).width;
      }
    }
  }
}