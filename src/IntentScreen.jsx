import {
  ArrowRightIcon,
  BrandMark,
  MoonIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
} from "./icons.jsx";

const TONES = ["calm", "nostalgic", "warm", "release", "ocean", "quiet"];

export default function IntentScreen({
  intentText,
  onIntentTextChange,
  tone,
  onToneChange,
  starting,
  error,
  onBegin,
  onOpenSettings,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    if (!intentText.trim() || starting) return;
    onBegin(intentText.trim(), tone);
  }

  return (
    <div className="screen home">
      <header className="site-header">
        <div className="brand-lockup" aria-label="Dreamify home">
          <BrandMark className="brand-mark" />
          <span className="brand-copy">
            <strong>Dreamify</strong>
            <small>Pre-sleep rituals</small>
          </span>
        </div>

        <button
          className="settings-button"
          type="button"
          onClick={onOpenSettings}
          disabled={starting}
        >
          <SettingsIcon />
          <span>Settings</span>
        </button>
      </header>

      <main className="home-main">
        <section className="hero-copy" aria-labelledby="home-title">
          <div className="soft-badge">
            <MoonIcon />
            <span>Your quiet evening ritual</span>
          </div>

          <h1 id="home-title">
            What would you like to <em>feel tonight?</em>
          </h1>
          <p className="hero-description">
            Bring a feeling, a memory, or a place to mind. Dreamify turns it into a gentle audio
            experience that settles softly into silence.
          </p>

          <div className="assurance-list" aria-label="Experience principles">
            <div>
              <span className="assurance-icon assurance-icon-sage">
                <ShieldIcon />
              </span>
              <p>
                <strong>Gentle by design</strong>
                <span>No commands, pressure, or promises.</span>
              </p>
            </div>
            <div>
              <span className="assurance-icon assurance-icon-lilac">
                <SparklesIcon />
              </span>
              <p>
                <strong>Personal to you</strong>
                <span>Shaped around the emotion you choose.</span>
              </p>
            </div>
          </div>
        </section>

        <form
          className="intent-card"
          onSubmit={handleSubmit}
          aria-busy={starting}
          aria-describedby={error ? "session-error" : undefined}
        >
          <div className="card-heading">
            <div>
              <p className="eyebrow">Tonight’s intention</p>
              <h2>Create your session</h2>
            </div>
            <span className="personalized-pill">
              <span /> Personalized
            </span>
          </div>

          <div className="intent-field">
            <div className="field-label-row">
              <label htmlFor="intent-text">What’s on your mind?</label>
              <span className="intent-count">{intentText.length}/200</span>
            </div>
            <textarea
              id="intent-text"
              value={intentText}
              onChange={(event) => onIntentTextChange(event.target.value)}
              placeholder="A memory of the ocean, warmth, letting go of today…"
              maxLength={200}
              rows={4}
              required
              disabled={starting}
              aria-describedby="intent-hint"
            />
            <p id="intent-hint" className="field-hint">
              A few words are enough. Keep it simple and honest.
            </p>
          </div>

          <fieldset className="tone-picker">
            <legend>Choose a tone</legend>
            <div className="tone-tabs">
              {TONES.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`tone-tab ${option === tone ? "active" : ""}`}
                  data-tone={option}
                  onClick={() => onToneChange(option)}
                  disabled={starting}
                  aria-pressed={option === tone}
                >
                  <span className="tone-dot" aria-hidden="true" />
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <p id="session-error" className="error-line" role="alert">
              {error}
            </p>
          )}

          {starting && (
            <span className="sr-only" role="status" aria-live="polite">
              Preparing your personalized session.
            </span>
          )}

          <button
            className="primary-button begin-button"
            type="submit"
            disabled={!intentText.trim() || starting}
          >
            <span>{starting ? "Preparing your session…" : "Begin session"}</span>
            {starting ? <i className="button-spinner" aria-hidden="true" /> : <ArrowRightIcon />}
          </button>

          <p className="form-note">
            <ShieldIcon />
            <span>Every session uses gentle, non-directive language.</span>
          </p>
        </form>
      </main>

      <footer className="home-footer">
        <span />
        <p>Calm the mind. Personalize the emotion. Disappear.</p>
        <span />
      </footer>
    </div>
  );
}
