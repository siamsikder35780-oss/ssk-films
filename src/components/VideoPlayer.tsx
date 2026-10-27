import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Info,
  AlertCircle,
  Film,
  Sparkles,
} from 'lucide-react';
import { Movie } from '../types/streaming';
import { SAMPLE_VIDEOS } from '../data/movies';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // If movie has an authorized videoUrl, use it; otherwise use reliable fallback open movie stream
  const activeVideoUrl = movie.videoUrl || SAMPLE_VIDEOS.TEARS_OF_STEEL;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(`${movie.language} (5.1 Surround)`);
  const [selectedSubtitle, setSelectedSubtitle] = useState('English [CC]');

  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Attempt auto-play with audio on mount
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser policy blocks autoplay with sound, mute and play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        skip(10);
      } else if (e.code === 'ArrowLeft') {
        skip(-10);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'Escape') {
        if (!document.fullscreenElement) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setAudioMenuOpen(false);
      }
    }, 4000);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetHideTimer();
  };

  const skip = (sec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration, videoRef.current.currentTime + sec)
    );
    resetHideTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
    resetHideTimer();
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
      setIsMuted(v === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    videoRef.current.muted = next;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const formatTime = (sec: number) => {
    const s = Math.floor(sec) % 60;
    const m = Math.floor(sec / 60) % 60;
    const h = Math.floor(sec / 3600);
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Video Element */}
      {!videoError && activeVideoUrl ? (
        <video
          ref={videoRef}
          src={activeVideoUrl}
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
          onError={() => setVideoError(true)}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
        />
      ) : (
        /* Friendly message when stream is unavailable */
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto text-white space-y-4">
          <AlertCircle className="w-16 h-16 text-[#E50914] stroke-[1.5]" />
          <h2 className="text-xl sm:text-2xl font-bold">Authorized Stream Pending</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Streaming rights for <span className="text-white font-semibold">{movie.title}</span> are currently being finalized. No unauthorized streams are served on SiamFlix.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] font-bold text-white rounded text-sm transition shadow-lg"
          >
            Return to Browse
          </button>
        </div>
      )}

      {/* Top Header Overlay */}
      <div
        className={`absolute top-0 inset-x-0 p-4 sm:p-8 bg-gradient-to-b from-black/95 via-black/50 to-transparent transition-opacity duration-300 z-30 flex items-center justify-between ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-3 text-white hover:text-zinc-300 transition"
          title="Back to SiamFlix (Esc)"
        >
          <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          <div className="text-left">
            <div className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest">
              SIAMFLIX CINE · {movie.language}
            </div>
            <div className="text-sm sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
              {movie.title}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfoDrawer(!showInfoDrawer)}
            className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition"
            title="Movie Overview & Info"
          >
            <Info className="w-4 h-4" />
          </button>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-red-600 text-[11px] font-bold text-white uppercase shadow">
            {movie.quality}
          </span>
        </div>
      </div>

      {/* Movie Details Popover / Drawer */}
      {showInfoDrawer && (
        <div className="absolute top-20 right-4 sm:right-8 z-40 w-80 sm:w-96 bg-zinc-950/95 border border-zinc-800 rounded-lg p-5 shadow-2xl space-y-3 text-xs text-white backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-bold text-sm text-white">{movie.title}</h3>
            <button onClick={() => setShowInfoDrawer(false)} className="text-zinc-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
            <span>{movie.releaseYear}</span>
            <span className="border border-zinc-600 px-1 rounded text-[9px]">{movie.ageRating}</span>
            <span>{movie.duration}</span>
          </div>
          <p className="text-zinc-300 leading-relaxed text-xs">{movie.overview}</p>
          {movie.cast && (
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
              <span className="text-zinc-500">Cast: </span>
              <span>{movie.cast.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Center Big Play Button (shown when paused) */}
      {!isPlaying && !videoError && (
        <button
          onClick={togglePlay}
          className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 border-2 border-white/80 hover:bg-black/80 hover:scale-105 text-white flex items-center justify-center transition active:scale-95 shadow-2xl backdrop-blur-sm"
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
        </button>
      )}

      {/* Bottom Controls Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-30 space-y-3 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Progress Bar */}
        <div
          onClick={handleSeek}
          className="group/seek w-full h-2 hover:h-3 bg-zinc-800 rounded-full cursor-pointer relative transition-all"
        >
          <div
            className="h-full bg-[#E50914] rounded-full relative"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/seek:scale-100 transition-transform" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left Transport: Play, 10s skips, Volume, Timecode */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={togglePlay} className="p-1 hover:text-zinc-300 transition" title="Play/Pause (Space)">
              {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />}
            </button>

            <button onClick={() => skip(-10)} className="p-1 hover:text-zinc-300 transition" title="Rewind 10s">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button onClick={() => skip(10)} className="p-1 hover:text-zinc-300 transition" title="Forward 10s">
              <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-zinc-300 transition">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-14 sm:w-20 accent-[#E50914] cursor-pointer"
              />
            </div>

            <div className="font-mono text-xs text-zinc-300">
              <span>{formatTime(currentTime)}</span>
              <span className="text-zinc-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Audio/Subtitles, Speed, Fullscreen */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            {/* Audio & Subtitles Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAudioMenuOpen(!audioMenuOpen)}
                className="p-1 hover:text-zinc-300 transition"
                title="Audio and Subtitles"
              >
                <Subtitles className="w-5 h-5" />
              </button>

              {audioMenuOpen && (
                <div className="absolute right-0 bottom-12 w-64 bg-zinc-950/95 border border-zinc-800 rounded-md shadow-2xl p-3 z-50 text-xs">
                  <div className="font-bold text-white mb-2 pb-1 border-b border-zinc-800">
                    Audio &amp; Subtitles
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Audio Track</div>
                      {[`${movie.language} (5.1 Surround)`, 'Hindi Dubbed', 'English Dubbed', 'Bengali Dubbed'].map((a) => (
                        <button
                          key={a}
                          onClick={() => setSelectedAudio(a)}
                          className={`w-full text-left py-1 px-1.5 rounded transition ${
                            selectedAudio === a ? 'text-amber-400 font-bold bg-zinc-900' : 'text-zinc-300 hover:text-white'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-zinc-800 pt-2">
                      <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Subtitles</div>
                      {['English [CC]', 'Bengali [বাংলা]', 'Hindi', 'Off'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSubtitle(s)}
                          className={`w-full text-left py-1 px-1.5 rounded transition ${
                            selectedSubtitle === s ? 'text-amber-400 font-bold bg-zinc-900' : 'text-zinc-300 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                setPlaybackRate(rate);
                if (videoRef.current) videoRef.current.playbackRate = rate;
              }}
              className="bg-zinc-900/80 border border-zinc-700 text-xs rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value={0.75}>0.75x</option>
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>

            {/* Fullscreen Button */}
            <button onClick={toggleFullscreen} className="p-1 hover:text-zinc-300 transition" title="Toggle Fullscreen (F)">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
