# PANE

**Everyone has something to hide. Some things are only visible from the outside.**

A playable, atmospheric, single-page noir observation game about a window cleaner suspended outside a twelve-storey apartment block. Each lit window holds a small life, and some are hiding a larger mystery.

**[Play PANE on GitHub Pages](https://joramvanloenen.github.io/Pane/)** (after Pages is enabled for this repository).

## Play

1. Select a window. The cleaning platform moves to it and the camera closes in.
2. **Drag across the glass** with a mouse, pen, or touch to remove rain-streaked grime.
3. Once the pane is clear enough, select **Look closer**.
4. Read what you witness, make small interventions or choose to keep your distance, then return to the glass to follow the story.
5. Open the **casebook** to revisit clues, unresolved threads, and apartments.

| Control | Action |
| --- | --- |
| Click / tap a window | Approach that apartment |
| Drag on focused window | Clean the glass |
| W / S or ↑ / ↓ | Move the platform between floors |
| A / D or ← / → | Move along windows |
| Mouse wheel | Move between floors |
| Space / Enter | Look closer / follow a thread |
| Esc | Return to the tower |
| J | Open the casebook |
| N | Switch day and night |
| ♪ | Toggle synthesized rain ambience |

The game supports touch controls, reduced-motion preferences, browser resize, local save data, and no account requirement.

## What is implemented

- **Three.js world:** twelve floors, three apartments per floor (36 units); dimensional floors, walls, façade, skyline, frames, rain, reflections, moving cable-suspended cleaning platform, smooth camera movement.
- **2D characters with needs-based behavior:** procedurally drawn and animated canvas actors inside each 3D room. Agents have hunger, fatigue, social connection, safety, stress, fear, desire, and curiosity, with routine selection by weighted utility rather than static loops.
- **Expressive animation:** blinks, moving pupils, shifting facial expressions, shoulders, head tilts, alternating steps, breathing, nervous fidgeting, object-use poses, occasional glances at the player, and directed emotional reactions.
- **Set dressing:** dozens of illustrated prop types including furniture, photographs, documents, plants, kettles, old radios, flowers, packing boxes and cribs; wallpaper, texture variation, warm practical light, depth layering.
- **Twelve written narratives:** grief, romantic longing, strange phenomena, paranoia, survival, investigation, protection. Each has three chapters/fragments and interactive choices affecting performances and emotional need values.
- **Emergent moments:** residents continue to choose actions outside story beats. There are occasional surprises, room-light flickers and small spontaneous gestures.
- **Casebook:** persistent story fragments, choices, cleaned windows and return-to-apartment navigation (saved to localStorage).
- **Two lighting modes:** night and day.

### Narrative design

Each room contains two interlocking systems:

1. **Living-systems simulation:** A lightweight utility-based agent chooses between activities such as eating, working, resting, pacing, socializing, phoning, watching the window, and dancing. Needs change gradually, outcomes alter needs, and weighted randomness avoids mechanical predictability. Movement interpolates toward room activity anchors.
2. **Authored narrative director:** A chapter/choice directs one or more agents' immediate gestures and changes emotional pressures while leaving the basic simulation active. The player sees *fragments* rather than a full exposition. Multiple stories share motifs (three knocks, radio signals, a missing floor, the window cleaner being watched).

This is a **vertical slice**, not a photorealistic simulation: cutout art and utility AI are stylized, and narrative events are handcrafted. The design is intended to expand toward fully interactive props, richer animation blending, relationships, spatial paths and long-form simulation.

### Mature tone

PANE contains adult romantic tension, psychological suspense, grief and unsettling supernatural hints. The romantic content is suggestive, non-explicit and depicts adult characters.

## Architecture

```text
index.html         Semantic game UI / overlay / casebook
style.css          Responsive cinematic UI
src/
  main.js          Input, game loop, story director, saves, controls, audio
  world.js         Three.js world, rooms, set dressing, glass, light, rain
  people.js        Canvas character art, animation, utility-based behavior
  stories.js       Twelve authored story threads with choices and clues
```

No bundler, API key, or installation is needed to play. The browser imports the Three.js ES module from jsDelivr, so a network connection is needed for the first load.

### Running locally

Serve this folder using any local static HTTP server, for example `python -m http.server 8000`, then open `http://localhost:8000`. Do not open `index.html` from a `file://` URL; browser module imports are subject to local-file security restrictions.

### Deployment

The `.github/workflows/deploy.yml` workflow publishes the static site on commits to `main`. In repository **Settings → Pages**, choose **GitHub Actions** as the source if initial Pages configuration is required.

## Potential expansions

Relationship and deception graphs across apartments; character-specific body-language layers; physically interacted props and changing room states; risk of being spotted while watching; time-gated routines and consequences; procedural micro-stories whose logic comes from simulated needs, secrets and interactions; audio muffling through panes; progressive reveal of the tower's hidden thirteenth floor.

Made for narrative experimentation and the little moments that make strangers feel human.
