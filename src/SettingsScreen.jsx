import { useState } from "react";
import { clearLocalData } from "./storage.js";

const LENGTHS = ["short", "standard", "long"];

export default function SettingsScreen({ settings, onChange, onClose }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDelete() {
    // Backend not wired up yet: this clears local preferences only. Once the
    // real API exists, this should also call DELETE /api/user/:id (spec §5.1)
    // to cascade-delete the profile/session rows.
    clearLocalData();
    setConfirmingDelete(false);
    window.location.reload();
  }

  return (
    <div className="screen settings">
      <header>
        <button className="back" onClick={onClose}>
          ← <span>Back</span>
        </button>
        <i />
      </header>

      <section>
        <h1>Settings</h1>

        <div className="setting-row">
          <div>
            <strong>Silence-only mode</strong>
            <p>Skip the personalized voice and keep only the ambient bed.</p>
          </div>
          <button
            className={`toggle ${settings.silenceOnly ? "on" : ""}`}
            onClick={() => onChange({ ...settings, silenceOnly: !settings.silenceOnly })}
            aria-pressed={settings.silenceOnly}
            aria-label="Toggle silence-only mode"
          >
            <i />
          </button>
        </div>

        <div className="setting-block">
          <strong>Session length</strong>
          <p>How long the ambient stages run.</p>
          <div className="length-tabs">
            {LENGTHS.map((length) => (
              <button
                key={length}
                className={length === settings.length ? "active" : ""}
                onClick={() => onChange({ ...settings, length })}
              >
                {length}
              </button>
            ))}
          </div>
        </div>

        <div className="danger-zone">
          <strong>Delete my data</strong>
          <p>Removes locally stored preferences from this device.</p>
          {confirmingDelete ? (
            <button onClick={handleDelete}>Confirm delete</button>
          ) : (
            <button onClick={() => setConfirmingDelete(true)}>Delete my data</button>
          )}
        </div>
      </section>
    </div>
  );
}
