import type { RefObject } from "react";

declare global {
  interface Window {
    navbarLogoRef: RefObject<SVGSVGElement | null>;
  }
}
