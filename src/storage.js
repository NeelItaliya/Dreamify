const DISCLAIMER_KEY = "dreamify.disclaimer-seen";
const SETTINGS_KEY = "dreamify.settings";

const DEFAULT_SETTINGS = {
  silenceOnly: false,
  length: "standard",
};

export function hasSeenDisclaimer() {
  return window.localStorage.getItem(DISCLAIMER_KEY) === "true";
}

export function markDisclaimerSeen() {
  window.localStorage.setItem(DISCLAIMER_KEY, "true");
}

export function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearLocalData() {
  window.localStorage.removeItem(DISCLAIMER_KEY);
  window.localStorage.removeItem(SETTINGS_KEY);
}
