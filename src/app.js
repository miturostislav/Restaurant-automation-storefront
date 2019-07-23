import React, { useState, useRef, useEffect } from 'react';
import useElementResizer from './utils/elementResizer/elementResizerHook';
import pencil from './paintTools/pencil';
import rectangle from './paintTools/rectangle';
import eraser from './paintTools/eraser';
import text from './paintTools/text';
import transformer from './paintTools/transformer';
import line from './paintTools/line';
import circle from './paintTools/circle';
import { setSizeAndRedrawCanvas } from './utils/canvasUtils';
import useUndo from './utils/useUndo';

const tools = [
  pencil,
  rectangle,
  eraser,
  text,
  transformer,
  line,
  circle
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
    const canvasURL = localStorage.getItem('admin_board');

    setSizeAndRedrawCanvas(canvasRef.current);
    if (canvasURL) {
      const img = new Image;
      img.src = canvasURL;
      img.onload = function () {
        canvasRef.current.getContext('2d').drawImage(img, 0, 0);
      };
    }
  }, []);

  useEffect(() => {
    if (activeTool) {
      const paintHandler = activeTool.getPainter({
        canvas: canvasRef.current,
        lineWidth,
        saveCanvas: save,
      });

      paintHandler.start();
      return paintHandler.stop;
    }
  }, [activeTool, lineWidth]);

  function save() {
    saveCanvas();
    localStorage.setItem('admin_board', canvasRef.current.toDataURL());
  }

  function clearCanvas() {
    canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    save();
  }

  function exportCanvas() {
    canvasRef.current.toBlob((blob) => {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);

      a.style.setProperty('display', 'none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'board';
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  function importCanvas() {
    const reader = new FileReader();
    reader.onload = function(){
      const dataURL = reader.result;
      const img = new Image();

      img.onload = () => {
        canvasRef.current.getContext('2d').drawImage(img, 0, 0);
        save();
      };
      img.src = dataURL;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

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
          <button className="clear-cavans" onClick={clearCanvas}>Clear</button>
          <button className="export-cavans" onClick={exportCanvas}>Export</button>
          <input type="file" accept="image/x-png,image/gif,image/jpeg" className="import-cavans" onChange={importCanvas} onClick={(e) => e.target.value = null}/>
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