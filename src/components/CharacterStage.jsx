import { MOUTH_HITBOX, BUBBLE_OFFSET } from '../data/manifest.js';

export function CharacterStage({ charKey, charSrc, imgClass, mouthRef, mouthHot, dialogue, dialogueKey, showInstruction }) {
  const hb = MOUTH_HITBOX[charKey] || MOUTH_HITBOX.frog;
  const bo = BUBBLE_OFFSET[charKey];
  return (
    <div className="char-zone">
      <div className="char-img-wrap">
        <img className={`char-img ${imgClass}`} src={charSrc} alt="" draggable={false} />
        <div
          ref={mouthRef}
          className={`mouth-hitbox${mouthHot ? ' hot' : ''}`}
          style={{
            left: `${hb.xPct - hb.wPct / 2}%`,
            top: `${hb.yPct - hb.hPct / 2}%`,
            width: `${hb.wPct}%`,
            height: `${hb.hPct}%`,
          }}
        />
        {bo && (
          <div
            className="speech-bubble"
            key={dialogueKey}
            style={{ top: `calc(2% - ${bo.upPx}px)`, left: `calc(2% - ${bo.leftPx}px)` }}
          >
            <p dir="rtl">{dialogue}</p>
          </div>
        )}
        {showInstruction && (
          <div className="instruction-tip" dir="rtl">
            גררו לפה!
          </div>
        )}
      </div>
    </div>
  );
}
