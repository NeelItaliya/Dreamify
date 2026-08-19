// Three-stage session engine per Engineering Build Spec §6:
//   1. stabilize -- neutral ambient bed, 2-4 min
//   2. prime     -- the approved script's audio plays softly over the bed
//   3. release   -- voice dissolves, bed cross-fades to silence (never a hard stop)
//
// No real Stage-1/3 audio files and no real Stage-2 TTS audio exist yet.
// Both are stood in for by the same oscillator-drone technique (proven in
// Dreamable's audio-engine.js): a GainNode-mixed ambient bed that shifts
// gain to mark the "prime" stage. Swapping in real CC0 files and a real
// TTS audio URL later only touches buildAmbient()/playVoicePlaceholder().

const DURATIONS = {
  short: { stabilize: 120, release: 60 },
  standard: { stabilize: 180, release: 90 },
  long: { stabilize: 240, release: 120 },
};

const DEFAULT_PRIME_SECONDS = 45;
const QUICK_RELEASE_SECONDS = 1.5;

export class DreamAudioEngine {
  constructor({ onStage, onEnd, onError }) {
    this.onStage = onStage || (() => {});
    this.onEnd = onEnd || (() => {});
    this.onError = onError || (() => {});
    this.timers = [];
    this.stopped = false;
  }

  async start(session, settings) {
    this.stopped = false;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      await this.context.resume();
      if (this.stopped) return;
      this.master = this.context.createGain();
      this.master.gain.value = 0.0001;
      this.master.connect(this.context.destination);
      this.master.gain.exponentialRampToValueAtTime(0.05, this.context.currentTime + 3);
      this.buildAmbient();

      const duration = DURATIONS[settings.length] || DURATIONS.standard;

      this.onStage("stabilize");
      await this.wait(duration.stabilize * 1000);
      if (this.stopped) return;

      if (!settings.silenceOnly) {
        this.onStage("prime");
        await this.playVoicePlaceholder(session);
        if (this.stopped) return;
      }

      this.release(duration.release);
    } catch (error) {
      if (this.stopped) return;
      this.onError(error instanceof Error ? error : new Error("Session playback failed"));
    }
  }

  buildAmbient() {
    const low = this.context.createOscillator();
    const high = this.context.createOscillator();
    const air = this.context.createOscillator();
    const lowGain = this.context.createGain();
    const highGain = this.context.createGain();
    const airGain = this.context.createGain();
    low.type = "sine";
    high.type = "sine";
    air.type = "sine";
    low.frequency.value = 73.42;
    high.frequency.value = 110;
    air.frequency.value = 196;
    lowGain.gain.value = 0.55;
    highGain.gain.value = 0.16;
    airGain.gain.value = 0.045;
    low.connect(lowGain).connect(this.master);
    high.connect(highGain).connect(this.master);
    air.connect(airGain).connect(this.master);
    low.start();
    high.start();
    air.start();
    this.nodes = [low, high, air];
    this.gains = { lowGain, highGain, airGain };
  }

  async playVoicePlaceholder(session) {
    // Stands in for the real Stage-2 TTS clip: nudges the bed forward so the
    // stage is audibly distinct, held for the (mock) script's read time.
    const now = this.context.currentTime;
    this.gains?.highGain.gain.linearRampToValueAtTime(0.26, now + 2);
    const seconds = session?.script_seconds || DEFAULT_PRIME_SECONDS;
    await this.wait(seconds * 1000);
  }

  wait(ms) {
    return new Promise((resolve) => {
      this.timers.push(window.setTimeout(resolve, ms));
    });
  }

  release(seconds) {
    if (this.stopped) return;
    this.onStage("release");
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    this.timers.push(
      window.setTimeout(() => {
        this.stop();
      }, seconds * 1000),
    );
  }

  // Dismiss/stop icon: still cross-fades (never a hard stop), just quickly.
  dismiss() {
    if (this.stopped || !this.context || !this.master) {
      this.stop();
      return;
    }
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.onStage("release");
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + QUICK_RELEASE_SECONDS);
    this.timers.push(window.setTimeout(() => this.stop(), QUICK_RELEASE_SECONDS * 1000));
  }

  stop() {
    if (this.stopped) return;
    this.teardown();
    this.onEnd();
  }

  // Releases audio resources without notifying the caller. Used for effect
  // cleanup on unmount, where the caller (if still mounted) already knows --
  // or, in React StrictMode's dev-only double-invoke, where a phantom
  // teardown must not be mistaken for the real session ending.
  dispose() {
    this.teardown();
  }

  teardown() {
    if (this.stopped) return;
    this.stopped = true;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.nodes?.forEach((node) => {
      try {
        node.stop();
      } catch {
        // already stopped
      }
    });
    this.context?.close();
  }
}
