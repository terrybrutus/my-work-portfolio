import {useEffect, useRef, useState} from "react";
import {LoadingImage} from "./LoadingImage";

export function DeferredImage({src, alt = "", className}: {src: string; alt?: string; className?: string}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (nearViewport) return;
    if (!("IntersectionObserver" in window)) {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, {rootMargin: "200px"});
    if (imageRef.current) observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [nearViewport]);

  return <LoadingImage imageRef={imageRef} src={nearViewport ? src : undefined} alt={alt} className={className} loadingLabel="preview" loading="lazy" decoding="async" />;
}
