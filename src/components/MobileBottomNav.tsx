import React from 'react';
import { Home, Film, Search, Bookmark, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  myListCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  myListCount,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around text-[10px] select-none">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 transition ${
          currentView === 'home' ? 'text-[#E50914] font-bold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('bengali')}
        className={`flex flex-col items-center gap-1 transition ${
          currentView === 'bengali' ? 'text-[#E50914] font-bold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Film className="w-5 h-5" />
        <span>Bengali</span>
      </button>

      <button
        onClick={() => onNavigate('search')}
        className={`flex flex-col items-center gap-1 transition ${
          currentView === 'search' ? 'text-[#E50914] font-bold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      <button
        onClick={() => onNavigate('mylist')}
        className={`flex flex-col items-center gap-1 transition relative ${
          currentView === 'mylist' ? 'text-[#E50914] font-bold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span>My List</span>
        {myListCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E50914] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
            {myListCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center gap-1 transition ${
          currentView === 'profile' ? 'text-[#E50914] font-bold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </div>
  );
};
