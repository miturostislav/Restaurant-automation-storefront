import React, { useState, useRef, useEffect } from 'react';
import useElementResizer from './utils/elementResizer/elementResizerHook';
import pencil from './paintTools/pencil';
import rectangle from './paintTools/rectangle';
import eraser from './paintTools/eraser';
import text from './paintTools/text';
import selector from './paintTools/selector';
import { setSizeAndRedrawCanvas } from './utils/canvasUtils';
import useUndo from './utils/useUndo';

const tools = [
  pencil,
  rectangle,
  eraser,
  text,
  selector
];

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [lineWidth, setLineWidth] = useState(10);
  const contentWrapper = useRef(null);
  const contentPaintRef = useRef(null);
  const contentHeaderRef = useRef(null);
  const canvasRef = useRef(null);
  const { saveCanvas } = useUndo(canvasRef);

  useElementResizer({
    contentRef: contentPaintRef,
    wrapperRef: contentWrapper,
    headerRef: contentHeaderRef,
    onResize() {
      setSizeAndRedrawCanvas(canvasRef.current);
    }
  });

  useEffect(() => {
    setSizeAndRedrawCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (activeTool) {
      const paintHandler = activeTool.getPainter({
        canvas: canvasRef.current,
        lineWidth,
        saveCanvas,
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