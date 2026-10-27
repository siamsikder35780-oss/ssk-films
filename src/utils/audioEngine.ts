/**
 * Web Audio API Cinema Sound Engine for SSK Film Creator
 * Provides synthesized real-time cinema ambient atmospheres and foley sound effects.
 */

class CinemaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private foleyGain: GainNode | null = null;
  private activeAmbientNodes: {
    sources: (AudioNode | number)[];
    stop: () => void;
  } | null = null;

  public isMuted: boolean = false;
  public masterVolume: number = 0.7;
  public ambientVolume: number = 0.5;
  public foleyVolume: number = 0.8;
  public currentAmbientPreset: string | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.foleyGain = this.ctx.createGain();
      this.foleyGain.gain.setValueAtTime(this.foleyVolume, this.ctx.currentTime);
      this.foleyGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public setAmbientVolume(val: number) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  public setFoleyVolume(val: number) {
    this.foleyVolume = Math.max(0, Math.min(1, val));
    if (this.foleyGain && this.ctx) {
      this.foleyGain.gain.setValueAtTime(this.foleyVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Foley: Clapperboard SNAP (authentic cinema slate)
  public playClapper() {
    this.initContext();
    if (!this.ctx || !this.foleyGain) return;

    const t = this.ctx.currentTime;

    // Wood snap: Noise burst + high resonant decay
    const bufferSize = this.ctx.sampleRate * 0.08;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    // Resonant wooden body "thwack"
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.06);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.8, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.foleyGain);

    osc.connect(oscGain);
    oscGain.connect(this.foleyGain);

    noise.start(t);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Foley: Cinematic Sub Bass Impact / Boom
  public playImpact() {
    this.initContext();
    if (!this.ctx || !this.foleyGain) return;

    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    // Slight punch noise at start
    const punchSize = this.ctx.sampleRate * 0.05;
    const punchBuf = this.ctx.createBuffer(1, punchSize, this.ctx.sampleRate);
    const punchData = punchBuf.getChannelData(0);
    for (let i = 0; i < punchSize; i++) {
      punchData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 500);
    }
    const punchSource = this.ctx.createBufferSource();
    punchSource.buffer = punchBuf;

    const punchGain = this.ctx.createGain();
    punchGain.gain.setValueAtTime(0.6, t);
    punchGain.gain.linearRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.foleyGain);

    punchSource.connect(punchGain);
    punchGain.connect(this.foleyGain);

    osc.start(t);
    osc.stop(t + 1.9);
    punchSource.start(t);
  }

  // Foley: Tension Riser
  public playRiser() {
    this.initContext();
    if (!this.ctx || !this.foleyGain) return;

    const t = this.ctx.currentTime;
    const dur = 2.5;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + dur);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(2800, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.exponentialRampToValueAtTime(0.7, t + dur - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.foleyGain);

    osc.start(t);
    osc.stop(t + dur);
  }

  // Foley: Suspense Heartbeat
  public playHeartbeat() {
    this.initContext();
    if (!this.ctx || !this.foleyGain) return;

    const t = this.ctx.currentTime;

    const playThump = (time: number, freq: number, vol: number) => {
      if (!this.ctx || !this.foleyGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(gain);
      gain.connect(this.foleyGain);

      osc.start(time);
      osc.stop(time + 0.2);
    };

    playThump(t, 85, 0.7);
    playThump(t + 0.22, 70, 0.5);
  }

  // Foley: Walkie-Talkie Radio Click
  public playRadioClick() {
    this.initContext();
    if (!this.ctx || !this.foleyGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.Q.setValueAtTime(4, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.foleyGain);

    noise.start(t);
  }

  // Ambient Soundscapes
  public startAmbient(preset: 'rain' | 'cyberpunk' | 'space' | 'noir_night' | 'projector') {
    this.stopAmbient();
    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    this.currentAmbientPreset = preset;

    if (preset === 'rain') {
      // Rain noise: continuous pink-ish filtered noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.05;
        b1 = 0.96300 * b1 + white * 0.08;
        b2 = 0.57000 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.2;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.6, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      whiteNoise.start();

      this.activeAmbientNodes = {
        sources: [whiteNoise],
        stop: () => {
          whiteNoise.stop();
          whiteNoise.disconnect();
        },
      };
    } else if (preset === 'cyberpunk') {
      // Cyberpunk: low 55Hz drone + high harmonic resonance + slow pulse
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, t);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.5, t); // slight detune

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, t);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc1.start();
      osc2.start();

      this.activeAmbientNodes = {
        sources: [osc1, osc2],
        stop: () => {
          osc1.stop();
          osc2.stop();
          osc1.disconnect();
          osc2.disconnect();
        },
      };
    } else if (preset === 'space') {
      // Space: ultra deep drone 42Hz + ethereal sine overtone
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(43.65, t); // F0

      const overtone = this.ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(130.81, t); // C3

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, t);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
      overtone.start();

      this.activeAmbientNodes = {
        sources: [osc, overtone],
        stop: () => {
          osc.stop();
          overtone.stop();
          osc.disconnect();
          overtone.disconnect();
        },
      };
    } else if (preset === 'projector') {
      // Vintage 35mm film projector whirr & click
      const bufferSize = this.ctx.sampleRate * 1;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.Q.setValueAtTime(2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      noise.start();

      this.activeAmbientNodes = {
        sources: [noise],
        stop: () => {
          noise.stop();
          noise.disconnect();
        },
      };
    } else {
      // noir_night: subtle night wind + distant tone
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(73.42, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);

      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();

      this.activeAmbientNodes = {
        sources: [osc],
        stop: () => {
          osc.stop();
          osc.disconnect();
        },
      };
    }
  }

  public stopAmbient() {
    if (this.activeAmbientNodes) {
      try {
        this.activeAmbientNodes.stop();
      } catch {
        // ignore already stopped
      }
      this.activeAmbientNodes = null;
    }
    this.currentAmbientPreset = null;
  }
}

export const cinemaAudio = new CinemaAudioEngine();
