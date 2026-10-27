import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Play,
  Plus,
  Check,
  Film,
  Filter,
  Lock,
  Star,
} from 'lucide-react';
import { Movie, LanguageCategory } from '../types/streaming';

interface SearchPageProps {
  movies: Movie[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  myListIds: Set<string>;
  onToggleMyList: (movie: Movie) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  movies,
  searchQuery,
  onSearchChange,
  onSelectMovie,
  onPlayMovie,
  myListIds,
  onToggleMyList,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Movies' | 'Series'>('All');

  // Multi-attribute search filtering: Title, Language, Genre, Release Year
  const filteredMovies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return movies.filter((movie) => {
      // Language filter
      if (selectedLanguage !== 'All' && movie.language !== selectedLanguage) {
        return false;
      }

      // Type filter
      if (selectedType === 'Movies' && movie.isSeries) return false;
      if (selectedType === 'Series' && !movie.isSeries) return false;

      // Text query match (title, language, genres, release year)
      if (!q) return true;

      const titleMatch = movie.title.toLowerCase().includes(q);
      const originalTitleMatch = movie.originalTitle ? movie.originalTitle.toLowerCase().includes(q) : false;
      const langMatch = movie.language.toLowerCase().includes(q);
      const yearMatch = movie.releaseYear.toString().includes(q);
      const genreMatch = movie.genres.some((g) => g.toLowerCase().includes(q));
      const castMatch = movie.cast ? movie.cast.some((c) => c.toLowerCase().includes(q)) : false;

      return titleMatch || originalTitleMatch || langMatch || yearMatch || genreMatch || castMatch;
    });
  }, [movies, searchQuery, selectedLanguage, selectedType]);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-16 bg-[#141414] text-white">
      {/* Search Input Bar & Controls */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, language (Bengali, Hindi...), genre, or release year (2025, 2026)..."
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg pl-12 pr-10 py-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-[#E50914] shadow-2xl transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Language:
          </span>
          {['All', 'Bengali', 'Hindi', 'English', 'Korean'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-full border transition font-medium cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-white text-black border-white font-bold shadow-md'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              {lang}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-zinc-700 mx-2 hidden sm:block" />

          {['All', 'Movies', 'Series'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-3 py-1 rounded-full border transition font-medium cursor-pointer ${
                selectedType === type
                  ? 'bg-[#E50914] text-white border-[#E50914] font-bold shadow-md'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-[1720px] mx-auto flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <h2 className="text-sm sm:text-base font-bold text-zinc-300">
          {searchQuery ? (
            <span>
              Search Results for <span className="text-[#E50914]">"{searchQuery}"</span>
            </span>
          ) : (
            <span>All Titles in Catalog</span>
          )}
        </h2>
        <span className="text-xs font-mono text-zinc-500">
          {filteredMovies.length} matching {filteredMovies.length === 1 ? 'title' : 'titles'}
        </span>
      </div>

      {/* Grid of Movie Cards */}
      <div className="max-w-[1720px] mx-auto">
        {filteredMovies.length === 0 ? (
          /* Friendly No Results Found Message */
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Film className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-white">No results found for "{searchQuery}"</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We couldn't find any matching movie or series. Try searching by language (e.g. <em>Bengali</em>, <em>Hindi</em>, <em>Korean</em>), genre (e.g. <em>Action</em>, <em>Thriller</em>), or release year (e.g. <em>2026</em>).
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {['Dhaka', 'Jawan', '2026', 'Bengali', 'Sci-Fi', 'Korean'].map((suggest) => (
                <button
                  key={suggest}
                  onClick={() => onSearchChange(suggest)}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-xs cursor-pointer"
                >
                  {suggest}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredMovies.map((movie) => {
              const isSaved = myListIds.has(movie.id);
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
                    loading="lazy"
                  />

                  {/* Badges Left */}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                    <span className="bg-red-600/90 text-white text-[8px] font-bold uppercase px-1 py-0.5 rounded shadow">
                      {movie.language}
                    </span>
                    {movie.isPremiumOnly && (
                      <span className="bg-amber-500/90 text-black text-[8px] font-black uppercase px-1 py-0.5 rounded shadow flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        <span>VIP</span>
                      </span>
                    )}
                  </div>

                  {/* Star Rating Badge Right */}
                  <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1">
                    <span className="flex items-center gap-0.5 bg-black/80 backdrop-blur-md text-[8px] font-bold text-amber-400 px-1 py-0.5 rounded border border-amber-400/40">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{ratingValue}</span>
                    </span>
                    <span className="bg-black/75 backdrop-blur-md text-[8px] font-mono text-zinc-300 px-1 py-0.5 rounded border border-zinc-700">
                      {movie.releaseYear}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end z-10">
                    <div className="flex items-center gap-1.5 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayMovie(movie);
                        }}
                        className="w-7 h-7 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition active:scale-90 shadow-md cursor-pointer"
                        title="Play Video"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMyList(movie);
                        }}
                        className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                        title={isSaved ? 'Remove from My List' : 'Add to My List'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
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
                      <span className="border border-zinc-500 px-0.5 text-[8px]">{movie.ageRating}</span>
                    </div>

                    <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {movie.genres.slice(0, 2).join(' · ')}
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
