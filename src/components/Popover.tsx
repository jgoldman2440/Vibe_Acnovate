import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const GAP = 8; // space between anchor and popover
const VIEWPORT_MARGIN = 8; // minimum distance from the window edges

interface Props {
  // preferred side of the anchor; flips to the other side when there isn't room
  placement?: 'top' | 'bottom';
  children: ReactNode;
}

/**
 * Floating panel rendered into document.body so it sits above every other element
 * and isn't clipped by overflow-hidden/auto ancestors. Anchors to its nearest
 * positioned (`relative`) parent and follows it on scroll/resize.
 */
export default function Popover({ placement = 'bottom', children }: Props) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const popover = popoverRef.current;
    if (!anchor || !popover) return;

    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = popover;
      const maxTop = window.innerHeight - height - VIEWPORT_MARGIN;
      const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN;

      const above = rect.top - height - GAP;
      const below = rect.bottom + GAP;
      let top = placement === 'top' ? above : below;
      if (placement === 'top' && above < VIEWPORT_MARGIN && below <= maxTop) top = below;
      if (placement === 'bottom' && below > maxTop && above >= VIEWPORT_MARGIN) top = above;

      popover.style.top = `${Math.max(VIEWPORT_MARGIN, Math.min(top, maxTop))}px`;
      popover.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft))}px`;
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(popover);
    window.addEventListener('resize', update);
    // capture so scrolling any ancestor container (e.g. the data table) repositions the popover
    window.addEventListener('scroll', update, true);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [placement]);

  return (
    <>
      <span ref={anchorRef} aria-hidden className="absolute inset-0 pointer-events-none" />
      {createPortal(
        <div
          ref={popoverRef}
          className="fixed top-0 left-0 z-1000"
          // keep clicks inside from reaching the document-level "click outside to close" listeners
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
}
