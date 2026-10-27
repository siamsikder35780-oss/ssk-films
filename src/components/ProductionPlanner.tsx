import React, { useState } from 'react';
import {
  ClipboardList,
  MapPin,
  Package,
  Shirt,
  Flame,
  ShieldAlert,
  Volume2,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Phone,
  AlertCircle,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { CallSheet, FilmProject, ProductionBreakdown } from '../types/film';

interface ProductionPlannerProps {
  project: FilmProject;
  onUpdateProduction: (production: ProductionBreakdown, callSheet: CallSheet) => void;
}

export const ProductionPlanner: React.FC<ProductionPlannerProps> = ({ project, onUpdateProduction }) => {
  const [activeTab, setActiveTab] = useState<'callsheet' | 'breakdown'>('callsheet');
  const [callSheet, setCallSheet] = useState<CallSheet>(project.callSheet);
  const [production, setProduction] = useState<ProductionBreakdown>(project.production);

  const [isAiScanning, setIsAiScanning] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof ProductionBreakdown>('props');

  const updateAll = (prod: ProductionBreakdown, cs: CallSheet) => {
    setProduction(prod);
    setCallSheet(cs);
    onUpdateProduction(prod, cs);
  };

  const handleCallSheetChange = (field: keyof CallSheet, value: string | number) => {
    const updated = { ...callSheet, [field]: value };
    updateAll(production, updated);
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const updatedCategory = [...production[selectedCategory], newItemText.trim()];
    const updated = { ...production, [selectedCategory]: updatedCategory };
    updateAll(updated, callSheet);
    setNewItemText('');
  };

  const handleDeleteItem = (cat: keyof ProductionBreakdown, index: number) => {
    const updatedCategory = production[cat].filter((_, i) => i !== index);
    const updated = { ...production, [cat]: updatedCategory };
    updateAll(updated, callSheet);
  };

  const handleAiScanScript = async () => {
    setIsAiScanning(true);
    try {
      const res = await fetch('/api/gemini/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptText: project.screenplayText }),
      });
      const data = await res.json();
      if (data.success && data.breakdown) {
        const b = data.breakdown;
        const merged: ProductionBreakdown = {
          locations: Array.from(new Set([...production.locations, ...(b.locations || [])])),
          props: Array.from(new Set([...production.props, ...(b.props || [])])),
          wardrobe: Array.from(new Set([...production.wardrobe, ...(b.wardrobe || [])])),
          specialEffects: Array.from(new Set([...production.specialEffects, ...(b.specialEffects || [])])),
          stunts: Array.from(new Set([...production.stunts, ...(b.stunts || [])])),
          soundDesign: Array.from(new Set([...production.soundDesign, ...(b.soundDesign || [])])),
        };
        updateAll(merged, callSheet);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiScanning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-62px)] bg-[#090a0d] overflow-hidden">
      {/* Top Planner Nav */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between gap-3 shrink-0 no-print">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-zinc-200 tracking-wide uppercase">Production Logistics</h2>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Sub-tabs */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5">
            <button
              onClick={() => setActiveTab('callsheet')}
              className={`px-3 py-1 text-xs rounded transition ${
                activeTab === 'callsheet' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Daily Call Sheet #1
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1 text-xs rounded transition ${
                activeTab === 'breakdown' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Script Breakdown Sheets
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'breakdown' && (
            <button
              onClick={handleAiScanScript}
              disabled={isAiScanning}
              className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 rounded text-xs font-semibold transition"
            >
              {isAiScanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Script...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Script Scan</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-xs font-bold transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#090a0d] flex justify-center">
        {activeTab === 'callsheet' ? (
          /* Official Call Sheet Layout */
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-lg p-6 md:p-8 shadow-2xl space-y-6 text-zinc-200">
            {/* Call Sheet Header */}
            <div className="border-b-2 border-amber-500/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
                  {project.productionCompany}
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-0.5">
                  OFFICIAL CALL SHEET
                </h1>
                <p className="text-xs text-zinc-400 font-mono">
                  PRODUCTION: <span className="text-zinc-100 font-bold">{project.title.toUpperCase()}</span> · DIRECTOR: {project.director}
                </p>
              </div>

              <div className="text-right font-mono bg-zinc-900 p-3 rounded border border-zinc-800">
                <div className="text-xs text-amber-400 font-bold">
                  DAY {callSheet.shootDay} OF {callSheet.totalDays}
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  DATE: {callSheet.date}
                </div>
              </div>
            </div>

            {/* Call Times Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 font-mono">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">Crew Call Time</div>
                <input
                  type="time"
                  value={callSheet.crewCallTime}
                  onChange={(e) => handleCallSheetChange('crewCallTime', e.target.value)}
                  className="bg-transparent text-amber-400 font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 uppercase">First Shot Call</div>
                <input
                  type="time"
                  value={callSheet.shootingCallTime}
                  onChange={(e) => handleCallSheetChange('shootingCallTime', e.target.value)}
                  className="bg-transparent text-emerald-400 font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 uppercase">Estimated Wrap</div>
                <div className="text-zinc-300 font-bold text-sm">22:30 (12h)</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 uppercase">Lunch / Meal Call</div>
                <div className="text-zinc-300 font-bold text-sm">13:30 (1h)</div>
              </div>
            </div>

            {/* Location & Hospital Emergency Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Location */}
              <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Shooting Location</span>
                </div>
                <input
                  type="text"
                  value={callSheet.locationName}
                  onChange={(e) => handleCallSheetChange('locationName', e.target.value)}
                  placeholder="Location Name"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 font-medium"
                />
                <input
                  type="text"
                  value={callSheet.locationAddress}
                  onChange={(e) => handleCallSheetChange('locationAddress', e.target.value)}
                  placeholder="Physical Address & GPS"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-300 text-[11px]"
                />
                <textarea
                  value={callSheet.parkingNotes}
                  onChange={(e) => handleCallSheetChange('parkingNotes', e.target.value)}
                  placeholder="Parking & basecamp notes"
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-400 text-[11px]"
                />
              </div>

              {/* Safety & Nearest Hospital */}
              <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-400 uppercase text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Nearest Hospital & Emergency Contact</span>
                </div>
                <input
                  type="text"
                  value={callSheet.nearestHospital}
                  onChange={(e) => handleCallSheetChange('nearestHospital', e.target.value)}
                  placeholder="Nearest Emergency Room & Phone"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200"
                />
                <textarea
                  value={callSheet.weatherNotes}
                  onChange={(e) => handleCallSheetChange('weatherNotes', e.target.value)}
                  placeholder="Weather conditions & environmental hazard precautions"
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-300 text-[11px]"
                />
              </div>
            </div>

            {/* Scenes to Shoot Today */}
            <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Scenes Scheduled For Today
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Total est. pages: 3.2
                </span>
              </div>

              <input
                type="text"
                value={callSheet.scenesToShoot}
                onChange={(e) => handleCallSheetChange('scenesToShoot', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 font-mono"
              />

              <div className="space-y-1.5">
                {project.scenes.slice(0, 3).map((sc) => (
                  <div
                    key={sc.id}
                    className="p-2 bg-zinc-900 rounded border border-zinc-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">SC {sc.sceneNumber}</span>
                      <span className="text-zinc-200">{sc.slugline}</span>
                    </div>
                    <span className="text-zinc-500">{sc.estimatedMinutes} mins · {sc.characters.length} cast</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions Footer */}
            <div className="p-4 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
              <div className="text-[11px] font-bold text-zinc-400 uppercase">
                Special Production & Safety Instructions
              </div>
              <textarea
                value={callSheet.specialInstructions}
                onChange={(e) => handleCallSheetChange('specialInstructions', e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300"
              />
            </div>
          </div>
        ) : (
          /* Script Breakdown Sheets */
          <div className="w-full max-w-5xl space-y-6">
            {/* Quick Add Bar */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as keyof ProductionBreakdown)}
                className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="locations">Locations</option>
                <option value="props">Props</option>
                <option value="wardrobe">Wardrobe & Costumes</option>
                <option value="specialEffects">Special Effects</option>
                <option value="stunts">Stunts</option>
                <option value="soundDesign">Sound Design</option>
              </select>

              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add element (e.g., Antique analog tape recorder)..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                className="flex-1 w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
              />

              <button
                onClick={handleAddItem}
                className="w-full sm:w-auto px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded text-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Grid of Breakdown Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'locations' as const, label: 'Locations & Sets', icon: MapPin, color: 'text-sky-400' },
                { key: 'props' as const, label: 'Props & Set Dressing', icon: Package, color: 'text-amber-400' },
                { key: 'wardrobe' as const, label: 'Costumes & Wardrobe', icon: Shirt, color: 'text-emerald-400' },
                { key: 'specialEffects' as const, label: 'Special Effects (SFX)', icon: Flame, color: 'text-orange-400' },
                { key: 'stunts' as const, label: 'Stunts & Precision Action', icon: ShieldAlert, color: 'text-rose-400' },
                { key: 'soundDesign' as const, label: 'Foley & Sound Elements', icon: Volume2, color: 'text-purple-400' },
              ].map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span>{label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {production[key].length}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3 max-h-56 overflow-y-auto">
                      {production[key].length === 0 ? (
                        <div className="text-[11px] text-zinc-600 py-2">No items listed.</div>
                      ) : (
                        production[key].map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-zinc-900/60 rounded border border-zinc-800/80 flex items-center justify-between text-xs group"
                          >
                            <span className="text-zinc-300 truncate">{item}</span>
                            <button
                              onClick={() => handleDeleteItem(key, idx)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
