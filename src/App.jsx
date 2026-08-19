import { useEffect, useRef, useState } from "react";
import IntentScreen from "./IntentScreen.jsx";
import SessionPlayerScreen from "./SessionPlayerScreen.jsx";
import SettingsScreen from "./SettingsScreen.jsx";
import { ArrowRightIcon, InfoIcon } from "./icons.jsx";
import { createProfile, generateScript } from "./session-service.js";
import { hasSeenDisclaimer, markDisclaimerSeen, loadSettings, saveSettings } from "./storage.js";

export default function App() {
  const [screen, setScreen] = useState("intent");
  const [showSettings, setShowSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(() => !hasSeenDisclaimer());
  const [settings, setSettings] = useState(() => loadSettings());
  const [intentDraft, setIntentDraft] = useState("");
  const [toneDraft, setToneDraft] = useState("calm");
  const [session, setSession] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const disclaimerButtonRef = useRef(null);

  useEffect(() => {
    if (showDisclaimer) disclaimerButtonRef.current?.focus();
  }, [showDisclaimer]);

  function updateSettings(next) {
    setSettings(next);
    saveSettings(next);
  }

  function focusAfterRender(selector) {
    window.requestAnimationFrame(() => document.querySelector(selector)?.focus());
  }

  async function beginSession(intentText, desiredTone) {
    setStarting(true);
    setError("");
    try {
      const profile = await createProfile({ intentText, desiredTone });
      const generated = await generateScript({ profileId: profile.id });
      setSession(generated);
      setIntentDraft("");
      setToneDraft("calm");
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
    focusAfterRender("#intent-text");
  }

  function openSettings() {
    setShowSettings(true);
    focusAfterRender("#settings-title");
  }

  function closeSettings() {
    setShowSettings(false);
    focusAfterRender(".settings-button");
  }

  function acceptDisclaimer() {
    markDisclaimerSeen();
    setShowDisclaimer(false);
    focusAfterRender("#intent-text");
  }

  return (
    <div className="app-shell" data-screen={showSettings ? "settings" : screen}>
      {screen !== "session" && (
        <div className="ambient-backdrop" aria-hidden="true">
          <span className="ambient-orb ambient-orb-sage" />
          <span className="ambient-orb ambient-orb-blue" />
          <span className="ambient-orb ambient-orb-lilac" />
        </div>
      )}

      {showDisclaimer && (
        <div className="overlay">
          <section
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
            aria-describedby="disclaimer-copy"
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.preventDefault();
                disclaimerButtonRef.current?.focus();
              }
            }}
          >
            <div className="notice-icon" aria-hidden="true">
              <InfoIcon />
            </div>
            <p className="eyebrow">A gentle note</p>
            <h2 id="disclaimer-title">Made for relaxation, not treatment.</h2>
            <p id="disclaimer-copy" className="sheet-copy">
              Dreamify offers a calming, personalized audio ritual. It does not diagnose or treat
              medical or psychological conditions, and it never promises a particular dream or
              outcome.
            </p>
            <div className="notice-detail">
              <span aria-hidden="true" />
              <p>Your intention is used only to prepare your session. Preferences stay on this device.</p>
            </div>
            <button
              ref={disclaimerButtonRef}
              className="primary-button notice-action"
              onClick={acceptDisclaimer}
            >
              <span>I understand, continue</span>
              <ArrowRightIcon />
            </button>
          </section>
        </div>
      )}

      <div
        className="app-view"
        aria-hidden={showDisclaimer ? "true" : undefined}
        inert={showDisclaimer ? "" : undefined}
      >
        {showSettings && (
          <SettingsScreen settings={settings} onChange={updateSettings} onClose={closeSettings} />
        )}

        {!showSettings && screen === "intent" && (
          <IntentScreen
            intentText={intentDraft}
            onIntentTextChange={setIntentDraft}
            tone={toneDraft}
            onToneChange={setToneDraft}
            starting={starting}
            error={error}
            onBegin={beginSession}
            onOpenSettings={openSettings}
          />
        )}

        {!showSettings && screen === "session" && (
          <SessionPlayerScreen session={session} settings={settings} onEnd={endSession} />
        )}
      </div>
    </div>
  );
}
