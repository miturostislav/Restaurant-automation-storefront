import pencil from './pencil';

export default {
  id: 'eraser',
  icon: '../public/icons/eraser.svg',
  getPainter({ canvas, lineWidth, saveCanvas }) {
    const pencilPainter = pencil.getPainter({ canvas, lineWidth, saveCanvas });
    const ctx = canvas.getContext('2d');

    return {
      start() {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        pencilPainter.start();
      },
      stop() {
        ctx.restore();
        pencilPainter.stop();
      }
    };
  }
}