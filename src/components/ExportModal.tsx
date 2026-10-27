import React, { useRef, useState } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Film,
  Upload,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FilmProject } from '../types/film';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: FilmProject;
  onImportProject: (imported: FilmProject) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onImportProject,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadFountain = () => {
    const blob = new Blob([project.screenplayText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_screenplay.fountain`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadProjectJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_ssk_production_bible.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.title && parsed.screenplayText) {
          onImportProject(parsed);
          onClose();
        } else {
          alert('Invalid SSK Film Project file.');
        }
      } catch {
        alert('Could not parse JSON project file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-2xl w-full p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Export & Production Package</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Option 1: Fountain Screenplay */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Industry Screenplay (.fountain)</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                Standard Fountain format compatible with Final Draft, Highland 2, and WriterDuet.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleDownloadFountain}
                className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .fountain</span>
              </button>
              <button
                onClick={() => handleCopyText(project.screenplayText, 'screenplay')}
                className="py-1.5 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded flex items-center gap-1"
                title="Copy screenplay text"
              >
                {copiedType === 'screenplay' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Option 2: Print Production Deck */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                <Printer className="w-4 h-4 text-sky-400" />
                <span>Print Production Package</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                Prints high-contrast, clean Hollywood pages, call sheets, and technical shot lists directly to PDF.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded flex items-center justify-center gap-1.5 transition border border-zinc-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF / Paper</span>
            </button>
          </div>

          {/* Option 3: Complete Production Bible JSON */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Full SSK Production Bible</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                Includes script, all camera shots, storyboard sketches, character bible, and call sheets in one backup file.
              </p>
            </div>

            <button
              onClick={handleDownloadProjectJson}
              className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup Project (.json)</span>
            </button>
          </div>

          {/* Option 4: Restore / Import */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import Film Project</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                Restore an existing SSK Film Creator project backup file to resume filmmaking.
              </p>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded flex items-center justify-center gap-1.5 transition border border-zinc-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Load Project Backup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span>SSK Film Creator · Production Studio Siam Sikder</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
