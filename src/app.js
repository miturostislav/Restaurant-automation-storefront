import React, { useState, useRef } from 'react';
import useElementResizer from './reactHooks/elementResizerHook';

function App() {
  const [activeTool, setActiveTool] = useState('');
  const contentWrapper = useRef(null);
  const contentPaintRef = useRef(null);
  const contentHeaderRef = useRef(null);
  const tools = [
    {
      id: 'pencil', icon: '../public/icons/edit.svg'
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

  useElementResizer({
    contentRef: contentPaintRef,
    wrapperRef: contentWrapper,
    headerRef: contentHeaderRef,
  });

  return (
    <div className="app">
      <div className="paint-tools">
        {
          tools.map(tool => (
            <div key={tool.id} className={`tool ${activeTool === tool.id ? 'active' : ''}`} onClick={() => setActiveTool(tool.id)}>
              <img src={tool.icon} />
            </div>
          ))
        }
      </div>
      <div className="content-wrapper" ref={contentWrapper}>
        <div className="content-paint" ref={contentPaintRef}>
          <h1 className="content-paint__header" ref={contentHeaderRef}>Nothing for now</h1>
          <canvas className="content-paint__canvas" />
        </div>
      </div>
    </div>
  );
}

export default App;