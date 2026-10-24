import {useEffect, useRef, useState, type ImgHTMLAttributes, type RefObject} from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  imageRef?: RefObject<HTMLImageElement | null>;
  loadingLabel?: string;
};

export function LoadingImage({src, alt = "", imageRef, loadingLabel = "image", onLoad, onError, style, ...props}: Props) {
  const ownRef = useRef<HTMLImageElement>(null);
  const ref = imageRef ?? ownRef;
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  const [delayed, setDelayed] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const ready = Boolean(src && loaded === src);
  const error = Boolean(src && failed === src);
  const stalled = Boolean(src && delayed === src);

  useEffect(() => {
    if (src && ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(src);
  }, [src, ref, attempt]);

  useEffect(() => {
    if (!src || ready || error) return;
    const timer = window.setTimeout(() => setDelayed(src), 15000);
    return () => window.clearTimeout(timer);
  }, [src, ready, error, attempt]);

  return <>
    <img {...props} key={attempt} ref={ref} src={src} alt={alt} aria-busy={Boolean(src && !ready)}
      style={{...style, opacity: ready ? style?.opacity : 0}}
      onLoad={event => { setLoaded(src); setFailed(undefined); onLoad?.(event); }}
      onError={event => { setFailed(src); onError?.(event); }} />
    {src && !ready ? <span className="resource-feedback" role="status">
      <span>{error ? `This ${loadingLabel} could not load.` : stalled ? `This ${loadingLabel} is taking longer to load.` : `Loading ${loadingLabel}…`}</span>
      {error || stalled ? <button type="button" onClick={() => { setFailed(undefined); setDelayed(undefined); setAttempt(value => value + 1); }}>Try again</button> : null}
    </span> : null}
  </>;
}
