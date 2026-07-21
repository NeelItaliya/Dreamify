import { useState } from "react";

const TONES = ["calm", "nostalgic", "warm", "release", "ocean", "quiet"];

export default function IntentScreen({ starting, error, onBegin, onOpenSettings }) {
  const [intentText, setIntentText] = useState("");
  const [tone, setTone] = useState(TONES[0]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!intentText.trim() || starting) return;
    onBegin(intentText.trim(), tone);
  }

  return (
    <div className="screen home">
      <header>
        <span className="wordmark">Dreamify</span>
        <button className="icon-button" onClick={onOpenSettings} aria-label="Settings">
          ⋯
        </button>
      </header>

      <div className="intro">
        <p className="eyebrow">Tonight</p>
        <h1>What do you want to feel tonight?</h1>

        <form onSubmit={handleSubmit}>
          <label className="intent-line">
            <textarea
              value={intentText}
              onChange={(event) => setIntentText(event.target.value)}
              placeholder="a memory of the ocean... letting go of today..."
              maxLength={200}
            />
            <span className="intent-count">{intentText.length}/200</span>
          </label>

          <p className="tone-label">Tone</p>
          <div className="tone-tabs">
            {TONES.map((option) => (
              <button
                type="button"
                key={option}
                className={`tone-tab ${option === tone ? "active" : ""}`}
                onClick={() => setTone(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {error && <p className="error-line">{error}</p>}

          <button className="begin-btn" type="submit" disabled={!intentText.trim() || starting}>
            {starting ? "Beginning..." : "Begin"}
            <span>→</span>
          </button>
        </form>
      </div>

      <footer>Calm the mind. Personalize the emotion. Disappear.</footer>
    </div>
  );
}
