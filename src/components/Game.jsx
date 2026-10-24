import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterStage } from './CharacterStage.jsx';
import { FoodItem } from './FoodItem.jsx';
import { ConfettiLayer } from './ConfettiLayer.jsx';
import { MuteIcon, SoundIcon } from './Icons.jsx';
import { useSoundPlayer } from '../hooks/useSoundPlayer.js';
import { CHAR_KEYS, FOOD_KEYS, DIALOGUE, TIMING, CELEB_TIMING, BURGER_FRAME_COUNT } from '../data/manifest.js';

export function Game({ assets, muted, onToggleMute }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [displayedCharIdx, setDisplayedCharIdx] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [showInstruction, setShowInstruction] = useState(true);
  const [mouthHot, setMouthHot] = useState(false);
  const [imgClass, setImgClass] = useState('');
  const [celebBurgerSrc, setCelebBurgerSrc] = useState(null);
  const [showVictoryMsg, setShowVictoryMsg] = useState(false);
  const [showReplayBtn, setShowReplayBtn] = useState(false);
  const timeouts = useRef([]);
  const celebFrameInterval = useRef(null);
  const mouthRef = useRef(null);
  const play = useSoundPlayer(assets, muted);

  const resetGame = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setStageIndex(0);
    setDisplayedCharIdx(0);
    setPhase('idle');
    setShowInstruction(true);
    setImgClass('');
    setCelebBurgerSrc(null);
    setShowVictoryMsg(false);
    setShowReplayBtn(false);
  }, []);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const schedule = (fn, ms) => {
    timeouts.current.push(setTimeout(fn, ms));
  };
  const charKey = CHAR_KEYS[displayedCharIdx];
  const isFinalStage = stageIndex === FOOD_KEYS.length - 1;
  const foodKey = FOOD_KEYS[stageIndex];
  const isCelebrating = phase === 'celebrating';

  const handleDropSuccess = useCallback(() => {
    setPhase('eating');
    setShowInstruction(false);
    play('pop');

    schedule(() => {
      setPhase('chewing');
      setImgClass('chew');
      play('crunch');
    }, TIMING.chew);
    schedule(() => {
      setPhase('transforming');
      setImgClass('squeeze');
    }, TIMING.transform);
    schedule(() => {
      setDisplayedCharIdx(stageIndex + 1);
      setImgClass('pop-in');
      play('boing');
    }, TIMING.transform + 150);
    schedule(() => {
      play('plop');
      if (isFinalStage) {
        setPhase('celebrating');
      } else {
        setStageIndex(stageIndex + 1);
        setPhase('next-food');
      }
    }, TIMING.nextFood);
    if (!isFinalStage) {
      schedule(() => {
        setPhase('idle');
        setImgClass('');
      }, TIMING.resume);
    }
  }, [stageIndex, isFinalStage, play]);

  /* The normal burger (already shown via the shared transform above) smoothly becomes the
     happy hamburger, jumps twice, then reveals the victory panel — all inside the same
     character container used throughout gameplay. */
  useEffect(() => {
    if (phase !== 'celebrating') return;
    const frames = assets.burgerFrames.filter(Boolean);
    const hasFrames = frames.length === BURGER_FRAME_COUNT;
    const csched = (fn, ms) => {
      timeouts.current.push(setTimeout(fn, ms));
    };

    csched(() => {
      if (hasFrames) setCelebBurgerSrc(assets.burgerFrames[0]);
      setImgClass('celeb-swap');
      play('win');
    }, CELEB_TIMING.swap);

    csched(() => {
      setImgClass('celeb-jump');
      play('boing');
      if (hasFrames) {
        let i = 0;
        celebFrameInterval.current = setInterval(() => {
          i = (i + 1) % BURGER_FRAME_COUNT;
          setCelebBurgerSrc(assets.burgerFrames[i]);
        }, 110);
      }
    }, CELEB_TIMING.jump1);

    csched(() => {
      play('boing');
    }, CELEB_TIMING.jump2);

    csched(() => {
      setImgClass('');
      if (celebFrameInterval.current) {
        clearInterval(celebFrameInterval.current);
        celebFrameInterval.current = null;
      }
      if (hasFrames) setCelebBurgerSrc(assets.burgerFrames[0]);
    }, CELEB_TIMING.settle);

    csched(() => setShowVictoryMsg(true), CELEB_TIMING.message);
    csched(() => setShowReplayBtn(true), CELEB_TIMING.replay);

    return () => {
      if (celebFrameInterval.current) {
        clearInterval(celebFrameInterval.current);
        celebFrameInterval.current = null;
      }
    };
  }, [phase]);

  const dragEnabled = phase === 'idle' || phase === 'next-food';
  const effectiveCharSrc = isCelebrating ? celebBurgerSrc || assets.characters.burger : assets.characters[charKey];

  return (
    <div className="stage-root">
      <div className="header-row">
        <div className="header-tools">
          <div className="counter-chip mono">{Math.min(stageIndex + 1, 6)} / 6</div>
          <button
            className="mute-btn"
            onClick={onToggleMute}
            aria-label={muted ? 'הפעל קול' : 'השתק קול'}
            aria-pressed={muted}
          >
            {muted ? <MuteIcon /> : <SoundIcon />}
          </button>
        </div>
      </div>

      <div className={`play-area${isCelebrating ? ' celebrating' : ''}`}>
        <CharacterStage
          charKey={charKey}
          charSrc={effectiveCharSrc}
          imgClass={imgClass}
          mouthRef={mouthRef}
          mouthHot={mouthHot}
          dialogue={DIALOGUE[charKey]}
          dialogueKey={displayedCharIdx}
          showInstruction={showInstruction && stageIndex === 0 && phase === 'idle'}
        />
        <div className="food-zone">
          {isCelebrating ? (
            showVictoryMsg && (
              <div className="victory-panel">
                <h2>תודה לך!</h2>
                <p>עכשיו אני שבע!</p>
                {showReplayBtn && (
                  <button className="replay-btn" onClick={resetGame}>
                    עוד ביס? ↻
                  </button>
                )}
              </div>
            )
          ) : (
            <FoodItem
              key={stageIndex}
              foodKey={foodKey}
              url={assets.foods[foodKey]}
              enabled={dragEnabled}
              mouthRef={mouthRef}
              onDropSuccess={handleDropSuccess}
              onDropFail={() => {}}
              onHoverChange={setMouthHot}
            />
          )}
        </div>
      </div>

      <div className="progress-row">
        {FOOD_KEYS.map((k, i) => {
          const done = i < stageIndex || isCelebrating;
          const active = i === stageIndex && !isCelebrating;
          return (
            <div key={k} className={`progress-dot${done ? ' done' : active ? ' active' : ''}`}>
              {i + 1}
            </div>
          );
        })}
      </div>

      {isCelebrating && <ConfettiLayer />}
    </div>
  );
}
