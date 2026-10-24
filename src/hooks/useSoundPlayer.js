import { useCallback, useEffect, useRef } from 'react';
import { SOUND_VOLUME } from '../data/manifest.js';

export function useSoundPlayer(assets, muted) {
  const activeRef = useRef([]);

  useEffect(() => {
    if (muted) {
      activeRef.current.forEach((a) => {
        try {
          a.pause();
        } catch (e) {
          /* ignore */
        }
      });
      activeRef.current = [];
    }
  }, [muted]);

  return useCallback(
    (key) => {
      if (muted) return;
      const url = assets && assets.sounds && assets.sounds[key];
      if (!url) return;
      try {
        const audio = new Audio(url);
        audio.volume = SOUND_VOLUME[key] != null ? SOUND_VOLUME[key] : 0.55;
        activeRef.current.push(audio);
        audio.addEventListener('ended', () => {
          activeRef.current = activeRef.current.filter((a) => a !== audio);
        });
        const p = audio.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {
        /* audio unavailable — game stays playable */
      }
    },
    [assets, muted]
  );
}
