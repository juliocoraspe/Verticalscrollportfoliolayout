import { useEffect, useState } from 'react';

export function useViewportWidth(defaultWidth = 1200) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : defaultWidth,
  );

  useEffect(() => {
    const handleResize = () => {
      const nextWidth = window.innerWidth;
      setViewportWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportWidth;
}
