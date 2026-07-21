// Mock implementation of the Engineering Build Spec §5 API contract.
// No network calls yet -- everything below resolves locally so the UI and
// audio engine can be built against the real request/response shapes now.
// Swapping this file's internals for real `fetch` calls to the eventual
// AWS API Gateway / Lambda endpoints should not require touching callers.

const FALLBACK_SCRIPT =
  "There is a quiet warmth... somewhere close, somewhere familiar. " +
  "A soft sound, like distant water. Nothing to hold onto. Nothing to find. " +
  "Just this... a gentle stillness settling in.";

const sessions = new Map();

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function estimateReadSeconds(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(15, Math.min(120, Math.round(words / 2.5)));
}

export async function createProfile({ intentText, desiredTone, userId = null }) {
  await delay(200);
  return {
    id: crypto.randomUUID(),
    intent_text: intentText,
    desired_tone: desiredTone,
    user_id: userId,
    created_at: new Date().toISOString(),
  };
}

export async function generateScript({ profileId }) {
  await delay(600);

  // No LLM/governance filter wired up yet -- always serve the pre-approved
  // fallback script, exactly as the spec requires on a rejection (§5.2):
  // the session must never fail silently or show an error screen.
  const scriptText = FALLBACK_SCRIPT;
  const session = {
    session_id: crypto.randomUUID(),
    profile_id: profileId,
    script_text: scriptText,
    script_seconds: estimateReadSeconds(scriptText),
    audio_url: null,
    voice_id: "en-IN-Neural2-A",
    status: "generated",
  };
  sessions.set(session.session_id, session);
  return session;
}

export async function getSession(sessionId) {
  await delay(100);
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");
  return session;
}

export async function cacheSession(sessionId, audioCacheUrl) {
  await delay(100);
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");
  session.audio_cache_url = audioCacheUrl;
  session.status = "cached";
  return session;
}

export async function deleteUser(userId) {
  await delay(150);
  for (const [id, session] of sessions) {
    if (session.user_id === userId) sessions.delete(id);
  }
  return { deleted: true };
}
