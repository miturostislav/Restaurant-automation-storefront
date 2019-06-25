import React, { useState, useRef, useEffect } from 'react';
import useElementResizer from './utils/elementResizer/elementResizerHook';
import pencil from './paintTools/pencil';
import rectangle from './paintTools/rectangle';
import eraser from './paintTools/eraser';
import text from './paintTools/text';
import { setSizeAndRedrawCanvas, cloneCanvas, redrawCanvas } from './utils/canvasUtils';

const tools = [
  pencil,
  rectangle,
  eraser,
  text
];

const isMac = navigator.platform === 'MacIntel';

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [lineWidth, setLineWidth] = useState(10);
  const contentWrapper = useRef(null);
  const contentPaintRef = useRef(null);
  const contentHeaderRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasStates = useRef([]);
  const undoCounter = useRef(0);

  useElementResizer({
    contentRef: contentPaintRef,
    wrapperRef: contentWrapper,
    headerRef: contentHeaderRef,
    onResize() {
      setSizeAndRedrawCanvas(canvasRef.current);
    }
  });

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

  useEffect(() => {
    if (activeTool) {
      const paintHandler = activeTool.getPainter({
        canvas: canvasRef.current,
        lineWidth,
        saveCanvas() {
          canvasStates.current.splice(canvasStates.current.length - undoCounter.current);
          canvasStates.current.push(cloneCanvas(canvasRef.current));
          undoCounter.current = 0;
        },
      });

      paintHandler.start();
      return paintHandler.stop;
    }
  }, [activeTool, lineWidth]);

  return (
    <div className="app">
      <div className="paint-tools">
        {
          tools.map(tool => (
            <div
              key={tool.id}
              className={`tool ${activeTool === tool ? 'active' : ''}`}
              onClick={() => tool === activeTool ? setActiveTool(null) : setActiveTool(tool)}>
              <img className="icon" src={tool.icon} />
            </div>
          ))
        }
      </div>
      <div className="content-and-top-wrapper">
        <div className="top-side">
          <input className="line-width-range" type="range" min="1" max="100" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
        </div>
        <div className="content-wrapper" ref={contentWrapper}>
          <div className="content-paint" ref={contentPaintRef}>
            <h1 className="content-paint__header" ref={contentHeaderRef}>Nothing for now</h1>
            <canvas className="content-paint__canvas" ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;