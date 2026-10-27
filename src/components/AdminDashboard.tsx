import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Film,
  Search,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { Movie, LanguageCategory, VideoQuality } from '../types/streaming';
import { SAMPLE_VIDEOS } from '../data/movies';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
  onUpdateMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
  onResetDefaults: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  movies,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
  onResetDefaults,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formState, setFormState] = useState<Partial<Movie>>({
    title: '',
    overview: '',
    posterUrl: '',
    backdropUrl: '',
    releaseYear: 2026,
    ageRating: '16+',
    duration: '2h 10m',
    matchScore: 98,
    quality: '4K UHD',
    language: 'Bengali',
    genres: ['Action', 'Thriller'],
    cast: [],
    director: 'Siam Sikder',
    videoUrl: SAMPLE_VIDEOS.TEARS_OF_STEEL,
  });

  if (!isOpen) return null;

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.language.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const startEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormState({ ...movie });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingMovie(null);
    setFormState({
      id: `movie-custom-${Date.now()}`,
      title: '',
      overview: '',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
      releaseYear: 2026,
      ageRating: '16+',
      duration: '2h 15m',
      matchScore: 97,
      quality: '4K UHD',
      language: 'Bengali',
      genres: ['Action', 'Drama'],
      cast: ['Lead Actor', 'Supporting Actor'],
      director: 'Siam Sikder',
      videoUrl: SAMPLE_VIDEOS.TEARS_OF_STEEL,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.overview) return;

    if (isCreating) {
      const newMovie: Movie = {
        id: formState.id || `movie-${Date.now()}`,
        title: formState.title || 'Untitled Movie',
        overview: formState.overview || '',
        posterUrl: formState.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
        backdropUrl: formState.backdropUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
        releaseYear: formState.releaseYear || 2026,
        ageRating: formState.ageRating || '16+',
        duration: formState.duration || '2h 00m',
        matchScore: formState.matchScore || 95,
        quality: (formState.quality as VideoQuality) || '4K UHD',
        language: (formState.language as LanguageCategory) || 'Bengali',
        genres: formState.genres || ['Drama'],
        cast: formState.cast || [],
        director: formState.director || 'Siam Sikder',
        videoUrl: formState.videoUrl || SAMPLE_VIDEOS.TEARS_OF_STEEL,
      };
      onAddMovie(newMovie);
    } else if (editingMovie) {
      onUpdateMovie({
        ...editingMovie,
        ...formState,
      } as Movie);
    }

    setIsCreating(false);
    setEditingMovie(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="relative w-full max-w-5xl bg-[#141414] border border-zinc-800 rounded-lg shadow-2xl p-6 sm:p-8 my-auto text-white space-y-6 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#E50914]" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                SiamFlix Content Management
              </h2>
              <p className="text-xs text-zinc-400">
                Manage movie titles, authorized video streams, posters, and category metadata.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefaults}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs flex items-center gap-1 border border-zinc-700"
              title="Reset sample catalog to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
            <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Split View (List on left, Editor on right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
          {/* Left Column: Movie List */}
          <div className="md:col-span-5 flex flex-col space-y-3 overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800 md:pr-4">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter titles..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded pl-8 pr-2 py-1 text-xs text-white focus:outline-none"
                />
              </div>
              <button
                onClick={startCreate}
                className="px-2.5 py-1 bg-[#E50914] hover:bg-[#b80710] text-white font-bold rounded text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Title</span>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredMovies.map((m) => {
                const isSelected = editingMovie?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => startEdit(m)}
                    className={`p-2 rounded border cursor-pointer flex items-center justify-between gap-2 transition ${
                      isSelected
                        ? 'border-[#E50914] bg-red-950/20'
                        : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-8 h-12 object-cover rounded bg-zinc-800 shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{m.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {m.language} · {m.releaseYear} · {m.quality}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(m);
                        }}
                        className="p-1 hover:text-white text-zinc-400"
                        title="Edit movie"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${m.title}" from catalog?`)) {
                            onDeleteMovie(m.id);
                          }
                        }}
                        className="p-1 hover:text-red-400 text-zinc-500"
                        title="Delete movie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Add / Edit Form */}
          <div className="md:col-span-7 overflow-y-auto pr-1">
            {editingMovie || isCreating ? (
              <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="font-bold text-white text-sm">
                    {isCreating ? 'Add New Movie / Series' : `Editing: ${editingMovie?.title}`}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Language: {formState.language}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-zinc-400 block mb-1">Movie / Series Title</label>
                    <input
                      type="text"
                      required
                      value={formState.title || ''}
                      onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                      placeholder="e.g. Dhaka Nights: The Underworld"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Category / Language</label>
                    <select
                      value={formState.language || 'Bengali'}
                      onChange={(e) => setFormState({ ...formState, language: e.target.value as LanguageCategory })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                    >
                      <option value="Bengali">Bengali</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Korean">Korean</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Release Year</label>
                    <input
                      type="number"
                      value={formState.releaseYear || 2026}
                      onChange={(e) => setFormState({ ...formState, releaseYear: parseInt(e.target.value) || 2026 })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Age Rating</label>
                    <input
                      type="text"
                      value={formState.ageRating || '16+'}
                      onChange={(e) => setFormState({ ...formState, ageRating: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                      placeholder="18+, 16+, 13+, PG"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Duration / Seasons</label>
                    <input
                      type="text"
                      value={formState.duration || '2h 15m'}
                      onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                      placeholder="e.g. 2h 15m or 2 Seasons"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Video Stream Quality</label>
                    <select
                      value={formState.quality || '4K UHD'}
                      onChange={(e) => setFormState({ ...formState, quality: e.target.value as VideoQuality })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                    >
                      <option value="4K UHD">4K UHD</option>
                      <option value="HDR">HDR</option>
                      <option value="HD">HD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Director</label>
                    <input
                      type="text"
                      value={formState.director || ''}
                      onChange={(e) => setFormState({ ...formState, director: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                      placeholder="Director Name"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-zinc-400 block mb-1">Overview / Synopsis</label>
                    <textarea
                      required
                      rows={3}
                      value={formState.overview || ''}
                      onChange={(e) => setFormState({ ...formState, overview: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                      placeholder="Compelling movie synopsis..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-zinc-400 block mb-1">Poster Image URL (2:3 aspect ratio)</label>
                    <input
                      type="url"
                      value={formState.posterUrl || ''}
                      onChange={(e) => setFormState({ ...formState, posterUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-zinc-400 block mb-1">Backdrop Image URL (16:9 widescreen)</label>
                    <input
                      type="url"
                      value={formState.backdropUrl || ''}
                      onChange={(e) => setFormState({ ...formState, backdropUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-zinc-400">Authorized Video Stream URL (.mp4 / HLS)</label>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span>Presets:</span>
                        <button
                          type="button"
                          onClick={() => setFormState({ ...formState, videoUrl: SAMPLE_VIDEOS.TEARS_OF_STEEL })}
                          className="hover:text-amber-400 underline"
                        >
                          Tears of Steel
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => setFormState({ ...formState, videoUrl: SAMPLE_VIDEOS.SINTEL })}
                          className="hover:text-amber-400 underline"
                        >
                          Sintel
                        </button>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={formState.videoUrl || ''}
                      onChange={(e) => setFormState({ ...formState, videoUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMovie(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#E50914] hover:bg-[#b80710] text-white font-bold rounded shadow-lg"
                  >
                    {isCreating ? 'Publish to Catalog' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <Film className="w-12 h-12 text-zinc-700 mb-2 stroke-[1.5]" />
                <p className="text-xs">Select a movie from the left or click "Add Title" to begin editing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
