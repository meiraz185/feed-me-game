import { useEffect, useState } from 'react';
import { Game } from './components/Game.jsx';
import { ASSET_MANIFEST, MUTE_KEY, getInitialMuted } from './data/manifest.js';

export default function App() {
  const [muted, setMuted] = useState(getInitialMuted);

  // Warm the browser's image cache in the background — this never blocks the first paint
  // or shows any loading/upload screen, it just makes the later feeding/celebration
  // animations snappier on a slow connection.
  useEffect(() => {
    const sources = [
      ...Object.values(ASSET_MANIFEST.characters),
      ...Object.values(ASSET_MANIFEST.foods),
      ...ASSET_MANIFEST.burgerFrames,
    ];
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const toggleMute = () => {
    setMuted((v) => {
      const nv = !v;
      try {
        localStorage.setItem(MUTE_KEY, nv ? '1' : '0');
      } catch (e) {
        /* ignore */
      }
      return nv;
    });
  };

  return <Game assets={ASSET_MANIFEST} muted={muted} onToggleMute={toggleMute} />;
}
