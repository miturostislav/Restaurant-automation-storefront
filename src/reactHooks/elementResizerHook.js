import { useCallback, useEffect } from 'react';
import buildElementResizer from '../utils/elementResizer';

export default function useElementResizer({ contentRef, wrapperRef, headerRef }) {
  const elementResizerCallback = useCallback(() => buildElementResizer({
    el: contentRef.current,
    wrapper: wrapperRef.current,
    header: headerRef.current,
  }), [contentRef, wrapperRef, headerRef]);

  useEffect(() => {
    const resizer = elementResizerCallback();
    resizer.start();
    return () => resizer.stop();
  }, [elementResizerCallback]);
}