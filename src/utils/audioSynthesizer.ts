/**
 * Web Audio API Ambient Dream Synthesizer
 * 
 * Provides a soothing, gentle melodic chord progression as an immediate,
 * fully-interactive fallback when mp3 media files have not yet been placed
 * in /public/media/.
 */

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private activeGainNodes: GainNode[] = [];

  private chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [196.00, 246.94, 293.66, 392.00], // G6 (G3, B3, D4, G4)
  ];
  private chordIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.chordIndex = 0;

    // Trigger first chord immediately
    this.playChord(this.chords[this.chordIndex]);

    // Loop through gentle slow ambient chords every 4.5 seconds
    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
      this.playChord(this.chords[this.chordIndex]);
    }, 4500);
  }

  private playChord(freqs: number[]) {
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const duration = 5.0; // gentle overlapping decay

    // Master filter to make it soft, warm and dreamy (no harsh digital buzz)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.ctx.destination);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with soft shimmer
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Add gentle detune for warmth
      osc.detune.setValueAtTime((idx - 1.5) * 4, now);

      // Smooth attack & long release
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(now);
      osc.stop(now + duration + 0.1);

      this.activeGainNodes.push(gain);
    });
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.activeGainNodes.forEach((g) => {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.linearRampToValueAtTime(0.0001, now + 0.5);
        } catch {
          // ignore
        }
      });
      this.activeGainNodes = [];
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const ambientSynthesizer = new AmbientSynthesizer();
