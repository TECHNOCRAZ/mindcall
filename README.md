# MindCall

A black-screen mentalism app for live performances. Uses volume buttons for secret input and phone vibration to deliver letters in Polybius code.

## Quick Deploy

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```

### 3. Deploy to Netlify
Connect this repo to Netlify. Build settings are already in `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`

## How It Works

### Phase 1 — Code Entry (black screen)
| Gesture | Digit |
|---|---|
| Volume UP | 1 |
| Volume UP then DOWN (within 800ms) | 2 |
| Volume DOWN | 3 |
| Double Volume UP | Confirm & filter |
| Double Volume DOWN | Reset |

### Phase 2 — Letter Questions
- App vibrates the next letter using **Polybius Square** code (row pulses · pause · column pulses)
- **Volume UP** = YES (word contains this letter)
- **Volume DOWN** = NO → triggers countdown to fake call reveal

### Phase 3 — Fake Call Reveal
- After configurable delay (default 10s), fake iOS call screen appears
- Caller name = the identified word in ALL CAPS
- Tap Decline to reset

### Secret Gestures
| Gesture | Action |
|---|---|
| 2-finger swipe down | Open Settings |
| Long press (600ms) | Quick list selector |

## Settings
- Word category (Animals, Countries, Cities, Foods, Colors, Emotions, Sports, Professions, All English)
- Word length filter (Any / 3–5 / 5–7 / 6–8)
- Call delay (1–30 seconds)
- Caller font size
- Wallpaper theme
- Vibration pulse duration & group pause
- Candidate count hint toggle

## Install as iPhone App
1. Open your Netlify URL in **Safari**
2. Tap the **Share** button
3. Tap **"Add to Home Screen"**
4. Launches fullscreen with black background — looks like a native app
