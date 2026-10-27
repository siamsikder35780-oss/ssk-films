import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  Check,
  ChevronDown,
  Star,
} from 'lucide-react';
import { Movie } from '../types/streaming';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  myListIds: Set<string>;
  onToggleMyList: (movie: Movie) => void;
  isTopTen?: boolean;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  onSelectMovie,
  onPlayMovie,
  myListIds,
  onToggleMyList,
  isTopTen = false,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;
    const newPos = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

    rowRef.current.scrollTo({ left: newPos, behavior: 'smooth' });
  };

  const onScrollCheck = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative px-4 md:px-12 my-6 sm:my-8 select-none group">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-base sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs text-[#E50914] font-medium opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer hidden sm:inline">
            Explore All ›
          </span>
        </h2>
      </div>

      {/* Row Carousel Area */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs rounded-r cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Scrollable Posters Track */}
        <div
          ref={rowRef}
          onScroll={onScrollCheck}
          className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto overflow-y-visible no-scrollbar py-4 scroll-smooth"
        >
          {movies.map((movie, index) => {
            const isSaved = myListIds.has(movie.id);
            const ratingValue = movie.averageRating ? movie.averageRating.toFixed(1) : '4.8';

            return (
              <div
                key={movie.id}
                className={`shrink-0 transition-transform duration-300 cursor-pointer ${
                  isTopTen ? 'w-44 sm:w-56' : 'w-32 sm:w-44 md:w-52'
                }`}
                onClick={() => onSelectMovie(movie)}
              >
                {isTopTen ? (
                  /* Top 10 Card Layout with Giant Rank Number */
                  <div className="relative flex items-center">
                    {/* Giant Number */}
                    <span className="text-7xl sm:text-8xl md:text-9xl font-black text-[#1f2024] select-none stroke-zinc-700 tracking-tighter -mr-3 sm:-mr-4 z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      {index + 1}
                    </span>

                    {/* Poster Card */}
                    <div className="relative aspect-[2/3] w-28 sm:w-36 md:w-40 rounded overflow-hidden shadow-lg border border-zinc-800/80 hover:border-zinc-500 hover:scale-105 transition-all duration-300 group/card">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                        <span className="bg-[#E50914] text-white text-[9px] font-black uppercase px-1 py-0.2 rounded-xs">
                          TOP 10
                        </span>
                      </div>

                      {/* Star Rating Badge on Card */}
                      <div className="absolute top-1.5 right-1.5">
                        <span className="flex items-center gap-0.5 bg-black/75 backdrop-blur-md text-[9px] font-bold text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          <span>{ratingValue}</span>
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                        <div className="text-white text-xs font-bold truncate">{movie.title}</div>
                        <div className="text-[10px] text-zinc-300 flex items-center gap-1.5 mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            {ratingValue}
                          </span>
                          <span className="text-emerald-400 font-bold">{movie.matchScore}%</span>
                          <span>{movie.releaseYear}</span>
                          <span className="border border-zinc-500 px-1 text-[8px]">{movie.ageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Netflix Poster Card */
                  <div className="relative aspect-[2/3] w-full rounded overflow-hidden shadow-lg border border-zinc-800/80 hover:border-zinc-500 hover:scale-105 transition-all duration-300 group/card bg-zinc-900">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Star Rating Pill Top Left */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className="flex items-center gap-0.5 bg-black/75 backdrop-blur-md text-[9px] font-bold text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{ratingValue}</span>
                      </span>
                    </div>

                    {/* Quality Pill */}
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <span className="bg-black/70 backdrop-blur-md text-[9px] font-mono text-zinc-300 px-1 py-0.5 rounded border border-zinc-700">
                        {movie.quality}
                      </span>
                    </div>

                    {/* Continue Watching Progress Bar */}
                    {movie.continueProgress !== undefined && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-700 z-20">
                        <div
                          className="h-full bg-[#E50914]"
                          style={{ width: `${movie.continueProgress}%` }}
                        />
                      </div>
                    )}

                    {/* Hover Detail Card Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-3 flex flex-col justify-end z-10">
                      {/* Quick Action Icons */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayMovie(movie);
                          }}
                          className="w-7 h-7 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition active:scale-90 cursor-pointer"
                          title="Play Video"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMyList(movie);
                          }}
                          className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-600 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                          title={isSaved ? 'Remove from My List' : 'Add to My List'}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMovie(movie);
                          }}
                          className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-600 text-white flex items-center justify-center ml-auto transition cursor-pointer"
                          title="More Details"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title & Metadata */}
                      <div className="text-white text-xs font-bold truncate leading-tight">
                        {movie.title}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 mt-1">
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {ratingValue}
                        </span>
                        <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
                        <span>{movie.ageRating}</span>
                        <span>{movie.duration}</span>
                      </div>

                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {movie.genres.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs rounded-l cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
};
