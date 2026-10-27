import React from 'react';
import { Bookmark, Play, Trash2, Film, Plus, Star } from 'lucide-react';
import { Movie } from '../types/streaming';

interface MyListPageProps {
  myListMovies: Movie[];
  continueWatchingMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onRemoveFromList: (movie: Movie) => void;
  onBrowseMore: () => void;
}

export const MyListPage: React.FC<MyListPageProps> = ({
  myListMovies,
  continueWatchingMovies,
  onSelectMovie,
  onPlayMovie,
  onRemoveFromList,
  onBrowseMore,
}) => {
  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-16 bg-[#141414] text-white">
      {/* Header */}
      <div className="max-w-[1720px] mx-auto mb-8 flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Bookmark className="w-5 h-5 text-[#E50914] fill-current" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            My List &amp; Watchlist
          </h1>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {myListMovies.length} saved titles
        </span>
      </div>

      {/* Continue Watching Section (if any) */}
      {continueWatchingMovies.length > 0 && (
        <div className="max-w-[1720px] mx-auto mb-10">
          <h2 className="text-base sm:text-lg font-bold text-white mb-3">
            Continue Watching
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {continueWatchingMovies.map((movie) => (
              <div
                key={`cw-${movie.id}`}
                onClick={() => onSelectMovie(movie)}
                className="group relative rounded overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-500 cursor-pointer transition shadow-lg"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />

                  {/* Star rating on backdrop */}
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-0.5 bg-black/80 backdrop-blur-md text-[9px] font-bold text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{movie.averageRating ? movie.averageRating.toFixed(1) : '4.8'}</span>
                    </span>
                  </div>

                  {/* Center Play Icon */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayMovie(movie);
                      }}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-zinc-700">
                    <div
                      className="h-full bg-[#E50914]"
                      style={{ width: `${movie.continueProgress || 50}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-white truncate">{movie.title}</div>
                    <div className="text-[10px] text-zinc-400">
                      {movie.continueProgress}% completed
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayMovie(movie);
                    }}
                    className="p-1.5 rounded-full hover:bg-zinc-800 text-white cursor-pointer"
                    title="Resume"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Grid */}
      <div className="max-w-[1720px] mx-auto">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3">
          Saved Favorites
        </h2>

        {myListMovies.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <Film className="w-12 h-12 text-zinc-600 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-white">Your list is currently empty</h3>
            <p className="text-xs text-zinc-400">
              Explore Bengali, Hindi, Korean, or Hollywood films and tap the <span className="text-white font-bold">+</span> button on any poster to save it here.
            </p>
            <button
              onClick={onBrowseMore}
              className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] font-bold text-white rounded text-sm transition cursor-pointer"
            >
              Browse Trending Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {myListMovies.map((movie) => {
              const ratingValue = movie.averageRating ? movie.averageRating.toFixed(1) : '4.8';

              return (
                <div
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="group relative aspect-[2/3] rounded overflow-hidden shadow-lg border border-zinc-800 hover:border-zinc-500 cursor-pointer transition-all duration-300 hover:scale-105 bg-zinc-900"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Star Rating Badge on Card */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="flex items-center gap-0.5 bg-black/80 backdrop-blur-md text-[8px] font-bold text-amber-400 px-1 py-0.5 rounded border border-amber-400/40">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{ratingValue}</span>
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end z-10">
                    <div className="flex items-center gap-1.5 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayMovie(movie);
                        }}
                        className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center transition active:scale-90 cursor-pointer"
                        title="Play"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromList(movie);
                        }}
                        className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-red-950 text-white hover:text-red-400 border border-zinc-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                        title="Remove from My List"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-white text-xs font-bold truncate leading-tight">
                      {movie.title}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 mt-1">
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {ratingValue}
                      </span>
                      <span className="text-emerald-400 font-bold">{movie.matchScore}%</span>
                      <span>{movie.releaseYear}</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
