import {useEffect} from "react";

let lockCount = 0;
let restorePage: (() => void) | undefined;

export function usePageScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    if (lockCount++ === 0) {
      const body = document.body;
      const scrollY = window.scrollY;
      const keys = ["position", "top", "left", "right", "width", "overflow"] as const;
      const previous = keys.map(key => body.style[key]);
      // Fixed positioning also locks the background in mobile Safari.
      Object.assign(body.style, {position: "fixed", top: `-${scrollY}px`, left: "0", right: "0", width: "100%", overflow: "hidden"});
      restorePage = () => {
        keys.forEach((key, index) => { body.style[key] = previous[index]; });
        window.scrollTo({top: scrollY, left: 0, behavior: "instant"});
      };
    }
    return () => {
      if (--lockCount === 0) {
        restorePage?.();
        restorePage = undefined;
      }
    };
  }, [locked]);
}
