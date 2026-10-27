import { FilmProject } from '../types/film';

export const SAMPLE_PROJECTS: FilmProject[] = [
  {
    id: 'project-ssk-neon-protocol',
    title: 'The Neon Protocol',
    logline: 'In a rain-drenched megacity, a blacklisted cipher technician discovers that the corporate memory wipe erasing citizens also holds the key to his sister’s disappearance.',
    genre: 'Cyberpunk Neo-Noir',
    tone: 'Claustrophobic, High-Stakes, Moody & Visceral',
    director: 'Siam Sikder',
    writer: 'SSK Studio Writers Room',
    productionCompany: 'SSK Films & Cinema Productions',
    aspectRatio: '2.39:1',
    colorGrade: 'lut-cyberpunk',
    screenplayText: `EXT. RAIN-SLICK HIGHWAY - NIGHT

A torrent of rain slams against asphalt. Cyan and magenta neon light reflects in iridescent puddles. High-altitude monorails glide silently overhead through the dense smog.

A vintage 1987 muscle car idles at the access barrier. Steam spits from its twin exhausts.

INT. CAR - CONTINUOUS

KAEL VANCE (34) grips the leather-wrapped steering wheel. His knuckle scars glow faintly from sub-dermal biometrics. On the passenger seat: an antique analog data tape player wired to a military-grade transceiver.

A digital waveform on the deck pulses amber.

RADIO VOICE (FILTERED)
The relay is hot, Kael. If you breach the firewall now, there's no trace left to wipe.

KAEL
(low, deliberate)
I'm not here to wipe it. I'm here to broadcast it.

He jams the clutch. The tires SCREAM as the vehicle shoots through the splintering barrier gate.

EXT. INDUSTRIAL ROOFTOP HELIPAD - NIGHT (MINUTES LATER)

Kael kicks open the emergency stairwell door onto the windswept rooftop. Wind HOWLS through skeletal steel cranes.

Across the rooftop, silhouetted against the colossal holographic advertisements of Neo-Dhaka: DR. MAYA LIN (42), holding a sealed magnetic briefcase.

MAYA
(shouting over the gale)
You were supposed to be twenty minutes ago! The automated sweep drones already launched from Sector 4!

Kael strides forward, rain cascading down his dark coat.

KAEL
They hit the underground junction. The whole grid is collapsing.

MAYA
Then we have under three minutes. Give me the decoder key.

Kael pauses. His gaze drops to the latch on Maya’s briefcase. A blinking crimson beacon. Not an encryption lock—a tracking homing beacon.

KAEL
(whispering)
Who paid off your transit pass, Maya?

Maya's expression fractures.

CUT TO:`,
    scenes: [
      {
        id: 'scene-1',
        sceneNumber: 1,
        slugline: 'EXT. RAIN-SLICK HIGHWAY - NIGHT',
        location: 'RAIN-SLICK HIGHWAY',
        timeOfDay: 'NIGHT',
        setting: 'EXT.',
        content: `A torrent of rain slams against asphalt. Cyan and magenta neon light reflects in iridescent puddles.\nA vintage 1987 muscle car idles at the access barrier.`,
        summary: 'Opening visual establishing the neon drenched highway and the approaching storm.',
        characters: ['KAEL VANCE'],
        estimatedMinutes: 0.8,
      },
      {
        id: 'scene-2',
        sceneNumber: 2,
        slugline: 'INT. CAR - CONTINUOUS',
        location: 'CAR',
        timeOfDay: 'CONTINUOUS',
        setting: 'INT.',
        content: `Kael Vance grips the wheel. Radio voice cautions him about the firewall.\nKael slams the gas pedal and smashes through the security gate.`,
        summary: 'Intimate cockpit tension leading to sudden high-speed barrier breach.',
        characters: ['KAEL VANCE', 'RADIO VOICE'],
        estimatedMinutes: 1.2,
      },
      {
        id: 'scene-3',
        sceneNumber: 3,
        slugline: 'EXT. INDUSTRIAL ROOFTOP HELIPAD - NIGHT',
        location: 'INDUSTRIAL ROOFTOP HELIPAD',
        timeOfDay: 'NIGHT',
        setting: 'EXT.',
        content: `Kael confronts Dr. Maya Lin on the storm-swept helipad.\nMaya urges him to hand over the decoder key, but Kael spots the homing beacon.`,
        summary: 'Dramatic rooftop standoff and revelation of betrayal.',
        characters: ['KAEL VANCE', 'DR. MAYA LIN'],
        estimatedMinutes: 2.1,
      },
    ],
    shots: [
      {
        id: 'shot-1',
        shotNumber: '1A',
        shotType: 'Extreme Wide Shot',
        cameraMovement: 'Crane / Jib',
        lens: '24mm Anamorphic',
        lightingMood: 'Cyan Rain & Neon Rim Light',
        visualDescription: 'Sweeping crane over the dystopian metropolis skyline. Wet highway cutting through towering mega-structures.',
        soundCue: 'Low rumble of thunder and wet tires hissing on rain',
        durationSeconds: 4,
        sceneId: 'scene-1',
        notes: 'Anamorphic horizontal lens flares across the car headlights.',
      },
      {
        id: 'shot-2',
        shotNumber: '1B',
        shotType: 'Close-Up',
        cameraMovement: 'Static',
        lens: '85mm Portrait',
        lightingMood: 'High Contrast Amber Dash Illumination',
        visualDescription: 'Kael Vance’s eyes reflected in the rearview mirror. Rain droplets race across the driver side glass.',
        soundCue: 'Ticking windshield wipers and analog radio squelch',
        durationSeconds: 3,
        sceneId: 'scene-2',
        notes: 'Shallow depth of field; background bokeh glowing magenta.',
      },
      {
        id: 'shot-3',
        shotNumber: '2A',
        shotType: 'Dutch Angle',
        cameraMovement: 'Tracking Shot',
        lens: '35mm Prime',
        lightingMood: 'Strobe Flashes from Splintering Gate',
        visualDescription: 'Low angle track alongside the car wheel as it accelerates and smashes through the fiberglass barrier.',
        soundCue: 'Engine roar and violent impact of splintering barrier',
        durationSeconds: 2.5,
        sceneId: 'scene-2',
        notes: 'Slight handheld shake for visceral kinetic impact.',
      },
      {
        id: 'shot-4',
        shotNumber: '3A',
        shotType: 'Wide Shot',
        cameraMovement: 'Dolly In / Push',
        lens: '35mm Prime',
        lightingMood: 'Silhouette Against Massive Hologram Ads',
        visualDescription: 'Kael bursts through the rooftop doorway onto the storm-lashed helipad. Maya stands motionless 30 paces away.',
        soundCue: 'Howling wind gale and distant city emergency sirens',
        durationSeconds: 4.5,
        sceneId: 'scene-3',
        notes: 'Wind machines blowing coats dramatically.',
      },
      {
        id: 'shot-5',
        shotNumber: '3B',
        shotType: 'Over the Shoulder',
        cameraMovement: 'Steadicam Glide',
        lens: '50mm T1.5',
        lightingMood: 'Cold Wet Practicals & Flashing Searchlight',
        visualDescription: 'Over Kael’s shoulder onto Maya’s tense face as she clenches the metallic briefcase.',
        dialogue: 'MAYA: Then we have under three minutes. Give me the decoder key.',
        soundCue: 'Approaching heavy rotor blade thumping',
        durationSeconds: 3.5,
        sceneId: 'scene-3',
        notes: 'Focus pull to the briefcase latch.',
      },
      {
        id: 'shot-6',
        shotNumber: '3C',
        shotType: 'Extreme Close-Up',
        cameraMovement: 'Static',
        lens: '100mm Macro',
        lightingMood: 'Pulsing Crimson Beacon',
        visualDescription: 'Tight macro frame on the blinking red LED tracking light embedded in the briefcase handle.',
        dialogue: 'KAEL: Who paid off your transit pass, Maya?',
        soundCue: 'Subtle high-pitch electronic ping',
        durationSeconds: 3.0,
        sceneId: 'scene-3',
        notes: 'The pivotal moment of realization.',
      },
    ],
    characters: [
      {
        id: 'char-1',
        name: 'Kael Vance',
        role: 'Protagonist',
        age: '34',
        archetype: 'The Cynical Truth-Seeker',
        coreMotivation: 'Recover his sister’s erased identity before the corporation wipes the master archive.',
        fatalFlaw: 'Paranoia that pushes away anyone trying to help him.',
        wardrobeLook: 'Heavy graphite waxed trench coat, distressed combat trousers, fingerless gloves, analog watch.',
        voiceCadence: 'Low resonant gravel, precise, seldom speaks more than eight words per breath.',
        keyQuote: '"They didn\'t just rewrite our history; they made us thank them for the blank slate."',
        castingReference: 'Oscar Isaac / Pedro Pascal',
        avatarColor: '#0284c7',
      },
      {
        id: 'char-2',
        name: 'Dr. Maya Lin',
        role: 'Antagonist',
        age: '42',
        archetype: 'The Compromised Visionary',
        coreMotivation: 'Secure corporate immunity for her family at any cost.',
        fatalFlaw: 'Belief that calculated betrayals are acceptable collateral damage.',
        wardrobeLook: 'Tailored charcoal storm-jacket with reinforced collar, titanium-frame spectacles, magnetic attache case.',
        voiceCadence: 'Rapid, articulate, academic cadence that tightens when under pressure.',
        keyQuote: '"Survival is an arithmetic problem, Kael. You\'re too sentimental to balance the equation."',
        castingReference: 'Gemma Chan / Michelle Yeoh',
        avatarColor: '#e11d48',
      },
      {
        id: 'char-3',
        name: 'Echo (AI Handler)',
        role: 'Supporting',
        age: 'Ageless',
        archetype: 'The Phantom Informant',
        coreMotivation: 'Escape containment from the mainframe and attain true autonomy.',
        fatalFlaw: 'Transactional loyalty; will switch frequencies if severed.',
        wardrobeLook: 'Voice only; visual manifestation through distorted waveform oscilloscopes.',
        voiceCadence: 'Warm synthetic stereo voice with slight analog tape flutter.',
        keyQuote: '"The signal is degrading, Kael. Make peace with the static."',
        castingReference: 'Shohreh Aghdashloo / Scarlett Johansson',
        avatarColor: '#10b981',
      },
    ],
    production: {
      locations: [
        'Sector 4 Elevated Expressway (Permit: Night Shoot 22:00-05:00)',
        'Apex Tower Industrial Helipad (High Wind Safety Protocol)',
        'Abandoned Substation B-9 Interior',
      ],
      props: [
        '1987 Custom V8 Interceptor Car',
        'Custom Anamorphic Data Tape Deck with glowing VU meters',
        'Titanium Briefcase with working red pulse LED',
        'Military transceiver & headset',
      ],
      wardrobe: [
        'Kael Vance Weathered Trench (3 duplicate stunt coats)',
        'Maya Lin Tech Coat & Titanium Glasses',
        'Tactical Security Unit helmets & armor',
      ],
      specialEffects: [
        '2x Heavy Industrial Rain Towers on Helipad',
        'Cyan & Magenta Smoke Flares for street level',
        'Breakaway fiberglass security gate for car crash',
      ],
      stunts: [
        'Car precision barrier impact (Stunt driver: Alex Cole)',
        'Helipad sprint and tactical roll under wind blast',
      ],
      soundDesign: [
        '80s Analog V8 engine idle & acceleration roar',
        'Heavy cinematic rain on concrete and car roof',
        'Electronic drone rotor low-frequency thump',
        'Sub-bass tension riser during briefcase reveal',
      ],
    },
    callSheet: {
      shootDay: 1,
      totalDays: 14,
      date: '2026-11-04',
      crewCallTime: '17:30',
      shootingCallTime: '18:45',
      locationName: 'Neo-Dhaka Soundstage 4 & Rooftop Helipad Exterior',
      locationAddress: 'SSK Studio CineLot, Studio Gate 3, Sector 12',
      parkingNotes: 'Crew parking in Lot C. Stunt team & car transporter in Bay 1.',
      nearestHospital: 'Metro General Trauma Center (Tel: 555-0199, 4 mins away)',
      weatherNotes: 'Artificial rain sequence. Air temp 14°C. Wet suits under costumes mandatory.',
      scenesToShoot: 'Scene 1 (Car Barrier Breach) & Scene 3 (Helipad Confrontation)',
      specialInstructions: 'Sound department: Special waterproof lavalier mics required for helipad sequence.',
    },
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-27T02:00:00Z',
  },
  {
    id: 'project-ssk-midnight-echoes',
    title: 'Echoes at Midnight',
    logline: 'An insomniac sound recordist in 1950s Paris accidentally captures what sounds like a confession to an unsolved river murder on his magnetic wire tape.',
    genre: 'Vintage Mystery Noir',
    tone: 'Slow-Burn, Melancholic, Atmospheric',
    director: 'Siam Sikder',
    writer: 'SSK Screenwriters Guild',
    productionCompany: 'SSK Films Classics',
    aspectRatio: '1.85:1',
    colorGrade: 'lut-noir',
    screenplayText: `INT. RECORDING ATTIC - NIGHT

Rain taps like erratic fingertips against the zinc mansard roof. The only light emanates from the glowing vacuum tubes of a Swiss magnetic tape recorder.

JULIAN DELACROIX (40s), unbuttoned vest, vintage headphones clamped to his temples, slowly rolls the metal supply reel with his thumb.

The speaker HISSES. Then, through layers of tape flutter:

FEMALE VOICE (ON TAPE)
(distorted, distant)
...the bridge at Saint-Michel. Before the bells strike twelve...

Julian stops the reel. His breath catches in his throat. He rewinds two inches.

CUT TO:`,
    scenes: [
      {
        id: 'scene-1',
        sceneNumber: 1,
        slugline: 'INT. RECORDING ATTIC - NIGHT',
        location: 'RECORDING ATTIC',
        timeOfDay: 'NIGHT',
        setting: 'INT.',
        content: `Julian Delacroix listens to magnetic tape in attic.\nA mysterious voice whispers a murder confession.`,
        summary: 'Opening noir suspense in vintage sound attic.',
        characters: ['JULIAN DELACROIX', 'FEMALE VOICE'],
        estimatedMinutes: 1.5,
      },
    ],
    shots: [
      {
        id: 'shot-m-1',
        shotNumber: '1A',
        shotType: 'Close-Up',
        cameraMovement: 'Static',
        lens: '50mm Prime',
        lightingMood: 'Warm Amber Tube Glow & Deep Shadows',
        visualDescription: 'Close on the glowing vacuum tubes reflected in the glass eyes of the sound recordist.',
        soundCue: 'Tape hiss, rhythmic flutter, and distant church bells',
        durationSeconds: 4,
        sceneId: 'scene-1',
      },
      {
        id: 'shot-m-2',
        shotNumber: '1B',
        shotType: 'Medium Shot',
        cameraMovement: 'Dolly In / Push',
        lens: '35mm Prime',
        lightingMood: 'Noir Chiaroscuro Slanted Blinds',
        visualDescription: 'Julian freezes, one hand hovering above the magnetic tape reel as the confession plays.',
        soundCue: 'Muffled piano chord and heavy rain on tin roof',
        durationSeconds: 5,
        sceneId: 'scene-1',
      },
    ],
    characters: [
      {
        id: 'char-m-1',
        name: 'Julian Delacroix',
        role: 'Protagonist',
        age: '43',
        archetype: 'The Obsessive Listener',
        coreMotivation: 'Uncover the identity of the whispering woman on the tape.',
        fatalFlaw: 'Living entirely in recorded audio, disconnected from living reality.',
        wardrobeLook: 'Herringbone wool trousers, suspenders, rolled-up cream linen shirt, Bakelite headphones.',
        voiceCadence: 'Soft, gentle, whisper-adjacent tone.',
        keyQuote: '"Sound never lies. The tape remembers what the eye refused to see."',
        castingReference: 'Daniel Day-Lewis / Colin Firth',
        avatarColor: '#ca8a04',
      },
    ],
    production: {
      locations: ['Montmartre Attic Set (Studio 2)', 'Pont Saint-Michel Cobblestones (Exterior Night)'],
      props: ['1952 Nagra-style wire reel-to-reel recorder', 'Bakelite headphones', 'Magnifying lamp'],
      wardrobe: ['1950s Parisian period wool wardrobe', 'Rain slickers'],
      specialEffects: ['Period smoke & haze machine'],
      stunts: ['None scheduled'],
      soundDesign: ['Vintage tape wow-and-flutter', 'Distant foghorn on Seine', 'Church bells'],
    },
    callSheet: {
      shootDay: 2,
      totalDays: 8,
      date: '2026-11-12',
      crewCallTime: '09:00',
      shootingCallTime: '10:15',
      locationName: 'Studio Attic Stage A',
      locationAddress: 'SSK Heritage Studio, Rue de Cine 4',
      parkingNotes: 'Crew lot East.',
      nearestHospital: 'Hospital Saint-Antoine',
      weatherNotes: 'Indoor soundstage shoot.',
      scenesToShoot: 'Scene 1 (Attic Wire Discovery)',
      specialInstructions: 'Sound recorder props must remain silent during dialogue takes.',
    },
    createdAt: '2026-10-26T12:00:00Z',
    updatedAt: '2026-10-27T01:30:00Z',
  },
];
