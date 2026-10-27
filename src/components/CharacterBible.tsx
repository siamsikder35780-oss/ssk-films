import React, { useState } from 'react';
import {
  User,
  Users,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Quote,
  Shield,
  Target,
  AlertTriangle,
  Shirt,
  Mic,
  Clapperboard,
  X,
  Loader2,
} from 'lucide-react';
import { Character, FilmProject } from '../types/film';

interface CharacterBibleProps {
  project: FilmProject;
  onUpdateCharacters: (characters: Character[]) => void;
}

export const CharacterBible: React.FC<CharacterBibleProps> = ({ project, onUpdateCharacters }) => {
  const [characters, setCharacters] = useState<Character[]>(project.characters);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(project.characters[0]?.id || '');
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // AI Character Creator state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [characterConcept, setCharacterConcept] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const updateCharactersList = (updated: Character[]) => {
    setCharacters(updated);
    onUpdateCharacters(updated);
  };

  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId) || characters[0];

  const handleAddBlankCharacter = () => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      role: 'Supporting',
      age: '30s',
      archetype: 'The Enigmatic Ally',
      coreMotivation: 'Discover the hidden motive behind the central conspiracy.',
      fatalFlaw: 'Overthinks crucial moments of danger.',
      wardrobeLook: 'Dark tactical coat with high collar, worn leather boots.',
      voiceCadence: 'Calm, measured, analytical cadence.',
      keyQuote: '"Every secret has an expiration date."',
      castingReference: 'Rising talent / Indie character actor',
      avatarColor: '#f59e0b',
    };
    const updated = [...characters, newChar];
    updateCharactersList(updated);
    setSelectedCharacterId(newChar.id);
    setEditingCharacter(newChar);
  };

  const handleDeleteCharacter = (id: string) => {
    const updated = characters.filter((c) => c.id !== id);
    updateCharactersList(updated);
    if (selectedCharacterId === id && updated.length > 0) {
      setSelectedCharacterId(updated[0].id);
    }
  };

  const handleSaveEdit = (char: Character) => {
    const updated = characters.map((c) => (c.id === char.id ? char : c));
    updateCharactersList(updated);
    setEditingCharacter(null);
  };

  // AI Character Generation
  const handleGenerateAiCharacter = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterConcept,
          genre: project.genre,
          existingCharacters: characters.map((c) => ({ name: c.name, role: c.role })),
        }),
      });

      const data = await res.json();
      if (data.success && data.character) {
        const item = data.character;
        const newChar: Character = {
          id: `char-ai-${Date.now()}`,
          name: item.name || 'New Character',
          role: item.role || 'Supporting',
          age: String(item.age || '35'),
          archetype: item.archetype || 'The Wildcard',
          coreMotivation: item.coreMotivation || 'Survival and autonomy',
          fatalFlaw: item.fatalFlaw || 'Inability to forgive past mistakes',
          wardrobeLook: item.wardrobeLook || 'Distinctive cinematic silhouette',
          voiceCadence: item.voiceCadence || 'Distinct vocal rhythm',
          keyQuote: item.keyQuote || 'An unforgettable cinematic one-liner.',
          castingReference: item.castingReference || 'Character prototype actor',
          avatarColor: item.role === 'Protagonist' ? '#0284c7' : item.role === 'Antagonist' ? '#e11d48' : '#10b981',
        };

        const updated = [...characters, newChar];
        updateCharactersList(updated);
        setSelectedCharacterId(newChar.id);
        setAiModalOpen(false);
        setCharacterConcept('');
      } else {
        setAiError(data.error || 'Failed to generate character profile.');
      }
    } catch {
      setAiError('Network error connecting to character generation service.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const getRoleBadgeStyle = (role: Character['role']) => {
    switch (role) {
      case 'Protagonist':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Antagonist':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Supporting':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="flex h-[calc(100vh-62px)] bg-[#090a0d] overflow-hidden">
      {/* Left Character Directory List */}
      <aside className="w-80 border-r border-zinc-800/80 bg-zinc-950 flex flex-col shrink-0">
        <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Character Roster</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">{characters.length} cast</span>
        </div>

        {/* Action Header */}
        <div className="p-2 border-b border-zinc-800/60 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setAiModalOpen(true)}
            className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Develop</span>
          </button>
          <button
            onClick={handleAddBlankCharacter}
            className="py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Cast</span>
          </button>
        </div>

        {/* Character Card List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {characters.map((char) => {
            const isSelected = char.id === selectedCharacterId;
            return (
              <div
                key={char.id}
                onClick={() => setSelectedCharacterId(char.id)}
                className={`p-3 rounded border text-left cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500/60 bg-amber-500/10 shadow-sm'
                    : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: char.avatarColor || '#3f3f46' }}
                  >
                    {char.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-zinc-200 truncate">{char.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{char.archetype}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRoleBadgeStyle(char.role)}`}>
                  {char.role}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Character Bible Detail View */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#090a0d]">
        {selectedCharacter ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Hero Banner */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-lg"
                  style={{ backgroundColor: selectedCharacter.avatarColor || '#f59e0b' }}
                >
                  {selectedCharacter.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {selectedCharacter.name}
                    </h1>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono border ${getRoleBadgeStyle(selectedCharacter.role)}`}>
                      {selectedCharacter.role}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    {selectedCharacter.archetype} · Age: {selectedCharacter.age}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Casting Prototype: <span className="text-zinc-200 font-medium">{selectedCharacter.castingReference}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCharacter(selectedCharacter)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded text-xs flex items-center gap-1.5 transition font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => handleDeleteCharacter(selectedCharacter.id)}
                  className="p-1.5 bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 rounded transition"
                  title="Delete Character"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Signature Quote Banner */}
            {selectedCharacter.keyQuote && (
              <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900/60 to-zinc-950 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider mb-1">
                    Signature Dialogue Line
                  </div>
                  <div className="font-screenplay text-sm text-zinc-200 italic">
                    {selectedCharacter.keyQuote}
                  </div>
                </div>
              </div>
            )}

            {/* Character Psychology Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Motivation */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wide">
                  <Target className="w-4 h-4" />
                  <span>Core Driving Motivation</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedCharacter.coreMotivation}
                </p>
              </div>

              {/* Fatal Flaw */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Fatal Psychological Flaw</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedCharacter.fatalFlaw}
                </p>
              </div>

              {/* Wardrobe & Silhouette */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                  <Shirt className="w-4 h-4" />
                  <span>Wardrobe & Costume Lookbook</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedCharacter.wardrobeLook}
                </p>
              </div>

              {/* Voice & Cadence */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  <Mic className="w-4 h-4" />
                  <span>Voice Cadence & Speech Patterns</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedCharacter.voiceCadence}
                </p>
              </div>
            </div>

            {/* Character Arc / Script Occurrences */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                Scenes Featuring {selectedCharacter.name}
              </h3>
              <div className="space-y-2">
                {project.scenes
                  .filter((sc) => sc.characters.some((c) => c.toLowerCase().includes(selectedCharacter.name.toLowerCase())))
                  .map((sc) => (
                    <div
                      key={sc.id}
                      className="p-3 bg-zinc-900/60 border border-zinc-800/70 rounded flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">SC {sc.sceneNumber}</span>
                        <span className="text-zinc-200 font-medium">{sc.slugline}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">{sc.timeOfDay}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 text-zinc-500 text-xs">
            No character selected. Add a character or use AI to develop one.
          </div>
        )}
      </main>

      {/* Edit Character Modal */}
      {editingCharacter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit Character Profile</span>
              </h3>
              <button onClick={() => setEditingCharacter(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Character Name</label>
                <input
                  type="text"
                  value={editingCharacter.name}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Role</label>
                <select
                  value={editingCharacter.role}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, role: e.target.value as Character['role'] })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                >
                  <option value="Protagonist">Protagonist</option>
                  <option value="Antagonist">Antagonist</option>
                  <option value="Supporting">Supporting</option>
                  <option value="Cameo">Cameo</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Age / Demographics</label>
                <input
                  type="text"
                  value={editingCharacter.age}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, age: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Archetype</label>
                <input
                  type="text"
                  value={editingCharacter.archetype}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, archetype: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Core Motivation (Desire)</label>
                <textarea
                  value={editingCharacter.coreMotivation}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, coreMotivation: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Fatal Flaw (Inner Conflict)</label>
                <textarea
                  value={editingCharacter.fatalFlaw}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, fatalFlaw: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Wardrobe & Lookbook Description</label>
                <textarea
                  value={editingCharacter.wardrobeLook}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, wardrobeLook: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Voice Cadence & Speech Patterns</label>
                <input
                  type="text"
                  value={editingCharacter.voiceCadence}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, voiceCadence: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Signature Quote</label>
                <input
                  type="text"
                  value={editingCharacter.keyQuote}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, keyQuote: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Casting Prototype Actor</label>
                <input
                  type="text"
                  value={editingCharacter.castingReference}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, castingReference: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setEditingCharacter(null)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingCharacter)}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded text-xs"
              >
                Save Character
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Character Generator Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Character Dramatist</span>
              </h3>
              <button onClick={() => setAiModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-zinc-300 block mb-1 font-medium">
                Describe the Character Concept or Role
              </label>
              <textarea
                value={characterConcept}
                onChange={(e) => setCharacterConcept(e.target.value)}
                placeholder="e.g. A disgraced ex-intelligence operative who runs an illegal underground radio clinic in the rain district..."
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {aiError && (
              <div className="text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-800/50">
                {aiError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAiModalOpen(false)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiCharacter}
                disabled={isAiLoading || !characterConcept.trim()}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Developing Character...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Character</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
