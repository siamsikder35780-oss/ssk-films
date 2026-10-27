import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Sliders,
  Ratio,
  Clapperboard,
  Film,
  FastForward,
  SkipBack,
  SkipForward,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react';
import { AspectRatio, FilmProject, LUTFilter, Shot } from '../types/film';
import { cinemaAudio } from '../utils/audioEngine';

interface DirectorPlayerProps {
  project: FilmProject;
  onUpdateProject: (updated: Partial<FilmProject>) => void;
}

export const DirectorPlayer: React.FC<DirectorPlayerProps> = ({ project, onUpdateProject }) => {
  const shots = project.shots;

  // Calculate total runtime in seconds
  const totalSeconds = shots.reduce((acc, s) => acc + (s.durationSeconds || 3), 0) || 10;

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHud, setShowHud] = useState<boolean>(true);

  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastTriggeredShotIdRef = useRef<string | null>(null);

  // Find current shot based on currentTime
  let accumulatedTime = 0;
  let activeShotIndex = 0;
  let currentShot: Shot = shots[0] || {
    id: 'default',
    shotNumber: '1A',
    shotType: 'Wide Shot',
    cameraMovement: 'Static',
    lens: '35mm',
    lightingMood: 'Natural',
    visualDescription: 'No shots available.',
    durationSeconds: 5,
    sceneId: '1',
  };

  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    const dur = s.durationSeconds || 3;
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + dur) {
      activeShotIndex = i;
      currentShot = s;
      break;
    }
    accumulatedTime += dur;
  }

  // Trigger audio on shot transition
  useEffect(() => {
    if (isPlaying && currentShot && currentShot.id !== lastTriggeredShotIdRef.current) {
      lastTriggeredShotIdRef.current = currentShot.id;
      // Trigger ambient or foley sound
      if (currentShot.soundCue) {
        const cue = currentShot.soundCue.toLowerCase();
        if (cue.includes('thunder') || cue.includes('rain')) {
          cinemaAudio.startAmbient('rain');
        } else if (cue.includes('drone') || cue.includes('space') || cue.includes('sub')) {
          cinemaAudio.startAmbient('space');
        } else if (cue.includes('engine') || cue.includes('impact') || cue.includes('shatter') || cue.includes('crash')) {
          cinemaAudio.playImpact();
        } else if (cue.includes('radio') || cue.includes('siren') || cue.includes('ping')) {
          cinemaAudio.playRadioClick();
        } else {
          // Default subtle ambiance
          cinemaAudio.startAmbient('noir_night');
        }
      }
    }
  }, [isPlaying, currentShot]);

  // Main playback loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const step = (now: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = now;
        const deltaSec = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= totalSeconds) {
            if (isLooping) {
              lastTriggeredShotIdRef.current = null;
              return 0;
            } else {
              setIsPlaying(false);
              return totalSeconds;
            }
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(step);
      };

      animationFrameRef.current = requestAnimationFrame(step);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, isLooping, totalSeconds]);

  // Keyboard shortcut: Space to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      // Start ambient synth if not already playing
      if (project.colorGrade === 'lut-cyberpunk') {
        cinemaAudio.startAmbient('cyberpunk');
      } else if (project.colorGrade === 'lut-vintage-5219') {
        cinemaAudio.startAmbient('projector');
      } else {
        cinemaAudio.startAmbient('noir_night');
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(ratio * totalSeconds);
  };

  const formatTimecode = (sec: number) => {
    const totalFrames = Math.floor(sec * 24);
    const frames = totalFrames % 24;
    const s = Math.floor(sec) % 60;
    const m = Math.floor(sec / 60) % 60;
    const h = Math.floor(sec / 3600);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // Aspect ratio helper class
  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '2.39:1':
        return 'aspect-cinemascope max-w-[960px]';
      case '1.85:1':
        return 'aspect-widescreen max-w-[850px]';
      case '16:9':
        return 'aspect-standard max-w-[800px]';
      case '4:3':
        return 'aspect-academy max-w-[640px]';
      case '9:16':
        return 'aspect-reel max-h-[580px]';
      default:
        return 'aspect-standard max-w-[800px]';
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className={`flex flex-col bg-[#07080a] ${
        isFullscreen ? 'fixed inset-0 z-50 p-6' : 'h-[calc(100vh-62px)]'
      }`}
    >
      {/* Viewport Theatre Canvas Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black select-none">
        {/* Aspect Ratio Box */}
        <div
          className={`w-full relative rounded border border-zinc-800 shadow-2xl overflow-hidden bg-zinc-950 transition-all ${getAspectRatioClass(
            project.aspectRatio
          )}`}
        >
          {/* Visual Screen Canvas / Storyboard Image */}
          <div className={`w-full h-full relative ${project.colorGrade} transition-all duration-300`}>
            {currentShot.imageUrl ? (
              <img
                src={currentShot.imageUrl}
                alt={`Shot ${currentShot.shotNumber}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                style={{
                  transform: isPlaying
                    ? currentShot.cameraMovement.includes('Push')
                      ? 'scale(1.08)'
                      : currentShot.cameraMovement.includes('Pan')
                      ? 'translateX(10px)'
                      : 'scale(1.02)'
                    : 'scale(1)',
                }}
              />
            ) : (
              /* High-fidelity Cinematic Simulation Canvas */
              <div className="w-full h-full flex flex-col items-center justify-center relative p-8 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black overflow-hidden">
                {/* Background cinematic grid / atmosphere */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

                {/* Simulated Camera Frame */}
                <div className="w-full max-w-lg border border-zinc-700/50 rounded p-6 flex flex-col items-center justify-center text-center relative backdrop-blur-xs">
                  {/* Aspect markers */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500">
                    SSK CINE · {project.aspectRatio}
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-400">
                    SHOT {currentShot.shotNumber}
                  </div>

                  <div className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight mb-1">
                    {currentShot.shotType}
                  </div>
                  <div className="text-xs font-mono text-amber-400/90 mb-3">
                    {currentShot.lens} · {currentShot.cameraMovement}
                  </div>

                  <p className="text-xs text-zinc-300 max-w-md leading-relaxed line-clamp-3">
                    {currentShot.visualDescription}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                    <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                      {currentShot.lightingMood}
                    </span>
                    {currentShot.soundCue && (
                      <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                        🔊 {currentShot.soundCue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cinematic Subtitles Burn-in */}
            {currentShot.dialogue && (
              <div className="absolute bottom-6 inset-x-0 flex justify-center px-4 pointer-events-none">
                <div className="bg-black/70 backdrop-blur-md px-4 py-1.5 rounded text-amber-300 font-medium text-xs md:text-sm shadow-xl text-center max-w-lg border border-zinc-800/60">
                  {currentShot.dialogue}
                </div>
              </div>
            )}

            {/* Director HUD Overlays */}
            {showHud && (
              <>
                {/* Top HUD */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded border border-zinc-800 text-amber-400 font-bold">
                      SHOT {currentShot.shotNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-zinc-300">
                      {activeShotIndex + 1} / {shots.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded border border-zinc-800 text-emerald-400 font-bold">
                      {formatTimecode(currentTime)}
                    </span>
                  </div>
                </div>

                {/* Bottom Left Specs */}
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-400 pointer-events-none bg-black/70 px-2 py-1 rounded border border-zinc-800/60">
                  {project.title.toUpperCase()} · {project.colorGrade.replace('lut-', '').toUpperCase()}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={() => setShowHud(!showHud)}
            className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700/80 text-xs backdrop-blur-sm"
            title="Toggle Director HUD"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700/80 text-xs backdrop-blur-sm"
            title="Toggle Fullscreen Screening"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Track Director Timeline & Controls Drawer */}
      <div className="h-56 bg-zinc-950 border-t border-zinc-800/80 flex flex-col shrink-0 select-none">
        {/* Playback Control Bar */}
        <div className="h-10 border-b border-zinc-800/80 px-4 flex items-center justify-between gap-4 text-xs">
          {/* Transport Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTime(0)}
              title="Return to Beginning"
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Cut</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentTime(totalSeconds)}
              title="Jump to End"
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

            {/* Timecode display */}
            <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
              {formatTimecode(currentTime)}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              / {formatTimecode(totalSeconds)}
            </span>
          </div>

          {/* Right settings: Speed & Loop */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span>Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-200"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1.0x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2.0x</option>
              </select>
            </div>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`px-2 py-0.5 text-[11px] rounded border transition ${
                isLooping
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                  : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Loop
            </button>
          </div>
        </div>

        {/* Multi-Track Timeline Grid */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 flex flex-col justify-between">
          {/* Scrubber Area */}
          <div
            onClick={handleTimelineClick}
            className="w-full h-full relative bg-zinc-900/60 rounded border border-zinc-800 cursor-pointer overflow-hidden flex flex-col justify-between p-1.5"
          >
            {/* Playhead Vertical Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-amber-400 z-30 pointer-events-none shadow-md shadow-amber-400/50"
              style={{ left: `${(currentTime / totalSeconds) * 100}%` }}
            >
              <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 -ml-1 -mt-0.5" />
            </div>

            {/* TRACK 1: Visual / Storyboard Track */}
            <div className="h-14 relative flex items-center gap-1 border-b border-zinc-800/80 pb-1">
              <div className="w-16 shrink-0 text-[10px] font-mono font-bold text-zinc-500 uppercase">
                Visual
              </div>
              <div className="flex-1 h-full relative flex items-center">
                {shots.map((shot, idx) => {
                  const widthPercent = ((shot.durationSeconds || 3) / totalSeconds) * 100;
                  const isCurrent = idx === activeShotIndex;
                  return (
                    <div
                      key={shot.id}
                      style={{ width: `${widthPercent}%` }}
                      className={`h-full border rounded-sm mr-0.5 p-1 flex items-center justify-between transition overflow-hidden text-[10px] font-mono ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-500/20 text-white font-bold shadow-inner'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="truncate">
                        {shot.shotNumber}: {shot.shotType.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-zinc-500 shrink-0">{shot.durationSeconds}s</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRACK 2: Dialogue & Subtitles */}
            <div className="h-8 relative flex items-center gap-1 border-b border-zinc-800/80">
              <div className="w-16 shrink-0 text-[10px] font-mono font-bold text-zinc-500 uppercase">
                Dialogue
              </div>
              <div className="flex-1 h-full relative flex items-center">
                {shots.map((shot) => {
                  const widthPercent = ((shot.durationSeconds || 3) / totalSeconds) * 100;
                  return (
                    <div
                      key={`dialog-${shot.id}`}
                      style={{ width: `${widthPercent}%` }}
                      className="h-full px-1 flex items-center overflow-hidden"
                    >
                      {shot.dialogue ? (
                        <div className="w-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] rounded px-1.5 py-0.5 truncate font-mono">
                          {shot.dialogue}
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-zinc-800/60 rounded" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRACK 3: Foley & Sound FX */}
            <div className="h-8 relative flex items-center gap-1">
              <div className="w-16 shrink-0 text-[10px] font-mono font-bold text-zinc-500 uppercase">
                Foley FX
              </div>
              <div className="flex-1 h-full relative flex items-center">
                {shots.map((shot) => {
                  const widthPercent = ((shot.durationSeconds || 3) / totalSeconds) * 100;
                  return (
                    <div
                      key={`sound-${shot.id}`}
                      style={{ width: `${widthPercent}%` }}
                      className="h-full px-1 flex items-center overflow-hidden"
                    >
                      {shot.soundCue ? (
                        <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] rounded px-1.5 py-0.5 truncate font-mono">
                          🔊 {shot.soundCue}
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-zinc-800/40 rounded" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
