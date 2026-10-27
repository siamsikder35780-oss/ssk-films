/**
 * SiamFlix — SSK Films Movie Streaming Platform
 * Netflix-inspired premium dark theme with Bengali, Hindi, English, and Korean cinema,
 * working movie search by title, language, genre, and year,
 * full user authentication (Sign up, Login, Logout, Profile),
 * and Premium subscription system with test payment verification.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Movie, UserAccount, MembershipPlan, Review } from './types/streaming';
import { INITIAL_MOVIES } from './data/movies';
import { DEMO_USERS, MEMBERSHIP_PLANS } from './data/plans';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieRow } from './components/MovieRow';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { VideoPlayer } from './components/VideoPlayer';
import { SearchPage } from './components/SearchPage';
import { MyListPage } from './components/MyListPage';
import { MembershipModal } from './components/MembershipModal';
import { CheckoutModal } from './components/CheckoutModal';
import { UserProfilePage } from './components/UserProfilePage';
import { PlansPage } from './components/PlansPage';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

const STORAGE_KEY_MOVIES = 'siamflix_movies_catalog_v5';
const STORAGE_KEY_USERS = 'siamflix_registered_users_v4';
const STORAGE_KEY_CURRENT_USER = 'siamflix_current_user_v4';

export default function App() {
  // Movies Catalog with rating & reviews persistence
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOVIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: Movie) => {
            const seed = INITIAL_MOVIES.find((init) => init.id === m.id);
            return {
              ...m,
              averageRating: m.averageRating ?? seed?.averageRating ?? 4.8,
              ratingsCount: m.ratingsCount ?? seed?.ratingsCount ?? 150,
              reviews: m.reviews && m.reviews.length > 0 ? m.reviews : (seed?.reviews || []),
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_MOVIES;
  });

  // Users Directory & Bubble-style persistence
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEMO_USERS;
  });

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEMO_USERS[0]; // Default to Siam (Premium 4K)
  });

  // Navigation & UI States
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMovieModal, setActiveMovieModal] = useState<Movie | null>(null);
  const [activeVideoPlayer, setActiveVideoPlayer] = useState<Movie | null>(null);
  const [membershipModalOpen, setMembershipModalOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutTargetMovie, setCheckoutTargetMovie] = useState<Movie | null>(null);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<MembershipPlan>(MEMBERSHIP_PLANS[2]);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState<boolean>(false);
  const [authPageInitialMode, setAuthPageInitialMode] = useState<'login' | 'signup'>('login');

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOVIES, JSON.stringify(movies));
    } catch {
      // ignore
    }
  }, [movies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Featured Hero Movie
  const featuredMovie = useMemo(() => {
    return movies.find((m) => m.isFeatured) || movies[0];
  }, [movies]);

  // Rows Categorization
  const trendingMovies = useMemo(() => movies.filter((m) => m.matchScore >= 95), [movies]);
  const popularMovies = useMemo(() => movies.filter((m) => !m.isSeries), [movies]);
  const bengaliMovies = useMemo(() => movies.filter((m) => m.language === 'Bengali'), [movies]);
  const hindiMovies = useMemo(() => movies.filter((m) => m.language === 'Hindi'), [movies]);
  const englishMovies = useMemo(() => movies.filter((m) => m.language === 'English'), [movies]);
  const koreanMovies = useMemo(() => movies.filter((m) => m.language === 'Korean'), [movies]);
  const webSeries = useMemo(() => movies.filter((m) => m.isSeries), [movies]);
  const topTenMovies = useMemo(
    () => movies.filter((m) => m.topTenRank !== undefined).sort((a, b) => (a.topTenRank || 0) - (b.topTenRank || 0)),
    [movies]
  );

  // Private User Watchlist & Continue Watching (Scoped to active user)
  const myListIds = useMemo(() => new Set(currentUser.myList || []), [currentUser.myList]);

  const myListMovies = useMemo(() => {
    return movies.filter((m) => myListIds.has(m.id));
  }, [movies, myListIds]);

  const continueWatchingMovies = useMemo(() => {
    const progressMap = new Map((currentUser.continueWatching || []).map((cw) => [cw.movieId, cw.progress]));
    return movies
      .filter((m) => progressMap.has(m.id) || m.continueProgress !== undefined)
      .map((m) => ({
        ...m,
        continueProgress: progressMap.get(m.id) ?? m.continueProgress,
      }));
  }, [movies, currentUser.continueWatching]);

  // Handlers
  const handleToggleMyList = (movie: Movie) => {
    const list = new Set(currentUser.myList || []);
    if (list.has(movie.id)) {
      list.delete(movie.id);
    } else {
      list.add(movie.id);
    }
    const updated: UserAccount = {
      ...currentUser,
      myList: Array.from(list),
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  /**
   * Watch Page Handler with Premium Content Lock Verification
   */
  const handlePlayMovie = (movie: Movie) => {
    setActiveMovieModal(null);

    // If movie is Premium-only and user is on Free membership, trigger Test Payment Workflow!
    if (movie.isPremiumOnly && currentUser.membershipPlan === 'Free') {
      setCheckoutTargetMovie(movie);
      setCheckoutTargetPlan(MEMBERSHIP_PLANS[2]); // Premium 4K
      setCheckoutModalOpen(true);
      return;
    }

    // Open cinema video player
    setActiveVideoPlayer(movie);
  };

  const handlePaymentSuccess = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // If payment was triggered by attempting to play a premium movie, launch player immediately!
    if (checkoutTargetMovie) {
      setActiveVideoPlayer(checkoutTargetMovie);
      setCheckoutTargetMovie(null);
    }
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentView('home');
  };

  const handleLogout = () => {
    // Switch to guest account or show auth page
    const guestUser = users.find((u) => u.email === 'guest@siamflix.com') || DEMO_USERS[1];
    setCurrentUser(guestUser);
    setCurrentView('home');
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const handleUpdateMovie = (updated: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const handleResetDefaults = () => {
    setMovies(INITIAL_MOVIES);
    localStorage.removeItem(STORAGE_KEY_MOVIES);
  };

  const handleAddReview = (movieId: string, rating: number, comment: string) => {
    setMovies((prev) =>
      prev.map((m) => {
        if (m.id !== movieId) return m;

        const currentReviews = m.reviews || [];
        const existingIdx = currentReviews.findIndex((r) => r.userId === currentUser.id);

        let updatedReviews: Review[];
        if (existingIdx >= 0) {
          // Update existing review
          updatedReviews = [...currentReviews];
          updatedReviews[existingIdx] = {
            ...updatedReviews[existingIdx],
            rating,
            comment,
            createdAt: 'Just now',
          };
        } else {
          // Add new review
          const newReview: Review = {
            id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            movieId,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatarUrl,
            rating,
            comment,
            createdAt: 'Just now',
          };
          updatedReviews = [newReview, ...currentReviews];
        }

        // Recalculate average rating
        const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const baselineVotes = Math.max(0, (m.ratingsCount || 50) - (m.reviews?.length || 0));
        const baselineRating = m.averageRating || 4.8;
        const totalVotes = baselineVotes + updatedReviews.length;
        const newAverage =
          totalVotes > 0
            ? (baselineVotes * baselineRating + totalRatingSum) / totalVotes
            : rating;

        const updatedMovie: Movie = {
          ...m,
          averageRating: Math.round(newAverage * 10) / 10,
          ratingsCount: (m.ratingsCount ? m.ratingsCount : 100) + (existingIdx >= 0 ? 0 : 1),
          reviews: updatedReviews,
        };

        if (activeMovieModal && activeMovieModal.id === movieId) {
          setActiveMovieModal(updatedMovie);
        }

        return updatedMovie;
      })
    );
  };

  const relatedMovies = useMemo(() => {
    if (!activeMovieModal) return [];
    return movies.filter(
      (m) =>
        m.id !== activeMovieModal.id &&
        (m.language === activeMovieModal.language || m.genres.some((g) => activeMovieModal.genres.includes(g)))
    );
  }, [activeMovieModal, movies]);

  // Full screen dedicated Auth Page
  if (currentView === 'auth') {
    return (
      <AuthPage
        initialMode={authPageInitialMode}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
        users={users}
        onCancel={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans select-none antialiased">
      {/* Top Sticky Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        myListCount={myListIds.size}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthPageInitialMode('login');
          setCurrentView('auth');
        }}
        onOpenMembership={() => setCurrentView('plans')}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
        onLogout={handleLogout}
      />

      {/* Primary Workspace View */}
      <main className="flex-1 pb-16 lg:pb-0">
        {currentView === 'search' ? (
          /* Search View: Supports searching by title, language, genre, and release year */
          <SearchPage
            movies={movies}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectMovie={setActiveMovieModal}
            onPlayMovie={handlePlayMovie}
            myListIds={myListIds}
            onToggleMyList={handleToggleMyList}
          />
        ) : currentView === 'mylist' ? (
          /* User's Private Watchlist & Continue Watching */
          <MyListPage
            myListMovies={myListMovies}
            continueWatchingMovies={continueWatchingMovies}
            onSelectMovie={setActiveMovieModal}
            onPlayMovie={handlePlayMovie}
            onRemoveFromList={handleToggleMyList}
            onBrowseMore={() => setCurrentView('home')}
          />
        ) : currentView === 'profile' ? (
          /* User Profile & Subscription Status Page */
          <UserProfilePage
            currentUser={currentUser}
            onOpenMembership={() => setCurrentView('plans')}
            onOpenCheckout={() => {
              setCheckoutTargetMovie(null);
              setCheckoutTargetPlan(MEMBERSHIP_PLANS[2]);
              setCheckoutModalOpen(true);
            }}
            onLogout={handleLogout}
            onNavigateToMyList={() => setCurrentView('mylist')}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            }}
          />
        ) : currentView === 'plans' ? (
          /* Dedicated Plans & Pricing Comparison Page */
          <PlansPage
            currentUser={currentUser}
            onSelectPlanForCheckout={(plan) => {
              setCheckoutTargetMovie(null);
              setCheckoutTargetPlan(plan);
              setCheckoutModalOpen(true);
            }}
            onDowngradeToFree={() => {
              const updated: UserAccount = {
                ...currentUser,
                membershipPlan: 'Free',
                subscriptionStatus: 'active',
              };
              setCurrentUser(updated);
              setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            }}
            onReturnToBrowse={() => setCurrentView('home')}
          />
        ) : currentView === 'bengali' ? (
          /* Dedicated Bengali Cinema Hub */
          <div className="pt-24 px-4 md:px-12 pb-16">
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                SSK Films Heritage &amp; Contemporary
              </div>
              <h1 className="text-3xl font-black text-white uppercase mt-1">Bengali Cinema</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Stream the finest in Bengali cinema: from acclaimed psychological thrillers to nostalgic restored classics in 4K Ultra HD.
              </p>
            </div>
            <MovieRow
              title="Bengali Originals &amp; Premieres"
              movies={bengaliMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
            <MovieRow
              title="Trending Nationwide"
              movies={trendingMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        ) : currentView === 'hindi' ? (
          /* Dedicated Hindi / Bollywood Hub */
          <div className="pt-24 px-4 md:px-12 pb-16">
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <div className="text-xs font-mono text-red-500 uppercase tracking-widest">
                Bollywood &amp; Pan-Indian Cinema
              </div>
              <h1 className="text-3xl font-black text-white uppercase mt-1">Hindi Movies</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                High-octane action blockbusters, crime epics, and mythological spectacles with 5.1 surround sound.
              </p>
            </div>
            <MovieRow
              title="Blockbuster Hindi Movies"
              movies={hindiMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
            <MovieRow
              title="Trending Now"
              movies={trendingMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        ) : currentView === 'english' ? (
          /* Dedicated English / Hollywood Hub */
          <div className="pt-24 px-4 md:px-12 pb-16">
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                Hollywood &amp; Sci-Fi 4K
              </div>
              <h1 className="text-3xl font-black text-white uppercase mt-1">English Movies</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Mind-bending sci-fi, international espionage thrillers, and award-winning Hollywood cinema in 4K HDR.
              </p>
            </div>
            <MovieRow
              title="Hollywood Blockbusters"
              movies={englishMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
            <MovieRow
              title="Trending Now"
              movies={trendingMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        ) : currentView === 'korean' ? (
          /* Dedicated Korean Cinema Hub */
          <div className="pt-24 px-4 md:px-12 pb-16">
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                K-Wave &amp; Seoul Thrillers
              </div>
              <h1 className="text-3xl font-black text-white uppercase mt-1">Korean Dramas &amp; Movies</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Binge-worthy K-Dramas, neon-lit speed thrillers, and legal crime mysteries with multi-language dubbing.
              </p>
            </div>
            <MovieRow
              title="Top Korean Dramas &amp; Cinema"
              movies={koreanMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
            <MovieRow
              title="Popular Web Series"
              movies={webSeries}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
          </div>
        ) : currentView === 'series' ? (
          /* Dedicated Web Series Hub */
          <div className="pt-24 px-4 md:px-12 pb-16">
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Multi-Season Binge
              </div>
              <h1 className="text-3xl font-black text-white uppercase mt-1">Popular Web Series</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Gripping crime sagas, international survival games, and dark syndicates spanning full seasons.
              </p>
            </div>
            <MovieRow
              title="Featured Web Series"
              movies={webSeries}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
            />
            <MovieRow
              title="Top 10 Series Today"
              movies={topTenMovies}
              onSelectMovie={setActiveMovieModal}
              onPlayMovie={handlePlayMovie}
              myListIds={myListIds}
              onToggleMyList={handleToggleMyList}
              isTopTen={true}
            />
          </div>
        ) : (
          /* HOME PAGE: Banner & Horizontal Rows */
          <div>
            {featuredMovie && (
              <HeroBanner
                movie={featuredMovie}
                onPlay={handlePlayMovie}
                onMoreInfo={setActiveMovieModal}
                isMyList={myListIds.has(featuredMovie.id)}
                onToggleMyList={handleToggleMyList}
              />
            )}

            {/* Movie Sections Grid */}
            <div className="-mt-16 sm:-mt-24 md:-mt-32 relative z-20 space-y-2 sm:space-y-4">
              {/* 1. Continue Watching for Active User */}
              {continueWatchingMovies.length > 0 && (
                <MovieRow
                  title={`Continue Watching for ${currentUser.name}`}
                  movies={continueWatchingMovies}
                  onSelectMovie={setActiveMovieModal}
                  onPlayMovie={handlePlayMovie}
                  myListIds={myListIds}
                  onToggleMyList={handleToggleMyList}
                />
              )}

              {/* 2. Trending Now */}
              <MovieRow
                title="Trending Now"
                movies={trendingMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />

              {/* 3. Top 10 in Bangladesh / Worldwide Today */}
              <MovieRow
                title="Top 10 Movies &amp; Series Today"
                movies={topTenMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
                isTopTen={true}
              />

              {/* 4. Popular Movies */}
              <MovieRow
                title="Popular Movies"
                movies={popularMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />

              {/* 5. Bengali Movies */}
              <MovieRow
                title="Bengali Cinema Hits &amp; Classics"
                movies={bengaliMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />

              {/* 6. Hindi Movies */}
              <MovieRow
                title="Hindi Blockbusters &amp; Action"
                movies={hindiMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />

              {/* 7. English Movies */}
              <MovieRow
                title="Hollywood &amp; Sci-Fi 4K"
                movies={englishMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />

              {/* 8. Korean Dramas */}
              <MovieRow
                title="Korean Dramas &amp; Thrillers"
                movies={koreanMovies}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />

              {/* 9. Popular Web Series */}
              <MovieRow
                title="Popular Web Series &amp; Binge Worthy"
                movies={webSeries}
                onSelectMovie={setActiveMovieModal}
                onPlayMovie={handlePlayMovie}
                myListIds={myListIds}
                onToggleMyList={handleToggleMyList}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        myListCount={myListIds.size}
      />

      {/* Movie Details Modal */}
      {activeMovieModal && (
        <MovieDetailsModal
          movie={activeMovieModal}
          onClose={() => setActiveMovieModal(null)}
          onPlay={handlePlayMovie}
          isMyList={myListIds.has(activeMovieModal.id)}
          onToggleMyList={handleToggleMyList}
          relatedMovies={relatedMovies}
          onSelectRelated={(m) => setActiveMovieModal(m)}
          currentUser={currentUser}
          onAddReview={handleAddReview}
        />
      )}

      {/* Watch Page / Video Player */}
      {activeVideoPlayer && (
        <VideoPlayer
          movie={activeVideoPlayer}
          onClose={() => setActiveVideoPlayer(null)}
        />
      )}

      {/* Membership Plans Modal */}
      <MembershipModal
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        currentProfile={currentUser}
        onUpdatePlan={(plan) => {
          if (plan !== 'Free') {
            setCheckoutTargetMovie(null);
            setCheckoutTargetPlan(MEMBERSHIP_PLANS.find((p) => p.id === plan) || MEMBERSHIP_PLANS[2]);
            setCheckoutModalOpen(true);
          } else {
            const updated: UserAccount = {
              ...currentUser,
              membershipPlan: 'Free',
            };
            setCurrentUser(updated);
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          }
        }}
      />

      {/* Test Payment Checkout Modal (Verified Payment Workflow) */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => {
          setCheckoutModalOpen(false);
          setCheckoutTargetMovie(null);
        }}
        targetMovie={checkoutTargetMovie}
        targetPlan={checkoutTargetPlan}
        currentUser={currentUser}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        movies={movies}
        onAddMovie={handleAddMovie}
        onUpdateMovie={handleUpdateMovie}
        onDeleteMovie={handleDeleteMovie}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
