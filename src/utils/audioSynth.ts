// Web Audio API procedural synthesizer for playing generated AI songs
// Generates chords, bass, melody, and rhythm based on the selected scale and tempo.

import { GeneratedSong } from '../types';

let audioCtx: AudioContext | null = null;
let isSynthPlaying = false;
let currentTimer: number | null = null;
let step = 0;
let currentBpm = 110;
let analyserNode: AnalyserNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAnalyser(): AnalyserNode | null {
  return analyserNode;
}

// Frequencies for Arabic and Western musical scales (in Hz)
const SCALES: Record<string, number[]> = {
  // Hijaz (Maqam Hijaz on D): D3, Eb3, F#3, G3, A3, Bb3, C4, D4
  Hijaz: [146.83, 155.56, 185.00, 196.00, 220.00, 233.08, 261.63, 293.66],
  // Nahawand (C minor-ish): C3, D3, Eb3, F3, G3, Ab3, Bb3, C4
  Nahawand: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63],
  // Bayati on D: D3, E(half-flat ~158), F3, G3, A3, Bb3, C4, D4
  Bayati: [146.83, 160.00, 174.61, 196.00, 220.00, 233.08, 261.63, 293.66],
  // Major
  Major: [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63],
  // Minor
  Minor: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63],
};

function playKick(ctx: AudioContext, time: number, dest: AudioNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);
  gain.gain.setValueAtTime(0.7, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.35);
}

function playSnare(ctx: AudioContext, time: number, dest: AudioNode) {
  // Noise buffer for snare snap
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  noise.start(time);
  noise.stop(time + 0.15);
}

function playHiHat(ctx: AudioContext, time: number, dest: AudioNode) {
  const bufferSize = ctx.sampleRate * 0.04;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 6000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  noise.start(time);
  noise.stop(time + 0.04);
}

function playTone(
  ctx: AudioContext,
  freq: number,
  time: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  dest: AudioNode
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + duration);
}

export function startMusicPlayback(
  song: GeneratedSong,
  onStepUpdate?: (stepIndex: number, lineIndex: number) => void
) {
  stopMusicPlayback();
  const ctx = getAudioContext();

  if (!analyserNode) {
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 64;
  }
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.6;
  masterGain.connect(analyserNode);
  analyserNode.connect(ctx.destination);

  isSynthPlaying = true;
  currentBpm = song.tempo || 110;
  step = 0;

  const scaleName = song.scale && SCALES[song.scale] ? song.scale : 'Hijaz';
  const scale = SCALES[scaleName];

  // Flatten all lyrics lines for karaoke tracker
  const allLines: string[] = [];
  song.lyrics.forEach((sec) => {
    sec.lines.forEach((line) => allLines.push(line));
  });

  const stepDuration = 60 / currentBpm / 4; // 16th note step in seconds

  function scheduleLoop() {
    if (!isSynthPlaying) return;
    const now = ctx.currentTime;

    // 16 steps per bar
    const barStep = step % 16;
    const currentLineIdx = Math.floor((step / 16) % (allLines.length || 1));

    if (onStepUpdate) {
      onStepUpdate(step, currentLineIdx);
    }

    // Drums
    if (barStep === 0 || barStep === 8 || barStep === 10) {
      playKick(ctx, now, masterGain);
    }
    if (barStep === 4 || barStep === 12) {
      playSnare(ctx, now, masterGain);
    }
    if (barStep % 2 === 0) {
      playHiHat(ctx, now, masterGain);
    }

    // Bassline (low octaves)
    if (barStep === 0 || barStep === 6 || barStep === 8 || barStep === 14) {
      const rootNote = scale[0] / 2; // octave down
      playTone(ctx, rootNote, now, stepDuration * 3, 'triangle', 0.45, masterGain);
    }

    // Melodic Lead Motif (Eastern ornament / Arabian vibrato feel)
    const melodySteps = [0, 2, 3, 5, 7, 8, 11, 13];
    if (melodySteps.includes(barStep)) {
      const noteIndex = (barStep + Math.floor(step / 16)) % scale.length;
      const freq = scale[noteIndex] * 2; // lead octave
      playTone(ctx, freq, now, stepDuration * 2.2, 'sawtooth', 0.25, masterGain);
    }

    // Ambient Pad / Harmony Chord on first beat of every 8 steps
    if (barStep === 0) {
      const chordRoot = scale[step % 3];
      const chordFifth = scale[(step % 3) + 4] || scale[scale.length - 1];
      playTone(ctx, chordRoot, now, stepDuration * 12, 'sine', 0.18, masterGain);
      playTone(ctx, chordFifth, now, stepDuration * 12, 'sine', 0.15, masterGain);
    }

    step++;
    currentTimer = window.setTimeout(scheduleLoop, stepDuration * 1000);
  }

  scheduleLoop();
}

export function stopMusicPlayback() {
  isSynthPlaying = false;
  if (currentTimer !== null) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }
}

export function isAudioPlaying(): boolean {
  return isSynthPlaying;
}
