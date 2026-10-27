import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Edit3,
  Clock,
  Volume2,
  MessageSquare,
  Eye,
  Sliders,
  Paintbrush,
  Image as ImageIcon,
  Check,
  ChevronDown,
  X,
  Upload,
  Undo2,
} from 'lucide-react';
import { CameraMovement, FilmProject, Shot, ShotType } from '../types/film';

interface StoryboardStudioProps {
  project: FilmProject;
  onUpdateShots: (shots: Shot[]) => void;
}

export const StoryboardStudio: React.FC<StoryboardStudioProps> = ({ project, onUpdateShots }) => {
  const [shots, setShots] = useState<Shot[]>(project.shots);
  const [selectedShotId, setSelectedShotId] = useState<string>(project.shots[0]?.id || '');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingShot, setEditingShot] = useState<Shot | null>(null);

  // AI Shot Generation states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [selectedSceneForAi, setSelectedSceneForAi] = useState(project.scenes[0]?.id || '');
  const [aiError, setAiError] = useState<string | null>(null);

  // Canvas Sketching states
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [sketchingShotId, setSketchingShotId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [penColor, setPenColor] = useState('#f59e0b');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    setShots(project.shots);
    if (!selectedShotId && project.shots.length > 0) {
      setSelectedShotId(project.shots[0].id);
    }
  }, [project.shots]);

  const updateShotsList = (updated: Shot[]) => {
    setShots(updated);
    onUpdateShots(updated);
  };

  const handleAddShot = () => {
    const nextNumber = `${shots.length + 1}A`;
    const newShot: Shot = {
      id: `shot-${Date.now()}`,
      shotNumber: nextNumber,
      shotType: 'Medium Shot',
      cameraMovement: 'Static',
      lens: '50mm Prime',
      lightingMood: 'High Contrast Practicals',
      visualDescription: 'New visual camera setup framing the central action.',
      durationSeconds: 3.5,
      sceneId: project.scenes[0]?.id || 'scene-1',
      soundCue: 'Ambient environment tone',
    };
    const updated = [...shots, newShot];
    updateShotsList(updated);
    setSelectedShotId(newShot.id);
  };

  const handleDeleteShot = (id: string) => {
    const updated = shots.filter((s) => s.id !== id);
    updateShotsList(updated);
    if (selectedShotId === id && updated.length > 0) {
      setSelectedShotId(updated[0].id);
    }
  };

  const handleMoveShot = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === shots.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const clone = [...shots];
    const temp = clone[index];
    clone[index] = clone[targetIndex];
    clone[targetIndex] = temp;
    updateShotsList(clone);
  };

  const handleSaveEdit = (updatedShot: Shot) => {
    const updated = shots.map((s) => (s.id === updatedShot.id ? updatedShot : s));
    updateShotsList(updated);
    setEditingShot(null);
  };

  // Generate shots from scene with AI
  const handleGenerateAiShots = async () => {
    setIsAiGenerating(true);
    setAiError(null);
    try {
      const scene = project.scenes.find((s) => s.id === selectedSceneForAi) || project.scenes[0];
      const sceneText = scene ? `${scene.slugline}\n${scene.content}` : project.screenplayText.slice(0, 500);

      const res = await fetch('/api/gemini/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneText,
          style: project.genre,
          directorVision: project.tone,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.shots)) {
        const generatedShots: Shot[] = data.shots.map((item: Partial<Shot>, idx: number) => ({
          id: `shot-ai-${Date.now()}-${idx}`,
          shotNumber: item.shotNumber || `${idx + 1}A`,
          shotType: (item.shotType as ShotType) || 'Medium Shot',
          cameraMovement: (item.cameraMovement as CameraMovement) || 'Static',
          lens: item.lens || '50mm Prime',
          lightingMood: item.lightingMood || 'Moody Chiaroscuro',
          visualDescription: item.visualDescription || 'Dramatic cinematic composition.',
          soundCue: item.soundCue || 'Atmospheric city drone',
          durationSeconds: item.durationSeconds || 3.5,
          sceneId: scene?.id || 'scene-1',
        }));

        const combined = [...shots, ...generatedShots];
        updateShotsList(combined);
      } else {
        setAiError(data.error || 'Could not parse generated shots.');
      }
    } catch {
      setAiError('Failed to contact storyboard AI generator.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Canvas drawing functions
  const openCanvasSketcher = (shotId: string) => {
    setSketchingShotId(shotId);
    setIsCanvasOpen(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#12141a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Find existing image if any
          const target = shots.find((s) => s.id === shotId);
          if (target?.imageUrl) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = target.imageUrl;
          } else {
            // Draw cinematic framing guidelines
            ctx.strokeStyle = '#272a34';
            ctx.lineWidth = 1;
            // Rule of thirds lines
            ctx.beginPath();
            ctx.moveTo(canvas.width / 3, 0);
            ctx.lineTo(canvas.width / 3, canvas.height);
            ctx.moveTo((canvas.width * 2) / 3, 0);
            ctx.lineTo((canvas.width * 2) / 3, canvas.height);
            ctx.moveTo(0, canvas.height / 3);
            ctx.lineTo(canvas.width, canvas.height / 3);
            ctx.moveTo(0, (canvas.height * 2) / 3);
            ctx.lineTo(canvas.width, (canvas.height * 2) / 3);
            ctx.stroke();
          }
        }
      }
    }, 100);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history
    setCanvasHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleUndoCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvasHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prev = canvasHistory[canvasHistory.length - 1];
    ctx.putImageData(prev, 0, 0);
    setCanvasHistory((h) => h.slice(0, -1));
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !sketchingShotId) return;
    const dataUrl = canvas.toDataURL('image/png');

    const updated = shots.map((s) => (s.id === sketchingShotId ? { ...s, imageUrl: dataUrl } : s));
    updateShotsList(updated);
    setIsCanvasOpen(false);
    setSketchingShotId(null);
  };

  // Visual frame placeholder SVG / CSS styling for shots without custom sketch
  const renderShotThumbnail = (shot: Shot) => {
    if (shot.imageUrl) {
      return (
        <img
          src={shot.imageUrl}
          alt={`Shot ${shot.shotNumber}`}
          className="w-full h-full object-cover"
        />
      );
    }

    // Dynamic stylized cinematography thumbnail
    return (
      <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex flex-col items-center justify-center p-3 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Cinematic framing box */}
        <div className="border border-zinc-700/60 rounded w-4/5 h-3/5 flex flex-col items-center justify-center relative p-2">
          {/* Aspect Crosshairs */}
          <div className="absolute top-1 left-1 text-[8px] font-mono text-zinc-600">[{project.aspectRatio}]</div>
          <div className="text-zinc-500 font-mono text-[10px] text-center font-bold tracking-wider">
            {shot.shotType.toUpperCase()}
          </div>
          <div className="text-amber-400 font-mono text-[9px] text-center mt-1">
            {shot.lens} · {shot.cameraMovement}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            openCanvasSketcher(shot.id);
          }}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs text-amber-400 font-medium transition"
        >
          <Paintbrush className="w-4 h-4" />
          <span>Sketch Frame</span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-62px)] bg-[#090a0d] overflow-hidden">
      {/* Top Studio Controls */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-zinc-200 tracking-wide uppercase">Director’s Shot List</h2>
            <span className="text-[11px] text-zinc-500 font-mono">({shots.length} camera setups)</span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

          {/* View Toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                viewMode === 'cards' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Storyboard Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                viewMode === 'table' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Technical Shot Table
            </button>
          </div>
        </div>

        {/* Right: AI Generate Shots & Add Shot */}
        <div className="flex items-center gap-2">
          {/* AI Shot Generator from Scene */}
          <div className="hidden md:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded px-2 py-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-zinc-400 font-medium">Break Down:</span>
            <select
              value={selectedSceneForAi}
              onChange={(e) => setSelectedSceneForAi(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {project.scenes.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-zinc-900 text-zinc-200">
                  SC {sc.sceneNumber}: {sc.slugline}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateAiShots}
              disabled={isAiGenerating}
              className="ml-1 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded text-xs font-semibold transition disabled:opacity-50"
            >
              {isAiGenerating ? 'Generating...' : 'Generate Shots'}
            </button>
          </div>

          <button
            onClick={handleAddShot}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shot</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#090a0d]">
        {shots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
            <Camera className="w-12 h-12 text-zinc-600 mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-zinc-300">No Storyboard Shots Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Add your first camera setup manually, or use the AI generator to break down your screenplay into cinematic shots.
            </p>
            <button
              onClick={handleAddShot}
              className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold rounded text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Shot</span>
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {shots.map((shot, idx) => {
              const isSelected = shot.id === selectedShotId;
              return (
                <div
                  key={shot.id}
                  onClick={() => setSelectedShotId(shot.id)}
                  className={`bg-zinc-950 border rounded-lg overflow-hidden flex flex-col transition group ${
                    isSelected
                      ? 'border-amber-500/70 shadow-lg shadow-amber-500/10'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Visual Storyboard Frame */}
                  <div className="w-full aspect-[16/9] relative border-b border-zinc-800/80">
                    {renderShotThumbnail(shot)}
                    {/* Top badging */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-zinc-700 text-amber-400 font-mono text-[11px] font-bold rounded">
                        SHOT {shot.shotNumber}
                      </span>
                      <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[10px] text-zinc-300 font-mono rounded">
                        {shot.durationSeconds}s
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCanvasSketcher(shot.id);
                        }}
                        title="Draw blocking sketch"
                        className="p-1 bg-black/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                      >
                        <Paintbrush className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingShot(shot);
                        }}
                        title="Edit shot details"
                        className="p-1 bg-black/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Shot Specs & Description */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      {/* Shot Type & Lens */}
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                        <span>{shot.shotType}</span>
                        <span className="text-[11px] font-mono text-amber-400">{shot.lens}</span>
                      </div>

                      {/* Camera movement & Lighting */}
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span>{shot.cameraMovement}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="truncate">{shot.lightingMood}</span>
                      </div>

                      {/* Visual Description */}
                      <p className="text-xs text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
                        {shot.visualDescription}
                      </p>
                    </div>

                    {/* Dialogue or Sound Cue footer */}
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                      {shot.soundCue ? (
                        <div className="flex items-center gap-1 text-zinc-400 truncate max-w-[170px]">
                          <Volume2 className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span className="truncate">{shot.soundCue}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">No sound cue</span>
                      )}

                      {/* Card Reordering */}
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveShot(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveShot(idx, 'down');
                          }}
                          disabled={idx === shots.length - 1}
                          className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShot(shot.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Technical Shot List Table */
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg overflow-x-auto shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/70 text-zinc-400 font-mono">
                  <th className="py-2.5 px-3">Shot #</th>
                  <th className="py-2.5 px-3">Thumbnail</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Movement</th>
                  <th className="py-2.5 px-3">Lens</th>
                  <th className="py-2.5 px-3">Lighting Mood</th>
                  <th className="py-2.5 px-3">Visual Framing / Action</th>
                  <th className="py-2.5 px-3">Sound Cue</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {shots.map((shot, idx) => (
                  <tr key={shot.id} className="hover:bg-zinc-900/40 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{shot.shotNumber}</td>
                    <td className="py-2.5 px-3">
                      <div className="w-16 h-10 rounded border border-zinc-800 overflow-hidden bg-zinc-900">
                        {renderShotThumbnail(shot)}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-zinc-200">{shot.shotType}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{shot.cameraMovement}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-400/90">{shot.lens}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{shot.lightingMood}</td>
                    <td className="py-2.5 px-3 text-zinc-300 max-w-xs">{shot.visualDescription}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{shot.soundCue || '—'}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{shot.durationSeconds}s</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingShot(shot)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteShot(shot.id)}
                          className="p-1 text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Shot Modal */}
      {editingShot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit Shot {editingShot.shotNumber}</span>
              </h3>
              <button onClick={() => setEditingShot(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Shot Number</label>
                <input
                  type="text"
                  value={editingShot.shotNumber}
                  onChange={(e) => setEditingShot({ ...editingShot, shotNumber: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingShot.durationSeconds}
                  onChange={(e) => setEditingShot({ ...editingShot, durationSeconds: parseFloat(e.target.value) || 3 })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Shot Framing Type</label>
                <select
                  value={editingShot.shotType}
                  onChange={(e) => setEditingShot({ ...editingShot, shotType: e.target.value as ShotType })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                >
                  {[
                    'Extreme Wide Shot',
                    'Wide Shot',
                    'Full Shot',
                    'Medium Shot',
                    'Medium Close-Up',
                    'Close-Up',
                    'Extreme Close-Up',
                    'POV',
                    'Over the Shoulder',
                    'Dutch Angle',
                    'Low Angle',
                    'Bird\'s Eye View',
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Camera Movement</label>
                <select
                  value={editingShot.cameraMovement}
                  onChange={(e) => setEditingShot({ ...editingShot, cameraMovement: e.target.value as CameraMovement })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                >
                  {[
                    'Static',
                    'Pan Right',
                    'Pan Left',
                    'Tilt Up',
                    'Tilt Down',
                    'Dolly In / Push',
                    'Dolly Out / Pull',
                    'Tracking Shot',
                    'Crane / Jib',
                    'Handheld Shaky',
                    'Whip Pan',
                    'Steadicam Glide',
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Lens Selection</label>
                <input
                  type="text"
                  value={editingShot.lens}
                  onChange={(e) => setEditingShot({ ...editingShot, lens: e.target.value })}
                  placeholder="e.g., 24mm Anamorphic, 50mm Prime"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Lighting Setup</label>
                <input
                  type="text"
                  value={editingShot.lightingMood}
                  onChange={(e) => setEditingShot({ ...editingShot, lightingMood: e.target.value })}
                  placeholder="e.g., Cold Rain Practical, Chiaroscuro"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Visual Description & Blocking</label>
              <textarea
                value={editingShot.visualDescription}
                onChange={(e) => setEditingShot({ ...editingShot, visualDescription: e.target.value })}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Dialogue Line (For synchronized playback)</label>
              <input
                type="text"
                value={editingShot.dialogue || ''}
                onChange={(e) => setEditingShot({ ...editingShot, dialogue: e.target.value })}
                placeholder="e.g. KAEL: Who paid off your transit pass, Maya?"
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Foley / Sound Cue</label>
              <input
                type="text"
                value={editingShot.soundCue || ''}
                onChange={(e) => setEditingShot({ ...editingShot, soundCue: e.target.value })}
                placeholder="e.g. Drone rotor thump, rain cascade"
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setEditingShot(null)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingShot)}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-xs font-bold"
              >
                Save Shot Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Storyboard Drawing / Canvas Sketcher Modal */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-2xl w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Director's Storyboard Sketchpad</h3>
                <span className="text-[10px] text-zinc-500 font-mono">Draw camera blocking & actor staging</span>
              </div>
              <button onClick={() => setIsCanvasOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawing Tools Toolbar */}
            <div className="flex items-center justify-between gap-2 p-2 bg-zinc-900/80 rounded border border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400">Color:</span>
                {['#f59e0b', '#38bdf8', '#ef4444', '#10b981', '#ffffff', '#64748b'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-full border ${penColor === color ? 'border-white scale-110 ring-2 ring-amber-500/50' : 'border-zinc-800'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400">Brush:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-16 accent-amber-500"
                  />
                </div>

                <button
                  onClick={handleUndoCanvas}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1"
                  title="Undo stroke"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Undo</span>
                </button>
              </div>
            </div>

            {/* Canvas Surface */}
            <div className="flex justify-center bg-[#090a0d] p-2 rounded border border-zinc-800/80 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={560}
                height={315}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className="rounded cursor-crosshair border border-zinc-800 shadow-inner max-w-full"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">
                Tip: Sketch arrows for camera pan/track, circles for actor blocking.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCanvasOpen(false)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCanvas}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded text-xs"
                >
                  Save Sketch to Shot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
