/**
 * Web Audio Ambient Soundscape Generator
 * Offline-first, client-synthesized soothing ambient soundscapes.
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackType: string | null = null;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private isPlaying = false;
  private volume = 0.42;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getCurrentTrackType() {
    return this.currentTrackType;
  }

  public stop() {
    this.isPlaying = false;
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore cleanup error
      }
    }
    this.activeNodes = [];
  }

  public play(trackType: 'rain' | 'hearth' | 'meadow' | 'canopy' | 'waves') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.currentTrackType = trackType;
    this.isPlaying = true;

    if (trackType === 'rain') {
      this.createRainSound();
    } else if (trackType === 'hearth') {
      this.createHearthSound();
    } else if (trackType === 'meadow') {
      this.createMeadowSound();
    } else if (trackType === 'canopy') {
      this.createCanopySound();
    } else if (trackType === 'waves') {
      this.createWavesSound();
    }
  }

  private createNoiseBuffer(duration = 5): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise approximation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const pink = (lastOut + 0.02 * white) / 1.02;
      lastOut = pink;
      data[i] = pink * 3.5;
    }
    return buffer;
  }

  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(6);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter for gentle rain on soft surface
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.activeNodes.push(source, filter, highpass, gain);
  }

  private createHearthSound() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(4);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Low rumble of burning wood
    const lowFilter = this.ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    source.connect(lowFilter);
    lowFilter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    // Occasional crackles
    const crackleInterval = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying || !this.masterGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const crackleGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 + Math.random() * 800, this.ctx.currentTime);
        crackleGain.gain.setValueAtTime(0.08 * Math.random(), this.ctx.currentTime);
        crackleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(crackleGain);
        crackleGain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch {
        // ignore
      }
    }, 350);

    this.activeNodes.push(source, lowFilter, gain, {
      stop: () => clearInterval(crackleInterval),
    });
  }

  private createMeadowSound() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(5);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // LFO for breezy swelling
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeNodes.push(source, filter, lfo, lfoGain, gain);
  }

  private createCanopySound() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(5);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeNodes.push(source, filter, gain);
  }

  private createWavesSound() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(6);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

    // LFO wave swell (0.08 Hz = ~12s wave cycle)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    lfo.connect(waveGain.gain);
    lfo.start();

    source.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);
    source.start();

    this.activeNodes.push(source, filter, waveGain, lfo, lfoGain);
  }

  public playGentleBell() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [528, 1056, 1584]; // Harmonious 528Hz Solfeggio frequency
      const weights = [0.25, 0.08, 0.03];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        g.gain.setValueAtTime(weights[idx], now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(g);
        g.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.6);
      });
    } catch {
      // ignore
    }
  }
}

export const soundscape = new SoundscapeEngine();
