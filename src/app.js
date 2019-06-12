import React, { useState, useRef, useEffect } from 'react';
import useElementResizer from './utils/elementResizer/elementResizerHook';
import pencil from './paintTools/pencil';
import canvasPaintHandler from './paintTools/canvasPaintHandler';

const tools = [
  pencil,
  {
    id: 'pencil1', icon: '../public/icons/edit.svg'
  },
  {
    id: 'pencil2', icon: '../public/icons/edit.svg'
  },
  {
    id: 'pencil3', icon: '../public/icons/edit.svg'
  }
];

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const contentWrapper = useRef(null);
  const contentPaintRef = useRef(null);
  const contentHeaderRef = useRef(null);
  const canvasRef = useRef(null);

  useElementResizer({
    contentRef: contentPaintRef,
    wrapperRef: contentWrapper,
    headerRef: contentHeaderRef,
    onResize() {
      redrawCanvas(canvasRef.current);
    }
  });

  useEffect(() => {
    redrawCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (activeTool) {
      const paintHandler = canvasPaintHandler(canvasRef.current, activeTool);

      paintHandler.start();
      return paintHandler.stop;
    }
  }, [activeTool]);

  return (
    <div className="app">
      <div className="paint-tools">
        {
          tools.map(tool => (
            <div
              key={tool.id}
              className={`tool ${activeTool === tool ? 'active' : ''}`}
              onClick={() => tool === activeTool ? setActiveTool(null) : setActiveTool(tool)}>
              <img src={tool.icon} />
            </div>
          ))
        }
      </div>
      <div className="content-wrapper" ref={contentWrapper}>
        <div className="content-paint" ref={contentPaintRef}>
          <h1 className="content-paint__header" ref={contentHeaderRef}>Nothing for now</h1>
          <canvas className="content-paint__canvas" ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default App;

function redrawCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const tempCanvas=document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
  canvas.width = null;
  canvas.height = null;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.drawImage(tempCanvas,0, 0, tempCanvas.width, tempCanvas.height,0,0,canvas.width, canvas.height);
}