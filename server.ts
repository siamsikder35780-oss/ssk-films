import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with server-side API Key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'SSK Film Creator',
    hasGeminiKey: Boolean(apiKey),
  });
});

// Screenplay AI Endpoint
app.post('/api/gemini/screenplay', async (req, res) => {
  try {
    const { action, prompt, currentScript, genre, tone } = req.body;

    if (!ai) {
      // Fallback if no key configured
      return res.json({
        success: true,
        text: getScreenplayFallback(action, prompt, genre),
      });
    }

    let systemInstruction = `You are an award-winning Hollywood screenwriter, script doctor, and cinema director working for SSK Film Creator.
You write in standard Hollywood screenplay format (Scene Headings like INT./EXT., Action blocks, Character names in UPPERCASE, parentheticals, sharp dialogue).
Always deliver compelling, punchy, visually descriptive cinematic storytelling without fluff.`;

    let userPrompt = '';
    if (action === 'generate_scene') {
      userPrompt = `Write a cinematic screenplay scene based on this concept:
Prompt: ${prompt || 'A tense confrontation in the shadows'}
Genre: ${genre || 'Thriller'}
Tone: ${tone || 'Moody & Atmospheric'}

Existing Context (if any):
${currentScript ? currentScript.slice(-500) : 'None'}

Format requirements:
- Proper Slugline (e.g., INT. ABANDONED DOCK - NIGHT)
- Visually evocative action description (max 3 lines per paragraph)
- Dynamic dialogue with subtext and character voice
- 1-2 distinct dramatic beats or reveals`;
    } else if (action === 'punchup_dialogue') {
      userPrompt = `Punch up and sharpen this dialogue for maximum cinematic subtext, distinctive character cadence, and tension:
Script snippet:
${prompt || currentScript}

Genre: ${genre || 'Drama'}
Tone: ${tone || 'Sharp & Gripping'}

Provide:
1. Polished Screenplay version
2. Director's Notes on actor delivery & subtext`;
    } else if (action === 'suggest_beats') {
      userPrompt = `Brainstorm 4 high-stakes cinematic scene beats and unexpected twists for this storyline:
Story/Scene summary:
${prompt || currentScript}

Genre: ${genre || 'Sci-Fi Noir'}

Return 4 punchy numbered beats with high dramatic friction.`;
    } else {
      userPrompt = `As an elite script doctor, evaluate this screenplay excerpt:
${prompt || currentScript}

Provide:
1. Pacing & Momentum critique
2. Character motivation & subtext suggestions
3. Visual action enhancement suggestions`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return res.json({
      success: true,
      text: response.text || 'No response generated.',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Gemini Screenplay Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating screenplay assistance.',
    });
  }
});

// Storyboard & Shot Breakdown AI Endpoint
app.post('/api/gemini/storyboard', async (req, res) => {
  try {
    const { sceneText, style, directorVision } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        shots: getStoryboardFallback(sceneText),
      });
    }

    const systemInstruction = `You are a master Director of Photography (DP) and Visual Storyboard Artist for SSK Film Creator.
Given a scene description, break it down into a sequence of 4 to 6 precise cinematic shots.
Return strictly valid JSON with an array named "shots".
Each shot object must have:
- "shotNumber": string (e.g. "1A", "1B")
- "shotType": string (one of: "Extreme Wide Shot", "Wide Shot", "Medium Shot", "Close-Up", "Extreme Close-Up", "POV", "Dutch Angle", "Over the Shoulder")
- "cameraMovement": string (e.g., "Slow Push-In", "Static", "Smooth Pan Right", "Handheld Tracking", "Low-Angle Tilt")
- "lens": string (e.g., "24mm Anamorphic", "35mm Prime", "50mm T1.5", "85mm Portrait", "100mm Macro")
- "lightingMood": string (e.g., "Chiaroscuro Neon", "Golden Hour Backlit", "Harsh Tungsten Practicals", "Diffused Overcast")
- "visualDescription": string (vivid visual framing & character action, 1-2 sentences)
- "soundCue": string (ambient sound or foley effect)
- "durationSeconds": number (2 to 8)`;

    const userPrompt = `Break this screenplay scene into 4-6 cinematic storyboard shots:
Scene text:
${sceneText || 'INT. NEON CORRIDOR - NIGHT\nKael slips against the wet concrete, gripping a fractured data drive.'}

Director Vision: ${directorVision || 'High contrast, moody noir, claustrophobic framing'}
Visual Style: ${style || 'Cyberpunk Neo-Noir'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{"shots": []}');
    return res.json({
      success: true,
      shots: parsed.shots || parsed,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Gemini Storyboard Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating storyboard breakdown.',
    });
  }
});

// Character Bible AI Endpoint
app.post('/api/gemini/character', async (req, res) => {
  try {
    const { characterConcept, genre, existingCharacters } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        character: getCharacterFallback(characterConcept),
      });
    }

    const systemInstruction = `You are a film casting director and character dramatist for SSK Film Creator.
Create a rich, multi-layered cinematic character profile.
Return strictly valid JSON with properties:
- "name": string
- "role": string ("Protagonist", "Antagonist", "Supporting", or "Ensemble")
- "age": string or number
- "archetype": string (e.g. "The Reluctant Fixer", "The Corrupt Visionary")
- "coreMotivation": string (What do they desperately want?)
- "fatalFlaw": string (Internal psychological barrier)
- "wardrobeLook": string (Iconic silhouette, costume materials, signature prop)
- "voiceCadence": string (Speaking style, pitch, rhythm, vocal habits)
- "keyQuote": string (A defining cinematic line)
- "castingReference": string (Actor prototype inspiration)`;

    const userPrompt = `Create a film character profile:
Concept: ${characterConcept || 'A weary surveillance technician who uncovers a conspiracy'}
Genre: ${genre || 'Neo-Noir Thriller'}
Other characters in world: ${existingCharacters ? JSON.stringify(existingCharacters) : 'None'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      character: parsed,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Gemini Character Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating character.',
    });
  }
});

// Production Breakdown AI Endpoint
app.post('/api/gemini/breakdown', async (req, res) => {
  try {
    const { scriptText } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        breakdown: {
          locations: ['EXT. RAIN-SLICK HIGHWAY', 'INT. OLD FACTORY LOFT'],
          props: ['Encrypted drive', 'Vintage lighter', 'Burner phone'],
          wardrobe: ['Trench coat with reflective collar', 'Steel-toe boots'],
          specialEffects: ['Atmospheric rain machine', 'Sparks on fusebox'],
          stunts: ['Balcony vault', 'Hand-to-hand grapple'],
          soundDesign: ['Distant police sirens', 'Neon ballast hum'],
        },
      });
    }

    const systemInstruction = `You are a 1st Assistant Director (1st AD) and Line Producer for SSK Film Creator.
Analyze the script and extract physical production breakdown categories.
Return strictly valid JSON with properties:
- "locations": array of strings
- "props": array of strings
- "wardrobe": array of strings
- "specialEffects": array of strings
- "stunts": array of strings
- "soundDesign": array of strings`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Extract full production breakdown from this script:\n\n${scriptText}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      breakdown: parsed,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Gemini Breakdown Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating production breakdown.',
    });
  }
});

// Fallback generators when API key is not present
function getScreenplayFallback(action?: string, prompt?: string, genre?: string): string {
  if (action === 'suggest_beats') {
    return `1. THE CIPHER DISCOVERY: Protagonist finds the memory capsule hidden inside the vintage radio tuner.
2. THE SHADOW APPROACHES: Headlights sweep across the blinds; an unmarked black sedan idles outside.
3. THE BETRAYAL AT DAWN: The trusted informant reveals their allegiance was bought hours ago.
4. THE FINAL ROOFTOP CHOICE: Stand between destroying the evidence or leaking it to the world.`;
  }
  return `EXT. ROOFTOP HELIPAD - NIGHT (RAIN)

Rain beats relentlessly against sheets of corrugated iron. Steam rises from industrial ventilation ducts in choking plumes.

KAEL VANCE (30s), trench coat soaked through, stands near the rusted guardrail. In his trembling left hand: the luminescent memory drive.

DR. MAYA LIN (40s) steps out from the access hatch, an umbrella shaking in the gale.

MAYA
(raising voice over the storm)
You can't decode it out here, Kael. The dampening field will corrupt the partition!

Kael doesn't turn around. His thumb hovers over the emergency wipe switch.

KAEL
They were never coming for the data, Maya. They were coming for you.

Maya freezes. The hum of an approaching heavy drone vibrates through the rooftop deck.

CUT TO:`;
}

function getStoryboardFallback(sceneText?: string) {
  return [
    {
      shotNumber: '1A',
      shotType: 'Extreme Wide Shot',
      cameraMovement: 'Slow Crane Downward',
      lens: '24mm Anamorphic',
      lightingMood: 'Cold Rain & Neon Silhouette',
      visualDescription: 'Vast industrial skyline under rolling storm clouds. A tiny lone figure stands perched on the rooftop edge.',
      soundCue: 'Distant low rumble of thunder and rain cascade',
      durationSeconds: 4,
    },
    {
      shotNumber: '1B',
      shotType: 'Medium Shot',
      cameraMovement: 'Slow Tracking Push-In',
      lens: '50mm T1.5 Prime',
      lightingMood: 'Chiaroscuro Practical Backlight',
      visualDescription: 'Kael Vance turns his head, rain dripping off the brim of his coat, illuminating the amber glow of the data drive.',
      soundCue: 'Electrical capacitor whine',
      durationSeconds: 3,
    },
    {
      shotNumber: '1C',
      shotType: 'Close-Up',
      cameraMovement: 'Static with Shallow Depth',
      lens: '85mm Portrait',
      lightingMood: 'Soft Rim Light on Eyes',
      visualDescription: 'Maya’s eyes widen as she spots the flashing indicator light on Kael’s wrist tracker.',
      soundCue: 'Heavy drone rotor blades cutting through the air',
      durationSeconds: 3,
    },
    {
      shotNumber: '1D',
      shotType: 'Low-Angle Dutch Angle',
      cameraMovement: 'Snap Zoom / Whip In',
      lens: '35mm High Contrast',
      lightingMood: 'Searchlight Blinding Sweep',
      visualDescription: 'A colossal spotlight washes over the helipad, casting long distorted shadows across the steel grating.',
      soundCue: 'Deafening searchlight hum and hydraulic flare',
      durationSeconds: 4,
    },
  ];
}

function getCharacterFallback(concept?: string) {
  return {
    name: 'Kael Vance',
    role: 'Protagonist',
    age: '34',
    archetype: 'The Reluctant Fixer',
    coreMotivation: 'Expose the systemic blackout that erased his sister’s research.',
    fatalFlaw: 'Chronic distrust of allies; refuses to let anyone share the burden.',
    wardrobeLook: 'Weathered graphite trench coat with fiber-optic lining, scarred combat boots, antique mechanic watch.',
    voiceCadence: 'Low gravelly baritone, speaks in terse clipped sentences with deliberate pauses.',
    keyQuote: '"In this city, the only thing cheaper than the truth is the silence that buys it."',
    castingReference: 'Oscar Isaac meets Ryan Gosling',
  };
}

// Dev and Prod setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static build
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🎬 SSK Film Creator server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SSK Film Creator server:', err);
});
