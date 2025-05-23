import { useState, useEffect } from "react";
import { useMemo, useSyncExternalStore } from "react";

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    viewPortHeight: window.visualViewport.height,
    viewPortWidth: window.visualViewport.width,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        viewPortHeight: window.visualViewport.height,
        viewPortWidth: window.visualViewport.width,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

export function useDimensions(ref) {
  const dimensions = useSyncExternalStore(subscribe, () =>
    JSON.stringify({
      width: ref.current?.offsetWidth ?? 0, // 0 is default width
      height: ref.current?.offsetHeight ?? 0, // 0 is default height
    })
  );
  return useMemo(() => JSON.parse(dimensions), [dimensions]);
}
