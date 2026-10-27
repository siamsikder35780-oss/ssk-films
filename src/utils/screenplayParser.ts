import { Scene, ScreenplayLine } from '../types/film';

const SLUGLINE_REGEX = /^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.)\s+([A-Z0-9\s\-',/]+?)(?:\s*-\s*(DAY|NIGHT|DUSK|DAWN|CONTINUOUS|LATER))?$/i;
const TRANSITION_REGEX = /^(CUT TO:|FADE OUT\.|FADE IN:|SMASH CUT TO:|DISSOLVE TO:|MATCH CUT TO:|BACK TO:)$/i;
const CHARACTER_REGEX = /^[A-Z0-9\s'.-]+(?:\s*\([A-Z\s.]+\))?$/;
const PARENTHETICAL_REGEX = /^\(.*\)$/;

export function parseScreenplayToLines(text: string): ScreenplayLine[] {
  const rawLines = text.split('\n');
  const parsedLines: ScreenplayLine[] = [];
  let prevType: ScreenplayLine['type'] | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i].trim();
    if (!raw) continue;

    let lineType: ScreenplayLine['type'] = 'action';

    if (SLUGLINE_REGEX.test(raw)) {
      lineType = 'slugline';
    } else if (TRANSITION_REGEX.test(raw)) {
      lineType = 'transition';
    } else if (PARENTHETICAL_REGEX.test(raw)) {
      lineType = 'parenthetical';
    } else if (
      CHARACTER_REGEX.test(raw) &&
      raw === raw.toUpperCase() &&
      raw.length < 35 &&
      !raw.endsWith('.') &&
      prevType !== 'character'
    ) {
      lineType = 'character';
    } else if (prevType === 'character' || prevType === 'parenthetical') {
      lineType = 'dialogue';
    } else {
      lineType = 'action';
    }

    parsedLines.push({
      id: `line-${i}-${Math.random().toString(36).substring(2, 7)}`,
      type: lineType,
      text: raw,
    });

    prevType = lineType;
  }

  return parsedLines;
}

export function extractScenesFromScript(text: string): Scene[] {
  const lines = text.split('\n');
  const scenes: Scene[] = [];

  let currentSlugline = '';
  let currentLines: string[] = [];
  let sceneIndex = 1;

  const commitScene = () => {
    if (!currentSlugline && currentLines.length === 0) return;

    const slug = currentSlugline || 'SCENE 1 - UNTITLED';
    const match = slug.match(SLUGLINE_REGEX);

    const setting: Scene['setting'] = slug.startsWith('EXT.') ? 'EXT.' : slug.startsWith('INT./EXT.') ? 'INT./EXT.' : 'INT.';
    const timeOfDay: Scene['timeOfDay'] = slug.includes('NIGHT')
      ? 'NIGHT'
      : slug.includes('DUSK')
      ? 'DUSK'
      : slug.includes('DAWN')
      ? 'DAWN'
      : slug.includes('CONTINUOUS')
      ? 'CONTINUOUS'
      : 'DAY';

    const location = match ? match[2]?.trim() || 'LOCATION' : slug.replace(/^(INT\.|EXT\.|INT\.\/EXT\.)\s*/i, '');

    // Extract character names from scene
    const charsInScene = new Set<string>();
    currentLines.forEach((l) => {
      const trimmed = l.trim();
      if (
        trimmed === trimmed.toUpperCase() &&
        trimmed.length > 1 &&
        trimmed.length < 25 &&
        !trimmed.startsWith('INT.') &&
        !trimmed.startsWith('EXT.') &&
        !TRANSITION_REGEX.test(trimmed)
      ) {
        const cleanName = trimmed.replace(/\s*\([A-Z\s.]+\)$/, '');
        if (cleanName.length > 1) {
          charsInScene.add(cleanName);
        }
      }
    });

    const content = currentLines.join('\n');
    const estimatedMinutes = Math.max(0.5, Math.round((currentLines.length / 50) * 10) / 10);

    scenes.push({
      id: `scene-${sceneIndex}`,
      sceneNumber: sceneIndex,
      slugline: slug,
      location,
      timeOfDay,
      setting,
      content,
      summary: currentLines.find((l) => l.trim().length > 20)?.trim().slice(0, 120) || 'Dramatic sequence.',
      characters: Array.from(charsInScene),
      estimatedMinutes,
    });

    sceneIndex++;
    currentLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (SLUGLINE_REGEX.test(trimmed)) {
      if (currentSlugline || currentLines.length > 0) {
        commitScene();
      }
      currentSlugline = trimmed;
    } else {
      currentLines.push(line);
    }
  }

  // Commit last scene
  if (currentSlugline || currentLines.length > 0) {
    commitScene();
  }

  return scenes;
}

export function calculateScriptStats(text: string) {
  const scenes = extractScenesFromScript(text);
  const totalLines = text.split('\n').filter((l) => l.trim()).length;
  const estimatedPages = Math.max(1, Math.round((totalLines / 54) * 10) / 10);
  const estimatedRuntimeMinutes = Math.max(1, Math.round(estimatedPages * 1.1));

  // Word count
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return {
    scenesCount: scenes.length,
    estimatedPages,
    estimatedRuntimeMinutes,
    totalLines,
    wordCount: words,
  };
}
