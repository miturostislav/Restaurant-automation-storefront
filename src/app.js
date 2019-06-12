import React, { useState, useRef, useEffect } from 'react';
import useElementResizer from './utils/elementResizer/elementResizerHook';
import pencil from './paintTools/pencil';
import rectangle from './paintTools/rectangle';
import { redrawCanvasOnResize } from './utils/canvasUtils';

const tools = [
  pencil,
  rectangle,
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
      redrawCanvasOnResize(canvasRef.current);
    }
  });

  useEffect(() => {
    redrawCanvasOnResize(canvasRef.current);
  }, []);

  useEffect(() => {
    if (activeTool) {
      const paintHandler = activeTool.getPainter(canvasRef.current);

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