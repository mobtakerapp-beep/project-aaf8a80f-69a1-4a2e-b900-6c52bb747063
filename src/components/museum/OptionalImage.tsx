import { useState } from "react";

/** Optional supplied artwork never shows a broken-image icon or empty frame. */
export function OptionalImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setFailed(true)}
    className={loaded ? className : "hidden"} />;
}