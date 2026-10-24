import { useEffect } from 'react';
import { useConfettiField } from '../hooks/useConfettiField.js';

/* Runs its own self-contained 0-6s sequence as soon as it mounts (celebration start):
   a big opening burst, a sustained full-width shower, then a tapering trickle to a
   full stop — independent of the hamburger's jump timing, so it doesn't need to be
   driven/triggered from Game's celebration effect. */
export function ConfettiLayer() {
  const { canvasRef, spawn } = useConfettiField();

  useEffect(() => {
    const timeouts = [];
    const sched = (fn, ms) => { timeouts.push(setTimeout(fn, ms)); };
    let shower = null;
    let taper = null;

    spawn(80); // 0-0.5s: big full-width opening burst

    sched(() => {
      shower = setInterval(() => spawn(5), 90); // 0.5-4s: sustained full-width shower
    }, 500);

    sched(() => {
      if (shower) { clearInterval(shower); shower = null; }
      let tickCount = 0;
      taper = setInterval(() => { // 4-6s: taper down to nothing
        tickCount += 1;
        const n = Math.max(0, 3 - Math.floor(tickCount / 3));
        if (n > 0) spawn(n);
        if (tickCount >= 9 && taper) { clearInterval(taper); taper = null; }
      }, 220);
    }, 4000);

    sched(() => {
      if (shower) { clearInterval(shower); shower = null; }
      if (taper) { clearInterval(taper); taper = null; }
    }, 6000);

    return () => {
      timeouts.forEach(clearTimeout);
      if (shower) clearInterval(shower);
      if (taper) clearInterval(taper);
    };
  }, [spawn]);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
