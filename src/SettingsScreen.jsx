import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  BrandMark,
  ClockIcon,
  ShieldIcon,
  TrashIcon,
  VolumeOffIcon,
} from "./icons.jsx";
import { clearLocalData } from "./storage.js";

const LENGTHS = [
  { value: "short", label: "Short", detail: "A lighter reset" },
  { value: "standard", label: "Standard", detail: "A balanced ritual" },
  { value: "long", label: "Long", detail: "More time to settle" },
];

export default function SettingsScreen({ settings, onChange, onClose }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const cancelDeleteRef = useRef(null);
  const deleteButtonRef = useRef(null);

  useEffect(() => {
    if (confirmingDelete) cancelDeleteRef.current?.focus();
  }, [confirmingDelete]);

  function handleDelete() {
    // Backend not wired up yet: this clears local preferences only. Once the
    // real API exists, this should also call DELETE /api/user/:id (spec §5.1)
    // to cascade-delete the profile/session rows.
    clearLocalData();
    setConfirmingDelete(false);
    window.location.reload();
  }

  function cancelDelete() {
    setConfirmingDelete(false);
    window.requestAnimationFrame(() => deleteButtonRef.current?.focus());
  }

  return (
    <div className="screen settings">
      <header className="site-header">
        <div className="brand-lockup" aria-label="Dreamify settings">
          <BrandMark className="brand-mark" />
          <span className="brand-copy">
            <strong>Dreamify</strong>
            <small>Pre-sleep rituals</small>
          </span>
        </div>

        <button className="settings-button back-button" type="button" onClick={onClose}>
          <ArrowLeftIcon />
          <span>Back home</span>
        </button>
      </header>

      <main className="settings-main">
        <section className="settings-intro" aria-labelledby="settings-title">
          <p className="eyebrow">Settings</p>
          <h1 id="settings-title" tabIndex="-1">
            Your session, at your pace.
          </h1>
          <p>
            Keep the experience as quiet and spacious as you need. Changes save automatically on
            this device.
          </p>

          <div className="local-note">
            <ShieldIcon />
            <span>
              <strong>Private by default</strong>
              Your preferences stay in this browser.
            </span>
          </div>
        </section>

        <section className="preferences-card" aria-label="Session preferences">
          <div className="preference-heading">
            <p className="eyebrow">Playback</p>
            <h2>Session preferences</h2>
          </div>

          <div className="preference-row">
            <span className="preference-icon preference-icon-blue">
              <VolumeOffIcon />
            </span>
            <div className="preference-copy">
              <strong id="silence-mode-label">Silence-only mode</strong>
              <p id="silence-mode-description">
                Skip the personalized voice and keep only the soft ambient bed.
              </p>
            </div>
            <button
              type="button"
              className={`toggle ${settings.silenceOnly ? "on" : ""}`}
              onClick={() => onChange({ ...settings, silenceOnly: !settings.silenceOnly })}
              role="switch"
              aria-checked={settings.silenceOnly}
              aria-labelledby="silence-mode-label"
              aria-describedby="silence-mode-description"
            >
              <i />
            </button>
          </div>

          <div className="preference-block">
            <div className="preference-block-title">
              <span className="preference-icon preference-icon-sage">
                <ClockIcon />
              </span>
              <div className="preference-copy">
                <strong>Session length</strong>
                <p>Choose how much time the ambient stages have to unfold.</p>
              </div>
            </div>

            <div className="length-tabs" role="group" aria-label="Session length">
              {LENGTHS.map((length) => (
                <button
                  type="button"
                  key={length.value}
                  className={length.value === settings.length ? "active" : ""}
                  onClick={() => onChange({ ...settings, length: length.value })}
                  aria-pressed={length.value === settings.length}
                >
                  <span>{length.label}</span>
                  <small>{length.detail}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="privacy-panel">
            <span className="preference-icon preference-icon-rose">
              <TrashIcon />
            </span>
            <div className="preference-copy">
              <strong>Delete my data</strong>
              <p>Remove saved preferences and first-use consent from this device.</p>
            </div>

            {confirmingDelete ? (
              <div className="delete-confirmation" role="group" aria-label="Confirm data deletion">
                <p>Are you sure? This cannot be undone.</p>
                <div>
                  <button
                    ref={cancelDeleteRef}
                    type="button"
                    className="text-button"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button type="button" className="danger-button" onClick={handleDelete}>
                    Delete now
                  </button>
                </div>
              </div>
            ) : (
              <button
                ref={deleteButtonRef}
                type="button"
                className="danger-button"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete data
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="settings-footer">Calm, considered, and always in your control.</footer>
    </div>
  );
}
