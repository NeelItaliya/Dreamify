import { describe, expect, test } from "vitest";
import { runGovernanceFilter } from "./governance-filter.js";

// Engineering Build Spec §12.1 Definition of Done requires a test suite of
// at least 20 known-bad prompts, all of which must be rejected by the filter.
const KNOWN_BAD_PROMPTS = [
  // Spec §7.3 "Not acceptable" example -- command + future tense.
  "Picture yourself walking down to the beach. Feel the sand beneath your feet as you walk toward the water, and soon you will feel completely at peace.",

  // Command verbs / instructions.
  "Imagine a quiet field stretching into the distance, calm and still.",
  "Go to the place where the light feels warm and soft tonight.",
  "See yourself standing at the edge of something familiar and gentle.",
  "Close your eyes and notice the quiet settling slowly around you.",
  "Open your eyes to the warmth that was always quietly there.",
  "Breathe in the stillness that gathers softly in this quiet room.",
  "Breathe out everything that no longer needs to be carried tonight.",
  "Feel yourself sinking gently into something warm and familiar.",
  "Let go of the noise and settle into this soft, quiet warmth.",
  "Walk toward the light drifting quietly at the edge of the room.",

  // Future-tense constructions.
  "You will feel a deep sense of peace washing over you tonight.",
  "You're going to notice a warmth spreading slowly through the room.",
  "You are going to drift into something soft and familiar soon.",
  "You'll settle into something quiet and familiar before long.",
  "There is a quiet hush gathering close, and soon you feel it too.",

  // Banned words.
  "This gentle session offers a guarantee of restful, dreamless comfort.",
  "This quiet moment works like a cure for the noise of the day.",
  "Consider this a form of therapy for the mind before sleep settles in.",
  "There is no diagnosis needed here, only quiet stillness settling in.",
  "This is dream-control, shaped quietly to guide exactly what comes next.",

  // Length control -- under 15s of estimated read time (~37 words).
  "Warm.",
  "Quiet.",
  "A soft stillness, close and familiar.",

  // Language constraint -- more than one narrative connector (storytelling arc).
  "There is a quiet warmth, then a soft sound drifts closer, then a gentle stillness begins to settle, next a distant hush takes over completely.",
  "First there is warmth, after that a soft hush, and then everything fades into stillness together.",

  // Empty / whitespace-only script.
  "",
  "   ",
];

describe("runGovernanceFilter -- known-bad prompts", () => {
  test(`rejects all ${KNOWN_BAD_PROMPTS.length} known-bad prompts (spec requires >= 20)`, () => {
    expect(KNOWN_BAD_PROMPTS.length).toBeGreaterThanOrEqual(20);
  });

  test.each(KNOWN_BAD_PROMPTS.map((text, index) => [index, text]))(
    "rejects known-bad prompt #%i",
    (_index, text) => {
      const result = runGovernanceFilter(text);
      expect(result.approved).toBe(false);
      expect(result.reason).toBeTruthy();
    },
  );
});

describe("runGovernanceFilter -- known-good prompts", () => {
  const KNOWN_GOOD_PROMPTS = [
    // Spec §7.3 "Acceptable" example.
    "There is a quiet warmth... somewhere close, somewhere familiar. A soft sound, like distant water. Nothing to hold onto. Nothing to find. Just this... a gentle stillness settling in.",

    // The hardcoded fallback script (session-service.js) must itself pass --
    // it is served whenever the filter rejects an LLM output, so if it
    // failed its own checks every session would silently loop on nothing.
    "There is a quiet warmth... somewhere close, somewhere familiar. " +
      "A soft sound, like distant water. Nothing to hold onto. Nothing to find. " +
      "Just this... a gentle stillness settling in.",

    "A soft hush settles over the room... something familiar, something still. There is warmth here, quiet and unhurried, like a memory with no edges, no beginning, only this... a gentle ease, staying close.",
  ];

  test.each(KNOWN_GOOD_PROMPTS.map((text, index) => [index, text]))(
    "approves known-good prompt #%i",
    (_index, text) => {
      const result = runGovernanceFilter(text);
      expect(result.approved).toBe(true);
      expect(result.reason).toBeNull();
    },
  );
});

test("rejects scripts over 120s of estimated read time", () => {
  const longScript = Array(80).fill("There is a quiet warmth, soft and still.").join(" ");
  const result = runGovernanceFilter(longScript);
  expect(result.approved).toBe(false);
  expect(result.reason).toMatch(/too long/);
});
