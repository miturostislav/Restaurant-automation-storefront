import pencil from './pencil';

export default {
  id: 'pencil',
  icon: '../public/icons/eraser.svg',
  getPainter(canvas) {
    const pencilPainter = pencil.getPainter(canvas);
    const ctx = canvas.getContext('2d');
    let initialGlobalCompositeOperation;

    return {
      start() {
        initialGlobalCompositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-out';
        pencilPainter.start();
      },
      stop() {
        ctx.globalCompositeOperation = initialGlobalCompositeOperation;
        pencilPainter.stop();
      }
    };
  }
}