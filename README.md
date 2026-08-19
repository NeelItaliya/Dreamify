# Dreamify

A three-stage pre-sleep dream-priming experience, built to `Dreamify_Engineering_Build_Spec.docx`. This is a clean rebuild of the concept: Dreamable (sibling project) drifted into a bedtime-story app; Dreamify's scope is intentionally the original three screens and three-stage session only.

> "Calm the mind. Personalize the emotion. Disappear."

## Status

**Frontend only, mocked backend.** There is no live LLM, TTS, database, or auth wired up yet — `src/session-service.js` implements the spec's §5 API contract (`createProfile`, `generateScript`, `cacheSession`, `deleteUser`) locally with simulated latency and the pre-approved fallback script, so the UI and audio engine are built against the real request/response shapes and can be pointed at a real backend later with no component changes.

Stage 1/3 ambient audio and the Stage 2 "voice" are both placeholder oscillator tones (`src/audio-engine.js`), the same technique Dreamable used before its own real audio pass. Swapping in licensed CC0 ambient files and a real TTS audio URL is a small change to `audio-engine.js`/`session-service.js`, not a rewrite.

## Run locally

```bash
npm install
npm run dev
```

## What is implemented

- First-use disclaimer overlay (relaxation tool, no medical/psychological claims, no guaranteed outcome).
- Intent Input screen: free-text intent + 6 tone presets (calm, nostalgic, warm, release, ocean, quiet).
- Session Player screen: full-screen, light, and deliberately low-stimulation, with no progress bar/timer/branding and only a small dismiss icon; drives a 3-stage `DreamAudioEngine` (stabilize → prime → release) with `GainNode` cross-fades, never a hard stop.
- Settings screen: silence-only mode toggle, session-length preference (short/standard/long), local "delete my data" action.

## What is not implemented yet

- Real Gemini script generation and governance filter (spec §7).
- Real AI voice generation (Indian-accented TTS) and Stage 1/3 licensed audio assets.
- Auth, database (users/emotional_profiles/sessions), and storage.
- AWS deployment.

## Planned deployment: AWS only

Per project decision, hosting targets AWS exclusively (no Vercel/Netlify):

- S3 + CloudFront (or Amplify Hosting) for the frontend.
- API Gateway + Lambda for the script-generation/session endpoints.
- Cognito for auth.
- DynamoDB for session/profile metadata, private S3 for cached audio.
- Amazon Bedrock (Nova Lite) for script generation, Amazon Polly for narration where supported.
- CloudWatch, Secrets Manager, and AWS Budgets for production operations.

None of the above is provisioned yet; this pass is frontend scaffolding only.
