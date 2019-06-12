import React, { useState, useRef, useEffect } from 'react';
import useElementResizer from './reactHooks/elementResizerHook';

function getPencilPainter(canvas) {
  const lineWidth = 50;
  const ctx = canvas.getContext('2d');
  let startOfLine = null;

  return {
    onMouseDown() {
      startOfLine = {
        x: event.offsetX,
        y: event.offsetY
      };
    },
    onMouseUp() {
      startOfLine = null;
    },
    onMouseMove(event) {
      if (startOfLine) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(startOfLine.x, startOfLine.y);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.arc(startOfLine.x, startOfLine.y, lineWidth / 2, 0, 2 * Math.PI);
        ctx.arc(event.offsetX, event.offsetY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        startOfLine.x = event.offsetX;
        startOfLine.y = event.offsetY;
      }
    }
  }
}

const tools = [
  {
    id: 'pencil',
    icon: '../public/icons/edit.svg',
    getPainter: getPencilPainter,
  },
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
  const [activeTool, setActiveTool] = useState('');
  const contentWrapper = useRef(null);
  const contentPaintRef = useRef(null);
  const contentHeaderRef = useRef(null);
  const canvasRef = useRef(null);

  useElementResizer({
    contentRef: contentPaintRef,
    wrapperRef: contentWrapper,
    headerRef: contentHeaderRef,
  });

  useEffect(() => {

  });

  useEffect(() => {
    handleCanvasPainting(canvasRef.current, activeTool);
  }, [activeTool]);

  return (
    <div className="app">
      <div className="paint-tools">
        {
          tools.map(tool => (
            <div key={tool.id} className={`tool ${activeTool === tool ? 'active' : ''}`} onClick={() => setActiveTool(tool)}>
              <img src={tool.icon} />
            </div>
          ))
        }
      </div>
      <div className="content-wrapper" ref={contentWrapper}>
        <div className="content-paint" ref={contentPaintRef}>
          <h1 className="content-paint__header" ref={contentHeaderRef}>Nothing for now</h1>
          <canvas width={1398} height={662} className="content-paint__canvas" ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}

export default App;

function handleCanvasPainting(canvas, tool) {
  if (!tool) {
    return;
  }
  const painter = tool.getPainter(canvas);
  canvas.addEventListener('mousedown', painter.onMouseDown);
  canvas.addEventListener('mouseup', painter.onMouseUp);
  canvas.addEventListener('mousemove', painter.onMouseMove);
}