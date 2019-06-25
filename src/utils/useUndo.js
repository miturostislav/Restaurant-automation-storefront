import { useEffect, useRef } from 'react';
import { cloneCanvas, redrawCanvas, setSizeAndRedrawCanvas } from './canvasUtils';

const isMac = navigator.platform === 'MacIntel';

export default function useUndo(canvasRef) {
  const canvasStates = useRef([]);
  const undoCounter = useRef(0);

  useEffect(() => {
    let isCtlrPressed = false;

    setSizeAndRedrawCanvas(canvasRef.current);
    canvasStates.current.push(cloneCanvas(canvasRef.current));
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };

    function onKeyDown(e) {
      if (isMac ? e.key === 'Meta' : e.key === 'Control') {
        isCtlrPressed = true;
      }
      if (e.key === 'z' && isCtlrPressed) {
        if (e.shiftKey) {
          undoCounter.current = Math.max(0, undoCounter.current - 1);
        } else {
          undoCounter.current = Math.min(canvasStates.current.length - 1, undoCounter.current + 1);
        }
        const ctx = canvasRef.current.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        redrawCanvas(canvasRef.current, canvasStates.current[canvasStates.current.length - 1 - undoCounter.current]);
        ctx.restore();
      }
    }
    function onKeyUp(e) {
      if (isMac ? e.key === 'Meta' : e.key === 'Control') {
        isCtlrPressed = false;
      }
    }
  }, []);

  return {
    saveCanvas() {
      canvasStates.current.splice(canvasStates.current.length - undoCounter.current);
      canvasStates.current.push(cloneCanvas(canvasRef.current));
      undoCounter.current = 0;
    }
  }
}