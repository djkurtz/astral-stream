# ASTRAL STREAM: The Frequency Chronicles
### *Master Game Design Document (3D Retro 8-Bit World Edition)*

---

## 1. Vision & Core Fantasy
*Astral Stream* is a vibrant, cozy musical creature-collecting RPG set in a **3D Retro 8-Bit Diorama world** (an "HD-8-Bit" aesthetic combining low-poly voxel geometry, 2.5D animated pixel sprites, dynamic volumetric lighting, and tilt-shift depth of field). 

In a universe where music streams through the cosmos like high-speed data, players explore charming island archipelagos carrying a sleek **Vibe-Phone**. Using sonic radar frequencies, players scan the environment, match ambient waveforms from world cultures and classical eras, and stream living **Harmonimals** (creatures whose biological anatomy *is* their musical instrument) directly into their active playlist.

---

## 2. Visual Style: "3D Retro 8-Bit Diorama"

The game marries nostalgic 8-bit pixel art charm with the physical presence and depth of a modern 3D world:

* **3D Stepped Voxel & Low-Poly Geometry**: The environment is built with crisp grid-aligned 3D blocks, stepped cliffs, cobblestone stairs, and wooden boardwalks textured with authentic 8-bit pixel art palettes.
* **2.5D Pixel-Billboard Harmonimals**: Characters and creatures are rendered as expressive, multi-frame 8-bit pixel billboards that face the camera in 3D space, bobbing to the world tempo and casting real-time pixelated drop shadows.
* **Volumetric Retro Lighting & Bloom**: Warm radial glow from 3D streetlamps, neon signboards casting colored reflections across 3D water surfaces, and sun shafts cutting through 3D pixelated palm tree canopies.
* **Dynamic 3D Water & Audio Visualizers**: The ocean surf is composed of animated 3D voxel waves with undulating sine foam. When music plays, terrain elements and water ripples pulse in physical 3D space to the bassline.
* **Cinematic Camera**: Smooth isometric / tilted 3D perspective with subtle tilt-shift blur giving the world a tactile "miniature diorama" feel. During battles, the camera swoops down for dynamic split-screen rhythmic action shots.

---

## 3. The Modern Core Pillars

### 1. 🔍 Audio Match Radar (The Shazam / Sound-ID Mechanic)
No physical capsules, tapes, or cages. Players hold up their Vibe-Phone in the 3D world to detect spatial sound ripples expanding across the terrain. Engaging a ripple triggers one of 3 skill-based audio challenges:
* **🎛️ Waveform Equalizer**: Drag or use `[A/D]` to slide frequency harmonics until the player wave visually merges with the creature wave into a radiant green resonance.
* **🎹 Call & Response Melody Jam**: Repeat musical phrases across 3 launchpad pitches (`[1, 2, 3]` / `[J, K, L]`) to harmonize with the creature's melody.
* **🥁 Rhythm Pulse Lock**: Tap `[SPACE]` on tempo as expanding 3D sonic rings align with the target circle.

### 2. 🐾 Living Harmonimals (Sampled Music Manifestations)
Harmonimals are physical manifestations of the musical tracks and acoustic traditions sampled into the player's master playlist.
* **Overworld Manifestation**: Only **one active track (animal)** is streamed and manifested at a time as your walking companion. Players switch songs via the top playlist bar (`[Q]`), seamlessly cross-fading the active animal and its ambient instrument layer into the world soundscape.
* **Biological Instrument Anatomy**:
  * **🎹🐱 Chime-Cat**: A pastel kitten with playable piano synthesizer keys down its spine, an audio-jack tail, and glowing LED spectrum whiskers.
  * **🎻🦉 Allegro-Owl**: A European barn owl with an acoustic violin chest featuring carved f-holes (`𝒻`) and resilient horsehair bow wings.
  * **🪕🦢 Sitar-Swan**: A graceful swan with a fretted sitar neck (*dandi*) and a resonant carved acoustic gourd body (*tumba*).
  * **🥁🦝 Taiko-Tanuki**: A chubby tanuki raccoon dog with a taut festival Taiko drum-skin belly and wooden tail-sticks.
  * **🎷🐰 Brass-Bunny**: An energetic golden hare with curving saxophone bell ears that toot bebop riffs.
  * **🎸🐶 Bass-Hound**: A droopy-eared rock basset hound with an 808 sub-woofer throat and guitar-strap ears.

### 3. 🎼 Global & Classical Genre Affinity Wheel
Combat strategy revolves around an authentic 5-genre cultural wheel:
$$\text{🎻 SYMPHONIC} \xrightarrow{\text{overpowers}} \text{🎹 SYNTH} \xrightarrow{\text{overpowers}} \text{🪕 GLOBAL} \xrightarrow{\text{overpowers}} \text{🎷 JAZZ} \xrightarrow{\text{overpowers}} \text{🎻 SYMPHONIC}$$
* **🎻 Symphonic / Classical** (Complex harmonic structures overwhelm digital square waves).
* **🎹 Synth / Electronic** (Amplified high-voltage signals slice through acoustic resonance).
* **🪕 Global / World Traditions** (Ancient roots & microtonal glides dismantle jazz phrasing).
* **🎷 Jazz / Blues** (Improvisational syncopation breaks rigid classical symmetry).
* **✨ Omni-Harmony Cosmic Blend** (Unites all world traditions to shatter rogue analog static).

### 4. ⚔️ DJ Launchpad Battle System & Rhythm Precision
* **Turn-Based Stem Pads**: Select attacks via glowing DJ Launchpad buttons (`[1]`, `[2]`).
* **Unobstructed Rhythm Timing Bar**: When an attack is chosen, a high-contrast timing bar sweeps across the top-center of the screen. Hitting `[SPACE]` or clicking inside the **Green Target Zone** triggers a **✨ PERFECT SYNC!** (+50% Critical Damage + energy refund).
* **Live Stem Sampling & Multipart Harmony Fusion**: 
  - During battle, players can dynamically sample different tracks/stems from their playlist queue (one signature leitmotif at a time) to exploit enemy genre vulnerabilities.
  - Pressing `[B]` activates **Multipart Harmony Fusion**, mixing multiple instrument stems simultaneously to fuse into colossal legends like the **Omni-Harmony Chimera (`🐯✨`)**!

---

## 4. Chapter 1: "The Silent Frequency" (Open World Exploration)

### 3200×2400 Open World Architecture & Natural Trails:
The game world is an expansive, continuous scrolling island connected by organic meandering dirt and cobblestone stepping-stone trails. All rigid "highways" have been replaced with scenic nature walks connecting all biomes:

```
                       [ Zone 5: Desolation Ridge ] 
                      (Jax's Rebel Bunker & Glitch Gate)
                                     |
[ Zone 1: Port Resonata ] --- [ Zone 2: Cadence Plaza ] --- [ Zone 3: Bamboo Grove ]
(Barnaby & Tidal Dunes)       (Enterable Cafe & Vinyl Den)  (Taiko Shrine & Pagodas)
                                     |
                       [ Zone 4: Ancient Sound Ruins ]
                      (Primordial Shrines & Obelisks)
```

### ☕ Enterable Village Interiors & Social Mechanics:
* **Neon Cafe**: Step through the front door to enter a cozy, warm-lit cafe with a polished parquet wood floor, espresso machines, and pastry cases. Order a **Harmonic Latte** from Aria to fully restore party HP and Energy. Chat with festival guests **Maya** (Lo-Fi Beatmaker) and **Leo** (Modular Synth Collector) and meet their musical pets before the static storm.
* **Vinyl Den**: Step inside DJ Otter's shop glowing under neon signs, spinning dual turntables, and LED spectrum analyzers. Flip through the vintage **Classical Vinyl Crates** and **Global Raga & Bass Crates** to acquire permanent Harmonimal energy upgrades.

### ⛩️ Expanded Biomes with Dual Challenges (Beyond Monsters):
Each biome features authentic cultural traditions and **two unique interactive acoustic puzzles**:
1. **🏖️ Zone 1: Port Resonata (South)**:
   - *Challenge 1*: **Sacred Sitar & Raga Shrine** (3-Pitch Call-and-Response Jam to unlock Sitar-Swan).
   - *Challenge 2*: **Harmonic Sea Conches** (Attune 3 harmonic sea-conches along the tide pools to unearth the sunken Golden Vinyl).
   - *Discordant Monsters*: Wild Bit-Bugs & Steel-Pandas.
2. **🎋 Zone 2: Whispering Bamboo Forest (East)**:
   - *Challenge 1*: **Matsuri Taiko Drum Shrine** (Rhythm Pulse Lock to unlock Taiko-Tanuki).
   - *Challenge 2*: **Bamboo Wind Chimes** (Strike 5 resonant bronze and bamboo wind chimes in ascending pentatonic order to open secret stepping stones).
   - *Discordant Monsters*: Wild Kora-Gazelles.
3. **🏛️ Zone 3: Ancient Sound Ruins (Northeast)**:
   - *Challenge 1*: **Symphonic Violin Shrine** (Waveform Equalizer slider to unlock Allegro-Owl).
   - *Challenge 2*: **Primordial Tuning Obelisks** (Align quartz echo beams to disperse the dense sonic fog shrouding the terrace).
   - *Discordant Monsters*: Wild Glitch-Golem.
4. **⚡ Zone 4: Desolation Ridge (Northwest)**:
   - *Challenge 1*: **Rival Jax Overdrive Duel** (Synchronize with bass drops to recruit Bass-Hound and gain tag-team blend).
   - *Challenge 2*: **Glitch Gate Resonance Breach** (Final Boss: Dead Channel 000 / Signal Overlord).

### Narrative Quest Flow & Environmental Discovery:
* **Prologue Morning**: Players explore the sunny plaza and enter the Neon Cafe to talk with Aria, Maya, and Leo.
* **Act 1 — Emergency Broadcast**: Triggered when the player leaves the cafe and approaches the **Harmony Fountain** in the center of Cadence Plaza. A massive static screech severs the islanders' pet connections.
* **Act 2 — Seeking Cultural Traditions**: Explore the biomes, solve the dual challenges, and bond with ancient shrine archetypes shielded by Chime-Cat's uncorrupted carrier wave.
* **Act 3 — Battle Stem Sampling & Evolution**: Battle wild monsters to sample their harmonic stems, triggering **Harmonic Evolutions** (e.g. Polyphonic Synth-Cat, Virtuoso Violin-Owl).
* **Act 4 — The Rebel Stand & Glitch Breach**: Dissolve the sonic vines, ally with Jax, and breach the Glitch Gate to silence Dead Channel 000 and restore all lost pets!

---

## 5. Technical Specifications for 3D Retro Engine

* **Rendering Engine**: Three.js / WebGL with custom pixel-art shaders.
* **Texture Filtering**: `NearestFilter` (point sampling) on all 3D mesh textures and 2.5D sprite billboards to guarantee tack-sharp 8-bit pixelation without blur.
* **Pixel Density & Scaling**: Fixed internal retro render resolution (e.g. 320×240 or 640×480) upscaled with integer scaling or CSS `image-rendering: pixelated`.
* **Audio Engine**: Web Audio API procedural synthesis with custom wave-shapers (Triangle/Sawtooth for strings and sitars, Square for chiptune, Sine for sub-bass, Noise for taiko impact and glitch static).
* **Control Accessibility**: Dual-mode input everywhere (Full Mouse/Touch clickability + Full Keyboard shortcuts `[W,A,S,D]`, `[1,2,3]`, `[J,K,L]`, `[SPACE]`, `[B]`).
