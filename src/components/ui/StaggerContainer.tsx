"use client";

import React, { Children, cloneElement, isValidElement } from "react";

type StaggerContainerProps = {
  children: React.ReactNode;
  /** Base delay before first item (default 0) */
  baseDelay?: number;
  /** Delay between each child element (default 0.1s) */
  staggerDelay?: number;
  className?: string;
};

/**
 * Wraps children and injects incremental delay props for staggered animations.
 * Works with RevealOnScroll or any component accepting a `delay` prop.
 */
export default function StaggerContainer({
  children,
  baseDelay = 0,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  const staggeredChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    
    const delay = baseDelay + index * staggerDelay;
    return cloneElement(child as React.ReactElement<{ delay?: number }>, {
      delay,
    });
  });

  return <div className={className}>{staggeredChildren}</div>;
}
