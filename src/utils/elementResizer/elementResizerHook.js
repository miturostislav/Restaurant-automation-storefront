import { useCallback, useEffect, useRef } from 'react';
import buildElementResizer from './elementResizer';

export default function useElementResizer({ contentRef, wrapperRef, headerRef, onResize }) {
  const timerIdRef = useRef(null);

  const elementResizerCallback = useCallback(() => buildElementResizer({
    el: contentRef.current,
    wrapper: wrapperRef.current,
    header: headerRef.current,
    onResize() {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = setTimeout(() => {
        onResize();
      }, 100);
    },
  }), [contentRef, wrapperRef, headerRef, onResize]);

  useEffect(() => {
    const resizer = elementResizerCallback();
    resizer.start();
    return resizer.stop;
  }, [elementResizerCallback]);
}