import React from 'react';
import { Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141414] text-zinc-500 text-xs px-4 md:px-12 pt-16 pb-12 border-t border-zinc-900 select-none">
      <div className="max-w-[1720px] mx-auto space-y-6">
        {/* Social / Helpline */}
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="text-sm font-bold text-white">Questions? Call 0800-SIAMFLIX</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400">SSK Films Streaming Network</span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-[11px] leading-relaxed">
          <button className="text-left hover:underline">FAQ &amp; Help Center</button>
          <button className="text-left hover:underline">Investor Relations</button>
          <button className="text-left hover:underline">Ways to Watch</button>
          <button className="text-left hover:underline">Corporate Information</button>

          <button className="text-left hover:underline">Bengali Cinema Originals</button>
          <button className="text-left hover:underline">Hindi &amp; Bollywood Hits</button>
          <button className="text-left hover:underline">Korean Drama Hub</button>
          <button className="text-left hover:underline">Hollywood 4K Exclusives</button>

          <button className="text-left hover:underline">Terms of Use</button>
          <button className="text-left hover:underline">Privacy Policy</button>
          <button className="text-left hover:underline">Cookie Preferences</button>
          <button className="text-left hover:underline">Legal Notices</button>

          <button className="text-left hover:underline">Media Center</button>
          <button className="text-left hover:underline">Jobs &amp; Careers</button>
          <button className="text-left hover:underline">Speed Test</button>
          <button className="text-left hover:underline">Contact Support</button>
        </div>

        {/* Language selector button */}
        <div className="pt-2">
          <button className="flex items-center gap-2 border border-zinc-700 bg-black/40 px-3 py-1.5 rounded text-zinc-300 hover:text-white transition">
            <Globe className="w-3.5 h-3.5" />
            <span>English (Bengali &amp; Hindi Audio Available)</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-[11px] text-zinc-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>© 2026 SiamFlix by SSK Films. All rights reserved. Authorized streaming showcase.</span>
          <span className="flex items-center gap-1 text-zinc-500">
            Engineered for high-bitrate 4K Ultra HD &amp; Dolby Atmos cinema.
          </span>
        </div>
      </div>
    </footer>
  );
};
