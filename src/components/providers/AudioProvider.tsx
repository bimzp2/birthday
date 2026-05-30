'use client';

import { createContext, useContext, useRef, useCallback, useState, useEffect, type ReactNode } from 'react';
import type { AudioState } from '@/types';

interface AudioContextType extends AudioState {
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  fadeVolume: (target: number, duration: number) => void;
  playClick: () => void;
  playHover: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  volume: 0.3,
  isMuted: true,
  togglePlay: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  fadeVolume: () => {},
  playClick: () => {},
  playHover: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

// "Happy Birthday" melody notes (MIDI note numbers, and duration in beats)
const MELODY = [
  { n: 60, d: 0.5 }, { n: 60, d: 0.5 }, { n: 62, d: 1 }, { n: 60, d: 1 }, { n: 65, d: 1 }, { n: 64, d: 2 },
  { n: 60, d: 0.5 }, { n: 60, d: 0.5 }, { n: 62, d: 1 }, { n: 60, d: 1 }, { n: 67, d: 1 }, { n: 65, d: 2 },
  { n: 60, d: 0.5 }, { n: 60, d: 0.5 }, { n: 72, d: 1 }, { n: 69, d: 1 }, { n: 65, d: 1 }, { n: 64, d: 1 }, { n: 62, d: 2 },
  { n: 70, d: 0.5 }, { n: 70, d: 0.5 }, { n: 69, d: 1 }, { n: 65, d: 1 }, { n: 67, d: 1 }, { n: 65, d: 3 }
];
const TEMPO = 75; // Slower, more emotional

export function AudioProvider({ children }: { children: ReactNode }) {
  // Volume extremely low for background ambience
  const [state, setState] = useState<AudioState>({ isPlaying: false, volume: 0.15, isMuted: false });
  const audioCtx = useRef<window.AudioContext | null>(null);
  const mainGain = useRef<GainNode | null>(null);
  const nextNoteTime = useRef(0);
  const currentNote = useRef(0);
  const timerID = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  const initAudio = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      mainGain.current = audioCtx.current.createGain();
      mainGain.current.connect(audioCtx.current.destination);
      mainGain.current.gain.value = state.volume;
    }
  }, [state.volume]);

  // Violin/Cello-like soft string synth
  const playNote = (midi: number, time: number, duration: number) => {
    const ctx = audioCtx.current!;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    
    // Sawtooth with lowpass filter creates a warm string-like tone
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, time + duration);
    
    // Soft attack, sustained, soft release
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(0.2, time + Math.min(0.8, duration * 0.5)); // Slow attack
    env.gain.setValueAtTime(0.2, time + duration - 0.5); // Sustain
    env.gain.linearRampToValueAtTime(0.001, time + duration + 1.5); // Slow release
    
    // Chorus effect (second slightly detuned oscillator)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.detune.value = 8;
    osc2.connect(filter);
    
    osc.connect(filter);
    filter.connect(env);
    env.connect(mainGain.current!);
    
    osc.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq, time);
    
    // Slight vibrato
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 4.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * 0.015;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(osc2.frequency);
    
    osc.start(time);
    osc2.start(time);
    lfo.start(time);
    
    osc.stop(time + duration + 2);
    osc2.stop(time + duration + 2);
    lfo.stop(time + duration + 2);
  };

  const scheduleNotes = useCallback(() => {
    const ctx = audioCtx.current!;
    while (nextNoteTime.current < ctx.currentTime + 0.1) {
      const note = MELODY[currentNote.current];
      // Convert beats to seconds
      const secondsPerBeat = 60.0 / TEMPO;
      
      playNote(note.n, nextNoteTime.current, note.d * secondsPerBeat);
      
      nextNoteTime.current += note.d * secondsPerBeat;
      currentNote.current++;
      if (currentNote.current >= MELODY.length) {
        currentNote.current = 0;
        // Pause for 4 beats between loops
        nextNoteTime.current += 4 * secondsPerBeat;
      }
    }
    timerID.current = requestAnimationFrame(scheduleNotes);
  }, []);

  const togglePlay = useCallback(() => {
    initAudio();
    const ctx = audioCtx.current!;
    if (ctx.state === 'suspended') ctx.resume();

    if (isPlayingRef.current) {
      if (timerID.current) cancelAnimationFrame(timerID.current);
      isPlayingRef.current = false;
      setState(s => ({ ...s, isPlaying: false }));
    } else {
      nextNoteTime.current = ctx.currentTime + 0.1;
      currentNote.current = 0;
      isPlayingRef.current = true;
      scheduleNotes();
      setState(s => ({ ...s, isPlaying: true, isMuted: false }));
    }
  }, [initAudio, scheduleNotes]);

  const setVolume = useCallback((v: number) => {
    if (mainGain.current) mainGain.current.gain.value = v;
    setState(s => ({ ...s, volume: v }));
  }, []);

  const toggleMute = useCallback(() => {
    if (mainGain.current) {
      const target = state.isMuted ? state.volume : 0;
      mainGain.current.gain.setTargetAtTime(target, audioCtx.current!.currentTime, 0.1);
      setState(s => ({ ...s, isMuted: !s.isMuted }));
    }
  }, [state]);

  const fadeVolume = useCallback((target: number, duration: number) => {
    if (mainGain.current) {
      mainGain.current.gain.linearRampToValueAtTime(target, audioCtx.current!.currentTime + duration / 1000);
      setState(s => ({ ...s, volume: target }));
    }
  }, []);

  // SFX
  const playHover = useCallback(() => {
    if (!audioCtx.current || state.isMuted || !state.isPlaying) return;
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(mainGain.current!);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [state]);

  const playClick = useCallback(() => {
    if (!audioCtx.current || state.isMuted || !state.isPlaying) return;
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(mainGain.current!);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [state]);

  return (
    <AudioContext value={{ ...state, togglePlay, setVolume, toggleMute, fadeVolume, playClick, playHover }}>
      {children}
    </AudioContext>
  );
}
