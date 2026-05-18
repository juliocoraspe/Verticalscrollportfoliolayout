import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* Fits a mobile scene into the SAFE BAND between the top and bottom
   progress HUDs. It measures the content's true natural height and, if
   that exceeds the band, applies a uniform downscale so the whole scene
   shows in ONE screen — never overlapping the HUDs and never cropped.
   Scale is clamped to [MIN, 1]: content never enlarges, and the floor
   stops it collapsing on extreme viewports. Short scenes stay at scale
   1 (full, accessible font size); only genuinely tall scenes shrink.
   Shared by both accessibility workflows so their behaviour is identical. */

// Leave a little air so a scene that *just* overflows still has a small
// gap to the HUDs rather than sitting flush against them.
const SAFETY_PAD = 12;
const MIN_SCALE = 0.4;

export function FitToBand({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const band = outer.parentElement;
    if (!band) return;

    // offsetHeight is the element's LAYOUT height — it ignores the CSS
    // transform on the parent, so this is the true natural (unscaled)
    // content height regardless of the current scale. (getBoundingClientRect
    // would return the post-transform size and create a feedback loop.)
    const contentH = inner.offsetHeight;
    const bandH = band.clientHeight - SAFETY_PAD;
    // Band may not have its final height on the very first pass (the
    // workflow is far down the page); skip until both are real.
    if (bandH <= 0 || contentH <= 0) return;

    const next = Math.min(1, Math.max(MIN_SCALE, bandH / contentH));
    setScale((s) => (Math.abs(s - next) < 0.004 ? s : next));
  }, []);

  useLayoutEffect(() => {
    measure();
    // The scene mounts while hidden (opacity 0) far from the viewport, so
    // its final laid-out size may not be ready on the first pass. Re-measure
    // across a few frames, after fonts settle, on resize, and whenever the
    // band or content box changes size.
    const rafs = [
      requestAnimationFrame(measure),
      requestAnimationFrame(() => requestAnimationFrame(measure)),
    ];
    const timers = [
      setTimeout(measure, 120),
      setTimeout(measure, 400),
      setTimeout(measure, 1000),
    ];

    const ro = new ResizeObserver(measure);
    if (innerRef.current) ro.observe(innerRef.current);
    const band = outerRef.current?.parentElement;
    if (band) ro.observe(band);

    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      rafs.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
