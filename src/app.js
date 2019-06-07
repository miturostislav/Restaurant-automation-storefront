import React, { useEffect, useRef } from 'react';
import buildElementResizer from './utils/elementResizer';

function App() {
  const contentWrapper = useRef(null);
  const contentPaintRef = useRef(null);
  const contentHeaderRef = useRef(null);

  useEffect(() => {
    buildElementResizer({
      el: contentPaintRef.current,
      wrapper: contentWrapper.current,
      header: contentHeaderRef.current,
    });
  }, []);
  return (
    <div className="app">
      <div className="paint-tools">

      </div>
      <div className="content-wrapper" ref={contentWrapper}>
        <div className="content-paint" ref={contentPaintRef}>
          <h1 className="content-paint__header" ref={contentHeaderRef}>Restaurant Floor Plan</h1>
          <canvas className="content-paint__canvas" />
        </div>
      </div>
    </div>
  );
}

export default App;