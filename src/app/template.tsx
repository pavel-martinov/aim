"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const LAST_PATHNAME_KEY = "aim:lastPathname";

/** Page transition wrapper using View Transitions API for smooth, cinematic navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    try {
      const previous = window.sessionStorage.getItem(LAST_PATHNAME_KEY);
      const isNavigation = previous && previous !== pathname;

      if (isNavigation) {
        window.scrollTo({ top: 0, behavior: "auto" });

        if (contentRef.current) {
          contentRef.current.classList.add("page-enter");
          const cleanup = () => contentRef.current?.classList.remove("page-enter");
          contentRef.current.addEventListener("animationend", cleanup, { once: true });
        }
      }

      window.sessionStorage.setItem(LAST_PATHNAME_KEY, pathname);
    } catch {
      // sessionStorage may be unavailable in some environments (private mode)
    }
  }, [pathname]);

  return (
    <div ref={contentRef} className="page-content">
      {children}
    </div>
  );
}
