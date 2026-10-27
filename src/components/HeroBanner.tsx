import React, { useState } from 'react';
import { Play, Info, Volume2, VolumeX, Plus, Check, Star } from 'lucide-react';
import { Movie } from '../types/streaming';

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  isMyList: boolean;
  onToggleMyList: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlay,
  onMoreInfo,
  isMyList,
  onToggleMyList,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[88vh] select-none overflow-hidden bg-black">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Vignette and Netflix Bottom Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent z-10" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/70 to-transparent z-10" />
      </div>

      {/* Featured Content Details */}
      <div className="relative z-20 h-full max-w-[1720px] mx-auto px-4 md:px-12 flex flex-col justify-end pb-24 md:pb-32 max-w-2xl lg:max-w-3xl">
        {/* Studio Kicker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-4 bg-[#E50914] rounded-xs" />
          <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white/90 drop-shadow">
            SIAMFLIX ORIGINAL FILM
          </span>
          <span className="text-zinc-500">·</span>
          <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
            {movie.language} Cinema
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl mb-3">
          {movie.title}
        </h1>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold mb-3">
          {/* Average Star Rating */}
          <span className="flex items-center gap-1 text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-amber-400/40 backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.averageRating ? movie.averageRating.toFixed(1) : '4.9'}</span>
          </span>
          <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
          <span className="text-zinc-300 font-normal">{movie.releaseYear}</span>
          <span className="border border-zinc-500 text-zinc-300 text-[10px] px-1 py-0.2 rounded">
            {movie.ageRating}
          </span>
          <span className="text-zinc-300 font-normal">{movie.duration}</span>
          <span className="border border-zinc-600 text-zinc-200 text-[10px] px-1.5 py-0.2 rounded bg-black/40">
            {movie.quality}
          </span>
        </div>

        {/* Synopsis Overview */}
        <p className="text-xs sm:text-sm md:text-base text-zinc-200 line-clamp-3 leading-relaxed mb-6 drop-shadow">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-white/90 active:scale-95 text-black font-bold rounded text-sm sm:text-base transition shadow-2xl"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Watch Now</span>
          </button>

          <button
            onClick={() => onMoreInfo(movie)}
            className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-zinc-600/70 hover:bg-zinc-600/90 active:scale-95 text-white font-semibold rounded text-sm sm:text-base transition backdrop-blur-md"
          >
            <Info className="w-5 h-5" />
            <span>More Info</span>
          </button>

          <button
            onClick={() => onToggleMyList(movie)}
            title={isMyList ? 'Remove from My List' : 'Add to My List'}
            className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-zinc-800 border border-zinc-600 text-white transition active:scale-90"
          >
            {isMyList ? <Check className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Right Corner Badging: Rating & Mute */}
      <div className="absolute right-0 bottom-24 md:bottom-32 z-20 flex items-center gap-3 pr-4 md:pr-12">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full border border-zinc-600/80 bg-black/50 hover:bg-black/80 text-white transition backdrop-blur-sm"
          title={isMuted ? 'Unmute Trailer Preview' : 'Mute Trailer Preview'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="bg-zinc-900/80 border-l-3 border-zinc-300 py-1 px-3 text-xs font-semibold text-zinc-200 backdrop-blur-sm">
          {movie.ageRating}
        </div>
      </div>
    </div>
  );
};
