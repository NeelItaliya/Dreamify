import { useState } from "react";
import IntentScreen from "./IntentScreen.jsx";
import SessionPlayerScreen from "./SessionPlayerScreen.jsx";
import SettingsScreen from "./SettingsScreen.jsx";
import { createProfile, generateScript } from "./session-service.js";
import { hasSeenDisclaimer, markDisclaimerSeen, loadSettings, saveSettings } from "./storage.js";

export default function App() {
  const [screen, setScreen] = useState("intent");
  const [showSettings, setShowSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(() => !hasSeenDisclaimer());
  const [settings, setSettings] = useState(() => loadSettings());
  const [session, setSession] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  function updateSettings(next) {
    setSettings(next);
    saveSettings(next);
  }

  async function beginSession(intentText, desiredTone) {
    setStarting(true);
    setError("");
    try {
      const profile = await createProfile({ intentText, desiredTone });
      const generated = await generateScript({ profileId: profile.id });
      setSession(generated);
      setScreen("session");
    } catch {
      setError("Could not start the session. Please try again.");
    } finally {
      setStarting(false);
    }
  }

  function endSession() {
    setSession(null);
    setScreen("intent");
  }

  return (
    <div className="app-shell">
      <div className="grain" />
      {showDisclaimer && (
        <div className="overlay">
          <div className="sheet">
            <p className="eyebrow">Before you begin</p>
            <h2>A relaxation tool</h2>
            <p>
              Dreamify is a relaxation and emotional-alignment tool. It does not diagnose, treat, or
              claim any medical or psychological benefit, and it does not promise or guarantee any
              specific dream outcome.
            </p>
            <button
              className="begin-btn"
              onClick={() => {
                markDisclaimerSeen();
                setShowDisclaimer(false);
              }}
            >
              I understand
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsScreen
          settings={settings}
          onChange={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {!showSettings && screen === "intent" && (
        <IntentScreen
          starting={starting}
          error={error}
          onBegin={beginSession}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {!showSettings && screen === "session" && (
        <SessionPlayerScreen session={session} settings={settings} onEnd={endSession} />
      )}
    </div>
  );
}
