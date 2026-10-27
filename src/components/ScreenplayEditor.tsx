import React, { useState, useMemo } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  AlignLeft,
  User,
  MessageSquare,
  Compass,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  Plus,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { FilmProject, Scene } from '../types/film';
import { extractScenesFromScript, parseScreenplayToLines, calculateScriptStats } from '../utils/screenplayParser';

interface ScreenplayEditorProps {
  project: FilmProject;
  onUpdateScript: (newScript: string, newScenes: Scene[]) => void;
}

export const ScreenplayEditor: React.FC<ScreenplayEditorProps> = ({ project, onUpdateScript }) => {
  const [scriptText, setScriptText] = useState(project.screenplayText);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('raw');
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  // AI Assistant states
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiAction, setAiAction] = useState<'generate_scene' | 'punchup_dialogue' | 'suggest_beats' | 'doctor'>('generate_scene');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse scenes & stats
  const scenes = useMemo(() => extractScenesFromScript(scriptText), [scriptText]);
  const stats = useMemo(() => calculateScriptStats(scriptText), [scriptText]);
  const parsedLines = useMemo(() => parseScreenplayToLines(scriptText), [scriptText]);

  const handleScriptChange = (newText: string) => {
    setScriptText(newText);
    const updatedScenes = extractScenesFromScript(newText);
    onUpdateScript(newText, updatedScenes);
  };

  const insertSnippet = (snippet: string) => {
    const updated = scriptText ? `${scriptText}\n\n${snippet}` : snippet;
    handleScriptChange(updated);
  };

  const handleRunAi = async () => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/gemini/screenplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: aiAction,
          prompt: aiPrompt,
          currentScript: scriptText,
          genre: project.genre,
          tone: project.tone,
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setAiResponse(data.text);
      } else {
        setAiResponse(data.error || 'Failed to generate assistance.');
      }
    } catch {
      setAiResponse('Unable to connect to screenplay AI service.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAppendAiResult = () => {
    if (!aiResponse) return;
    const updated = `${scriptText}\n\n${aiResponse}`;
    handleScriptChange(updated);
    setAiResponse(null);
    setAiDrawerOpen(false);
  };

  const handleCopyAi = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-62px)] bg-[#090a0d] overflow-hidden">
      {/* Left Sidebar: Scene Navigator & Script Health */}
      <aside className="w-72 border-r border-zinc-800/80 bg-zinc-950 flex flex-col shrink-0">
        <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Scene Navigator</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">{scenes.length} scenes</span>
        </div>

        {/* Script Quick Stats Header */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-zinc-900/50 border-b border-zinc-800/60 text-center">
          <div className="p-1.5 bg-zinc-900 rounded">
            <div className="text-[10px] text-zinc-500">Pages</div>
            <div className="text-xs font-bold text-amber-400">{stats.estimatedPages}</div>
          </div>
          <div className="p-1.5 bg-zinc-900 rounded">
            <div className="text-[10px] text-zinc-500">Est. Time</div>
            <div className="text-xs font-bold text-emerald-400">{stats.estimatedRuntimeMinutes}m</div>
          </div>
          <div className="p-1.5 bg-zinc-900 rounded">
            <div className="text-[10px] text-zinc-500">Words</div>
            <div className="text-xs font-bold text-zinc-300">{stats.wordCount}</div>
          </div>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {scenes.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              No scene headings detected yet. Start with <span className="font-mono text-amber-400">INT.</span> or{' '}
              <span className="font-mono text-amber-400">EXT.</span>
            </div>
          ) : (
            scenes.map((scene) => (
              <div
                key={scene.id}
                onClick={() => setActiveSceneId(scene.id)}
                className={`p-2.5 rounded border text-left cursor-pointer transition ${
                  activeSceneId === scene.id
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-amber-400 font-bold">SCENE {scene.sceneNumber}</span>
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {scene.estimatedMinutes}m
                  </span>
                </div>
                <div className="text-xs font-medium text-zinc-200 truncate">{scene.slugline}</div>
                <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{scene.summary}</div>
                {scene.characters.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                    <User className="w-2.5 h-2.5 text-zinc-500" />
                    <span className="truncate">{scene.characters.slice(0, 3).join(', ')}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Scene Button */}
        <div className="p-2 border-t border-zinc-800/80">
          <button
            onClick={() => insertSnippet(`INT. NEW LOCATION - DAY\n\nAction description here...\n\nCHARACTER\nDialogue here.`)}
            className="w-full py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-xs flex items-center justify-center gap-1.5 transition font-medium"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add New Scene Heading</span>
          </button>
        </div>
      </aside>

      {/* Main Screenplay Workspace */}
      <main className="flex-1 flex flex-col bg-[#0b0c10] overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-11 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between gap-3">
          {/* Quick Insert Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-zinc-500 font-medium mr-1 hidden sm:inline">Insert:</span>
            <button
              onClick={() => insertSnippet('INT. LOCATION - NIGHT')}
              className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs font-mono"
            >
              Slugline
            </button>
            <button
              onClick={() => insertSnippet('Action description detailing the physical world and character blocking.')}
              className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs"
            >
              Action
            </button>
            <button
              onClick={() => insertSnippet('CHARACTER NAME\nDialogue line goes here.')}
              className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs"
            >
              Dialogue
            </button>
            <button
              onClick={() => insertSnippet('(whispering)')}
              className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs"
            >
              (Parenthetical)
            </button>
            <button
              onClick={() => insertSnippet('CUT TO:')}
              className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs font-mono"
            >
              Transition
            </button>
          </div>

          {/* Mode Switcher & AI Assistant Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5">
              <button
                onClick={() => setViewMode('raw')}
                className={`px-2 py-1 text-xs rounded transition ${
                  viewMode === 'raw' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('formatted')}
                className={`px-2 py-1 text-xs rounded transition ${
                  viewMode === 'formatted' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Screenplay Page
              </button>
            </div>

            <button
              onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition ${
                aiDrawerOpen
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Script Doctor</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-[#090a0d]">
          {viewMode === 'raw' ? (
            <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800/80 rounded-lg shadow-xl p-4 md:p-6 flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs text-zinc-400">
                <span className="font-mono text-amber-400/90">{project.title.toUpperCase()}</span>
                <span className="text-[11px] text-zinc-500 font-mono">Fountain / Industry Screenplay Format</span>
              </div>
              <textarea
                value={scriptText}
                onChange={(e) => handleScriptChange(e.target.value)}
                placeholder="Start writing screenplay... (e.g. EXT. INDUSTRIAL ROOFTOP - NIGHT)"
                className="w-full flex-1 min-h-[600px] bg-transparent text-zinc-200 font-screenplay text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/30"
                spellCheck={false}
              />
            </div>
          ) : (
            /* Hollywood Screenplay Paper Layout */
            <div className="screenplay-paper w-full max-w-[800px] min-h-[900px] p-12 md:p-16 rounded shadow-2xl space-y-4">
              <div className="text-center font-screenplay text-xs text-zinc-400 mb-8 tracking-widest uppercase">
                {project.title} · Directed by {project.director}
              </div>

              {parsedLines.map((line) => {
                if (line.type === 'slugline') {
                  return (
                    <div key={line.id} className="font-bold text-zinc-900 text-sm tracking-wide pt-4 pb-1">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === 'character') {
                  return (
                    <div key={line.id} className="text-center font-bold text-zinc-900 pt-3 text-xs tracking-wider">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === 'parenthetical') {
                  return (
                    <div key={line.id} className="text-center text-zinc-600 text-xs italic">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === 'dialogue') {
                  return (
                    <div key={line.id} className="mx-auto max-w-[420px] text-zinc-800 text-xs leading-relaxed text-center sm:text-left">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === 'transition') {
                  return (
                    <div key={line.id} className="text-right font-bold text-zinc-900 text-xs py-2">
                      {line.text}
                    </div>
                  );
                }
                // Action
                return (
                  <div key={line.id} className="text-zinc-800 text-xs leading-relaxed max-w-[620px]">
                    {line.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Right Drawer: AI Script Doctor & Co-Writer */}
      {aiDrawerOpen && (
        <aside className="w-80 border-l border-zinc-800/80 bg-zinc-950 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
          <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Screenplay Assistant</span>
            </div>
            <button
              onClick={() => setAiDrawerOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {/* AI Tools Selection */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Select Capability</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'generate_scene', label: 'Write Scene' },
                  { id: 'punchup_dialogue', label: 'Polish Dialogue' },
                  { id: 'suggest_beats', label: 'Scene Beats' },
                  { id: 'doctor', label: 'Script Critique' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setAiAction(act.id as typeof aiAction)}
                    className={`py-1.5 px-2 text-[11px] font-medium rounded border text-center transition ${
                      aiAction === act.id
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                {aiAction === 'generate_scene'
                  ? 'Scene Pitch or Action'
                  : aiAction === 'punchup_dialogue'
                  ? 'Focus Dialogue Line'
                  : aiAction === 'suggest_beats'
                  ? 'Dramatic Goal / Conflict'
                  : 'Specific Questions for Script Doctor'}
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={
                  aiAction === 'generate_scene'
                    ? 'e.g., Kael confronts Maya about the transmitter as sirens echo outside...'
                    : 'Paste dialogue or describe what needs sharpening...'
                }
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 resize-none"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunAi}
              disabled={aiLoading}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-amber-500/10"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Consulting Script Doctor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Assistant</span>
                </>
              )}
            </button>

            {/* Output Display */}
            {aiResponse && (
              <div className="mt-3 p-3 bg-zinc-900/90 border border-zinc-800 rounded space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-1.5">
                  <span className="font-semibold text-amber-400">Generated Output</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopyAi}
                      className="p-1 hover:text-white rounded"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-zinc-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed bg-zinc-950/60 p-2 rounded">
                  {aiResponse}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleAppendAiResult}
                    className="flex-1 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <span>Append to Script</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
