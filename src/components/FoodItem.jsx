import { useCallback, useEffect, useRef, useState } from 'react';

const SWALLOW_DURATION = 220;

export function FoodItem({ foodKey, url, enabled, mouthRef, onDropSuccess, onDropFail, onHoverChange }) {
  const elRef = useRef(null);
  const dragState = useRef(null);
  const swallowTimeout = useRef(null);
  const [swallowed, setSwallowed] = useState(false);

  useEffect(() => () => { if (swallowTimeout.current) clearTimeout(swallowTimeout.current); }, []);

  const getMouthRectExpanded = useCallback(
    (margin) => {
      if (!mouthRef.current) return null;
      const r = mouthRef.current.getBoundingClientRect();
      return {
        left: r.left - margin,
        right: r.right + margin,
        top: r.top - margin,
        bottom: r.bottom + margin,
        cx: (r.left + r.right) / 2,
        cy: (r.top + r.bottom) / 2,
      };
    },
    [mouthRef]
  );

  const setTransform = (x, y, extra) => {
    if (elRef.current) elRef.current.style.transform = `translate(${x}px, ${y}px)${extra || ''}`;
  };

  const onPointerDown = (e) => {
    if (!enabled) return;
    const el = elRef.current;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    el.classList.remove('returning', 'feeding');
    // Captured once, while the idle float/pop-in animations are still disabled by
    // "dragging" — this is the one clean, untransformed reference point. Every later
    // position (during drag and at drop) is derived from this arithmetically, never by
    // re-querying getBoundingClientRect() on the food element itself (see onPointerUp).
    const startRect = el.getBoundingClientRect();
    dragState.current = { startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, startRect };
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!dragState.current) return;
    const ds = dragState.current;
    ds.dx = e.clientX - ds.startX;
    ds.dy = e.clientY - ds.startY;
    setTransform(ds.dx, ds.dy);
    const rect = getMouthRectExpanded(18);
    const over =
      rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    onHoverChange(!!over);
  };

  const onPointerUp = (e) => {
    if (!dragState.current) return;
    const ds = dragState.current;
    dragState.current = null;
    onHoverChange(false);
    const el = elRef.current;
    // Measure the mouth target while "dragging" (animation:none) is still applied —
    // querying it forces a layout flush, and flushing after dragging had already been
    // removed used to let the food's idle float/pop-in keyframes jump in and silently
    // override its transform for that flush, which is what caused the old "slides to
    // the left" bug: the corrupted reading threw off the swallow target below.
    const rect = getMouthRectExpanded(26);
    const hit =
      rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (hit && rect) {
      // Current screen position, derived purely from the clean drag-start rect plus the
      // accumulated pointer delta — never re-read from the DOM mid-interaction.
      const naturalCx = ds.startRect.left + ds.startRect.width / 2;
      const naturalCy = ds.startRect.top + ds.startRect.height / 2;
      const targetDx = rect.cx - naturalCx;
      const targetDy = rect.cy - naturalCy;
      el.classList.remove('dragging');
      el.classList.add('feeding');
      requestAnimationFrame(() => {
        setTransform(targetDx, targetDy, ' scale(0)');
        if (elRef.current) elRef.current.style.opacity = '0';
      });
      // The CSS transition only drives the *visual* shrink/fade — it never removes the
      // element. Tearing the element out of the render tree right after the transition
      // finishes guarantees nothing is left behind, rather than relying on it staying
      // scaled-to-zero until the parent's stageIndex advances and remounts a new FoodItem.
      swallowTimeout.current = setTimeout(() => setSwallowed(true), SWALLOW_DURATION);
      onDropSuccess();
    } else {
      el.classList.remove('dragging');
      el.classList.add('returning');
      setTransform(0, 0);
    }
  };

  if (swallowed) return null;

  return (
    <div
      ref={elRef}
      className="food-item"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img src={url} alt="" draggable={false} />
    </div>
  );
}
