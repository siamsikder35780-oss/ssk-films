import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Sliders,
  Music,
  Radio,
  CloudRain,
  Compass,
  Film,
  Zap,
} from 'lucide-react';
import { cinemaAudio } from '../utils/audioEngine';

export const SoundLab: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string | null>(cinemaAudio.currentAmbientPreset);
  const [ambientVolume, setAmbientVolume] = useState<number>(cinemaAudio.ambientVolume);
  const [foleyVolume, setFoleyVolume] = useState<number>(cinemaAudio.foleyVolume);
  const [masterVolume, setMasterVolume] = useState<number>(cinemaAudio.masterVolume);
  const [isMuted, setIsMuted] = useState<boolean>(cinemaAudio.isMuted);

  const handleStartAmbient = (preset: 'rain' | 'cyberpunk' | 'space' | 'noir_night' | 'projector') => {
    if (activePreset === preset) {
      cinemaAudio.stopAmbient();
      setActivePreset(null);
    } else {
      cinemaAudio.startAmbient(preset);
      setActivePreset(preset);
    }
  };

  const handleStopAll = () => {
    cinemaAudio.stopAmbient();
    setActivePreset(null);
  };

  const handleMasterVolChange = (v: number) => {
    setMasterVolume(v);
    cinemaAudio.setMasterVolume(v);
  };

  const handleAmbientVolChange = (v: number) => {
    setAmbientVolume(v);
    cinemaAudio.setAmbientVolume(v);
  };

  const handleFoleyVolChange = (v: number) => {
    setFoleyVolume(v);
    cinemaAudio.setFoleyVolume(v);
  };

  const handleToggleMute = () => {
    const muted = cinemaAudio.toggleMute();
    setIsMuted(muted);
  };

  const soundscapes = [
    {
      id: 'rain',
      title: 'Rainstorm & Thunder',
      icon: CloudRain,
      desc: 'Heavy rooftop rain cascade with randomized low-pass rumble.',
      color: 'from-blue-500/20 to-zinc-900',
      tag: 'Weather / Exterior',
    },
    {
      id: 'cyberpunk',
      title: 'Cyberpunk Neon Hum',
      icon: Zap,
      desc: 'Low 55Hz electrical transformer buzz with resonant overtones.',
      color: 'from-purple-500/20 to-zinc-900',
      tag: 'Sci-Fi / Dystopia',
    },
    {
      id: 'space',
      title: 'Deep Space Drone',
      icon: Compass,
      desc: 'Sub-audible 43Hz drone with celestial slow-sine wash.',
      color: 'from-cyan-500/20 to-zinc-900',
      tag: 'Cosmic / Sub-bass',
    },
    {
      id: 'projector',
      title: '35mm Film Projector',
      icon: Film,
      desc: 'Rhythmic mechanical shutter whirr and warm magnetic tape hiss.',
      color: 'from-amber-500/20 to-zinc-900',
      tag: 'Vintage / Cinema',
    },
    {
      id: 'noir_night',
      title: 'Midnight Noir Wind',
      icon: Radio,
      desc: 'Haunting atmospheric breeze whistling through lonely streets.',
      color: 'from-zinc-500/20 to-zinc-900',
      tag: 'Noir / Suspense',
    },
  ] as const;

  const foleyTriggers = [
    {
      label: 'Clapperboard Slate',
      desc: 'Wooden arm snap + room acoustics',
      action: () => cinemaAudio.playClapper(),
      key: '1',
    },
    {
      label: 'Cinematic Sub Boom',
      desc: 'Low-frequency sub-drop impact',
      action: () => cinemaAudio.playImpact(),
      key: '2',
    },
    {
      label: 'Tension Pitch Riser',
      desc: 'Suspense build-up sweep',
      action: () => cinemaAudio.playRiser(),
      key: '3',
    },
    {
      label: 'Heartbeat Pulse',
      desc: 'Double 80Hz lub-dub pulse',
      action: () => cinemaAudio.playHeartbeat(),
      key: '4',
    },
    {
      label: 'Radio Squelch',
      desc: 'Walkie-talkie transmit burst',
      action: () => cinemaAudio.playRadioClick(),
      key: '5',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-62px)] bg-[#090a0d] overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header & Master Controls */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                Cinematic Sound & Foley Lab
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time Web Audio API synthesized ambient atmospheres and Foley soundboard.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleMute}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition"
              title="Toggle Audio Engine Mute"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Master:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => handleMasterVolChange(parseFloat(e.target.value))}
                className="w-24 accent-amber-500"
              />
              <span className="text-zinc-300 w-8">{Math.round(masterVolume * 100)}%</span>
            </div>

            {activePreset && (
              <button
                onClick={handleStopAll}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Atmosphere</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient Atmospheres Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span>Cinematic Ambient Soundscapes</span>
            </h2>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Atmosphere Level:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleAmbientVolChange(parseFloat(e.target.value))}
                className="w-20 accent-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {soundscapes.map((sound) => {
              const isPlaying = activePreset === sound.id;
              const Icon = sound.icon;
              return (
                <div
                  key={sound.id}
                  className={`border rounded-lg p-5 flex flex-col justify-between transition relative overflow-hidden bg-gradient-to-br ${
                    isPlaying
                      ? 'border-amber-500/80 shadow-lg shadow-amber-500/10 bg-zinc-950'
                      : 'border-zinc-800/80 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center ${
                            isPlaying ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-white">{sound.title}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{sound.tag}</span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mt-2">{sound.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {isPlaying ? 'ACTIVE AUDIO LOOP' : 'SYNTH READY'}
                    </span>
                    <button
                      onClick={() => handleStartAmbient(sound.id as any)}
                      className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                        isPlaying
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Audition</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Foley Trigger Soundboard */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Director's Live Foley Soundboard</span>
            </h2>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500">Foley Level:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={foleyVolume}
                onChange={(e) => handleFoleyVolChange(parseFloat(e.target.value))}
                className="w-20 accent-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {foleyTriggers.map((foley) => (
              <button
                key={foley.label}
                onClick={foley.action}
                className="bg-zinc-950 hover:bg-zinc-900 active:scale-95 border border-zinc-800 hover:border-amber-500/50 rounded-lg p-4 text-left flex flex-col justify-between transition group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition">
                      {foley.label}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 border border-zinc-800 rounded px-1">
                      {foley.key}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{foley.desc}</p>
                </div>

                <div className="mt-3 text-[10px] font-mono text-amber-400/80 flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Trigger SFX</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
