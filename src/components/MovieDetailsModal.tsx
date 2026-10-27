import React, { useState } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  Volume2,
  VolumeX,
  Clock,
  Star,
  MessageSquare,
  Sparkles,
  Send,
  User,
} from 'lucide-react';
import { Movie, Review, UserAccount } from '../types/streaming';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  isMyList: boolean;
  onToggleMyList: (movie: Movie) => void;
  relatedMovies: Movie[];
  onSelectRelated: (movie: Movie) => void;
  currentUser?: UserAccount;
  onAddReview?: (movieId: string, rating: number, comment: string) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor (1/5)',
  2: 'Fair (2/5)',
  3: 'Good (3/5)',
  4: 'Great (4/5)',
  5: 'Masterpiece (5/5)',
};

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlay,
  isMyList,
  onToggleMyList,
  relatedMovies,
  onSelectRelated,
  currentUser,
  onAddReview,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Rating & Review State
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(() => {
    if (!movie || !currentUser || !movie.reviews) return 0;
    const existing = movie.reviews.find((r) => r.userId === currentUser.id);
    return existing ? existing.rating : 0;
  });
  const [reviewComment, setReviewComment] = useState<string>(() => {
    if (!movie || !currentUser || !movie.reviews) return '';
    const existing = movie.reviews.find((r) => r.userId === currentUser.id);
    return existing ? existing.comment : '';
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  if (!movie) return null;

  const currentAverageRating = movie.averageRating ?? 4.8;
  const currentRatingsCount = movie.ratingsCount ?? (movie.reviews ? movie.reviews.length : 150);
  const reviewsList = movie.reviews || [];

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) return;

    setIsSubmittingReview(true);
    if (onAddReview) {
      onAddReview(movie.id, userRating, reviewComment.trim());
    }
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewSubmittedSuccess(true);
      setTimeout(() => setReviewSubmittedSuccess(false), 3500);
    }, 300);
  };

  const activeHoverOrSelected = hoveredStar || userRating;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-center overflow-y-auto p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-lg overflow-hidden shadow-2xl my-auto text-white select-none border border-zinc-800"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-[#181818]/80 hover:bg-zinc-800 text-white flex items-center justify-center transition border border-zinc-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Video / Backdrop */}
        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent" />

          {/* Title & Action Buttons Overlay */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col justify-end">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
              {movie.title}
            </h1>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-2.5 bg-white hover:bg-white/90 text-black font-bold rounded text-sm sm:text-base transition active:scale-95 shadow-lg cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play</span>
              </button>

              <button
                onClick={() => onToggleMyList(movie)}
                title={isMyList ? 'Remove from My List' : 'Add to My List'}
                className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-zinc-800 border border-zinc-600 text-white transition active:scale-90 cursor-pointer"
              >
                {isMyList ? <Check className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 sm:p-2.5 rounded-full border border-zinc-600 transition active:scale-90 cursor-pointer ${
                  isLiked ? 'bg-[#E50914] text-white border-[#E50914]' : 'bg-black/60 hover:bg-zinc-800 text-white'
                }`}
                title="Rate this movie"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="ml-auto p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-zinc-800 border border-zinc-600 text-white transition cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Details Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Main Info Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Left 2 Cols: Synopsis, Average Rating & Metadata */}
            <div className="md:col-span-2 space-y-4">
              {/* Prominent Rating & Specs Bar */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm font-semibold">
                {/* 5-Star Average Rating Badge */}
                <div className="flex items-center gap-1.5 bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded border border-amber-400/30">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-sm tracking-tight">
                    {currentAverageRating.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-amber-300/80 font-normal">
                    ({currentRatingsCount.toLocaleString()})
                  </span>
                </div>

                <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
                <span className="text-zinc-400">{movie.releaseYear}</span>
                <span className="border border-zinc-600 px-1.5 py-0.2 text-xs rounded text-zinc-300">
                  {movie.ageRating}
                </span>
                <span className="text-zinc-400">{movie.duration}</span>
                <span className="border border-zinc-600 text-xs px-1.5 py-0.2 rounded text-zinc-200 font-mono">
                  {movie.quality}
                </span>
                <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-1.5 py-0.2 rounded font-medium">
                  {movie.language} Audio
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {movie.overview}
              </p>

              {movie.continueProgress !== undefined && (
                <div className="p-3 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-zinc-300">Resume from {movie.continueProgress}%</span>
                  </div>
                  <button
                    onClick={() => onPlay(movie)}
                    className="text-[#E50914] font-bold hover:underline cursor-pointer"
                  >
                    Resume Playback ›
                  </button>
                </div>
              )}
            </div>

            {/* Right 1 Col: Cast & Specs */}
            <div className="space-y-3 text-xs text-zinc-400 border-t md:border-t-0 md:border-l border-zinc-800 md:pl-6 pt-4 md:pt-0">
              {movie.cast && (
                <div>
                  <span className="text-zinc-500">Cast: </span>
                  <span className="text-zinc-200">{movie.cast.join(', ')}</span>
                </div>
              )}

              {movie.director && (
                <div>
                  <span className="text-zinc-500">Director: </span>
                  <span className="text-zinc-200">{movie.director}</span>
                </div>
              )}

              <div>
                <span className="text-zinc-500">Genres: </span>
                <span className="text-zinc-200">{movie.genres.join(', ')}</span>
              </div>

              <div>
                <span className="text-zinc-500">Audio / Dubbed: </span>
                <span className="text-zinc-200">Bengali, Hindi, English, Korean</span>
              </div>

              <div>
                <span className="text-zinc-500">Subtitles: </span>
                <span className="text-zinc-200">English, Bengali [CC]</span>
              </div>
            </div>
          </div>

          {/* ================= USER RATING & REVIEW SYSTEM ================= */}
          <div className="pt-6 border-t border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>Ratings &amp; Reviews</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Share your score with the SiamFlix community
                </p>
              </div>

              {/* Average Rating Score Display */}
              <div className="flex items-center gap-3 bg-zinc-900/90 px-3.5 py-2 rounded-lg border border-zinc-800">
                <div className="text-right">
                  <div className="text-lg font-black text-amber-400 leading-tight">
                    {currentAverageRating.toFixed(1)} <span className="text-xs text-zinc-400 font-normal">/ 5</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium">
                    {currentRatingsCount.toLocaleString()} global votes
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(currentAverageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive 5-Star Rating Input Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#202020] to-[#1c1c1c] rounded-xl border border-zinc-700/80 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Your Rating:</span>
                  {activeHoverOrSelected > 0 && (
                    <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {RATING_LABELS[activeHoverOrSelected]}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400">
                  {currentUser ? (
                    <span>Rating as <strong className="text-zinc-200">{currentUser.name}</strong></span>
                  ) : (
                    <span>Rating as guest</span>
                  )}
                </div>
              </div>

              {/* 5 Star Buttons with interactive hover & active state */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoveredStar ? star <= hoveredStar : star <= userRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => handleStarClick(star)}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-800 transition transform hover:scale-115 active:scale-95 cursor-pointer focus:outline-none"
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      />
                    </button>
                  );
                })}

                {userRating > 0 && (
                  <button
                    type="button"
                    onClick={() => setUserRating(0)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 ml-2 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Review Text Input Form */}
              <form onSubmit={handleSubmitReview} className="space-y-3 pt-2">
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about this movie... (acting, pacing, directing, cinematography)"
                  rows={2}
                  className="w-full bg-[#141414] border border-zinc-700 rounded-lg p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
                />

                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-zinc-500">
                    {reviewSubmittedSuccess && (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" /> Rating &amp; review saved successfully!
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={userRating === 0 || isSubmittingReview}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer ${
                      userRating > 0
                        ? 'bg-[#E50914] hover:bg-[#b80710] text-white active:scale-95 shadow-md shadow-red-950/40'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReview ? 'Submitting...' : 'Submit Rating & Review'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-semibold">
                User Reviews ({reviewsList.length})
              </h4>

              {reviewsList.length === 0 ? (
                <div className="p-6 bg-zinc-900/50 rounded-lg border border-zinc-800/80 text-center text-xs text-zinc-400">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
                  No reviews submitted yet. Rate above to leave the first review!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-zinc-900/80 rounded-lg border border-zinc-800 hover:border-zinc-700 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                            onError={(e) => {
                              // fallback
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="text-xs font-bold text-white leading-tight">
                              {rev.userName}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {rev.createdAt}
                            </div>
                          </div>
                        </div>

                        {/* Star Rating of Review */}
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-zinc-800">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-amber-400 ml-1">
                            {rev.rating}.0
                          </span>
                        </div>
                      </div>

                      {rev.comment && (
                        <p className="text-xs text-zinc-300 leading-relaxed pl-9">
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* More Like This Section */}
          {relatedMovies.length > 0 && (
            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                More Like This
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {relatedMovies.slice(0, 6).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="bg-[#242424] rounded overflow-hidden cursor-pointer hover:scale-102 transition duration-200 border border-zinc-800 group"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={rel.backdropUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute top-2 right-2 text-[9px] font-mono bg-black/70 px-1 py-0.5 rounded text-zinc-300">
                        {rel.duration}
                      </span>
                    </div>

                    <div className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold">{rel.matchScore}% Match</span>
                        <div className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rel.averageRating ? rel.averageRating.toFixed(1) : '4.8'}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{rel.title}</div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {rel.overview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Banner */}
          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white">About {movie.title}</span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Streamed in authorized 4K Ultra HD. Copyright © SSK Films / SiamFlix.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-zinc-700 px-2 py-1 rounded text-[10px] text-zinc-300">
                Dolby Vision
              </span>
              <span className="border border-zinc-700 px-2 py-1 rounded text-[10px] text-zinc-300">
                Dolby Atmos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
