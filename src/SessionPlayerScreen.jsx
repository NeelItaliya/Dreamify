import { useEffect, useRef, useState } from "react";
import { DreamAudioEngine } from "./audio-engine.js";

export default function SessionPlayerScreen({ session, settings, onEnd }) {
  const engineRef = useRef(null);
  const [stage, setStage] = useState("stabilize");

  useEffect(() => {
    const engine = new DreamAudioEngine({
      onStage: setStage,
      onEnd,
      onError: onEnd,
    });
    engineRef.current = engine;
    engine.start(session, settings);

    return () => {
      engine.dispose();
    };
    // Runs once per session; session/settings are fixed for the session's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen player" data-stage={stage}>
      <button className="close" onClick={() => engineRef.current?.dismiss()} aria-label="End session">
        ×
      </button>
      <div className="aurora" />
    </div>
  );
}
