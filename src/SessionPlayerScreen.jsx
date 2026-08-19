import { useEffect, useRef, useState } from "react";
import { DreamAudioEngine } from "./audio-engine.js";
import { CloseIcon } from "./icons.jsx";

const STAGE_STATUS = {
  stabilize: "Mind stabilization audio is playing.",
  prime: "Personalized priming audio is playing.",
  release: "The session audio is fading gently to silence.",
};

export default function SessionPlayerScreen({ session, settings, onEnd }) {
  const engineRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [stage, setStage] = useState("stabilize");

  useEffect(() => {
    const engine = new DreamAudioEngine({
      onStage: setStage,
      onEnd,
      onError: onEnd,
    });
    engineRef.current = engine;
    closeButtonRef.current?.focus();
    engine.start(session, settings);

    return () => {
      engine.dispose();
    };
    // Runs once per session; session/settings are fixed for the session's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="screen player" data-stage={stage} aria-labelledby="session-title">
      <h1 id="session-title" className="sr-only">
        Session in progress
      </h1>
      <p className="sr-only" role="status" aria-live="polite">
        {STAGE_STATUS[stage]}
      </p>

      <div className="player-ambient" aria-hidden="true">
        <span className="player-cloud player-cloud-one" />
        <span className="player-cloud player-cloud-two" />
        <span className="player-cloud player-cloud-three" />
      </div>

      <button
        ref={closeButtonRef}
        className="close"
        type="button"
        onClick={() => engineRef.current?.dismiss()}
        aria-label="End session and fade audio"
      >
        <CloseIcon />
      </button>

      <div className="session-visual" aria-hidden="true">
        <span className="breathing-ring breathing-ring-outer" />
        <span className="breathing-ring breathing-ring-inner" />
        <span className="breathing-core" />
        <svg className="wave" viewBox="0 0 720 180" preserveAspectRatio="none">
          <path
            className="wave-path wave-stabilize"
            d="M0,90 C60,82 120,98 180,90 C240,82 300,98 360,90 C420,82 480,98 540,90 C600,82 660,98 720,90"
          />
          <path
            className="wave-path wave-prime"
            d="M0,90 C60,58 120,122 180,90 C240,58 300,122 360,90 C420,58 480,122 540,90 C600,58 660,122 720,90"
          />
          <path
            className="wave-path wave-release"
            d="M0,90 C60,86 120,94 180,90 C240,86 300,94 360,90 C420,86 480,94 540,90 C600,86 660,94 720,90"
          />
        </svg>
      </div>
    </main>
  );
}
