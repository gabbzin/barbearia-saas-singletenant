/** biome-ignore-all lint/suspicious/noExplicitAny: <any pode ser usado aqui> */
import type React from "react";
import { useEffect } from "react";

type OutsideClickEvent = MouseEvent | TouchEvent;

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: OutsideClickEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: OutsideClickEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
