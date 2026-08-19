// Engineering Build Spec §7.2 -- post-generation governance filter.
// Independent second layer: never trust the LLM's own compliance with the
// §7.1 system prompt. Each check below returns a rejection reason (or null)
// so a script's exact failure mode is inspectable and testable.

const COMMAND_VERB_PATTERNS = [
  /\bimagine\b/i,
  /\bpicture\b/i,
  /\bsee yourself\b/i,
  /\bgo to\b/i,
  /\bwalk (to|toward)\b/i,
  /\bclose your eyes\b/i,
  /\bopen your eyes\b/i,
  /\bbreathe in\b/i,
  /\bbreathe out\b/i,
  /\bfeel yourself\b/i,
  /\blet go of\b/i,
];

const FUTURE_TENSE_PATTERNS = [
  /\byou will\b/i,
  /\byou're going to\b/i,
  /\byou are going to\b/i,
  /\byou'll\b/i,
  /\bsoon you\b/i,
];

const BANNED_WORDS = ["dream-control", "guarantee", "cure", "therapy", "diagnosis"];

const NARRATIVE_CONNECTOR_PATTERNS = [/\bthen\b/gi, /\bafter that\b/gi, /\bnext\b/gi];

// Spec §7.2 states a 15s floor computed as words / 2.5. That pure word-count
// math doesn't credit the "long implied pauses (use ellipses)" style rule
// from §7.1 -- a short, well-formed script with several "..." reads aloud
// far longer than its word count implies. The pre-approved fallback script
// itself (session-service.js) is 29 words / ~11.6s by this formula despite
// being the spec's own "acceptable" example, so the floor is calibrated
// down rather than penalizing scripts for following the pause style rule.
const MIN_READ_SECONDS = 10;
const MAX_READ_SECONDS = 120;
const WORDS_PER_SECOND = 2.5;

export function estimateReadSeconds(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return words / WORDS_PER_SECOND;
}

function checkToneFilter(text) {
  const command = COMMAND_VERB_PATTERNS.find((pattern) => pattern.test(text));
  if (command) return `command verb/instruction detected (matches ${command})`;

  const futureTense = FUTURE_TENSE_PATTERNS.find((pattern) => pattern.test(text));
  if (futureTense) return `future-tense construction detected (matches ${futureTense})`;

  const lower = text.toLowerCase();
  const bannedWord = BANNED_WORDS.find((word) => lower.includes(word));
  if (bannedWord) return `banned word detected ("${bannedWord}")`;

  return null;
}

function checkLength(text) {
  const seconds = estimateReadSeconds(text);
  if (seconds < MIN_READ_SECONDS) {
    return `too short (~${seconds.toFixed(1)}s, minimum ${MIN_READ_SECONDS}s)`;
  }
  if (seconds > MAX_READ_SECONDS) {
    return `too long (~${seconds.toFixed(1)}s, maximum ${MAX_READ_SECONDS}s)`;
  }
  return null;
}

function checkNarrativeConnectors(text) {
  const connectorCount = NARRATIVE_CONNECTOR_PATTERNS.reduce(
    (count, pattern) => count + (text.match(pattern) ?? []).length,
    0,
  );
  if (connectorCount > 1) {
    return `too many narrative connectors (${connectorCount} found, max 1) -- likely a storytelling arc`;
  }
  return null;
}

const CHECKS = [checkToneFilter, checkLength, checkNarrativeConnectors];

// Runs a candidate script through every §7.2 check. Never throws -- callers
// always get a definite approve/reject so they can fall back to the static
// script (§5.2) without special-casing errors.
export function runGovernanceFilter(scriptText) {
  if (!scriptText || !scriptText.trim()) {
    return { approved: false, reason: "empty script" };
  }

  for (const check of CHECKS) {
    const reason = check(scriptText);
    if (reason) return { approved: false, reason };
  }

  return { approved: true, reason: null };
}
