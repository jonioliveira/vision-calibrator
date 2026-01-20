# Vision Calibrator

Evidence-based editor settings for visual comfort. Get personalized recommendations backed by peer-reviewed research for myopia, astigmatism, and color vision deficiency.

## Features

- **Evidence-Based** — Every recommendation cites actual vision science research
- **Multi-Editor** — Generates config for VS Code, Zed, Neovim, JetBrains, and Sublime Text
- **Prescription-Aware** — Enter your sphere, cylinder, and axis for personalized results
- **Privacy-First** — All calculations run client-side, no data stored or transmitted

## Research Behind It

| Finding | Source |
|---------|--------|
| Font below 16pt causes <33cm viewing distance | Peking University, BMJ Open Ophthalmology 2023 |
| 3:1 acuity reserve for max reading speed | Vision science critical print size research |
| Line height 1.5× reduces eye strain | Nielsen Norman Group, J. Experimental Psychology |
| 0.5D uncorrected astigmatism increases strain | Multiple computer vision syndrome studies |
| Larger fonts reduce accommodation lag | Nanotechnology Perceptions, 2024 |

## Getting Started

```bash
git clone https://github.com/yourusername/vision-calibrator.git
cd vision-calibrator
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vision-calibrator)

## Supported Editors

- **VS Code** — `settings.json`
- **Zed** — `~/.config/zed/settings.json`
- **Neovim** — `init.lua`
- **JetBrains** — Settings → Editor → Font
- **Sublime Text** — `Preferences.sublime-settings`

## Settings Calculated

| Setting | Based On |
|---------|----------|
| Font Size | Myopia severity, acuity reserve principle |
| Line Height | Eye strain research, crowding effects |
| Font Weight | Blur/ghosting, light sensitivity |
| Cursor Style | Tracking needs for myopia |
| Font Suggestions | Astigmatism-friendly letterforms |
| Theme Suggestions | Color vision deficiency type |

## Note on Letter Spacing

Research shows monospace fonts already have optimal spacing built in. Adding more letter spacing doesn't help and may slow reading. Instead, this tool recommends fonts with naturally wider character spacing (IBM Plex Mono, JetBrains Mono, etc.).

## Credits

- Inspired by [Harmonia Vision](https://github.com/AgusRdz/harmonia-vision) by [AgusRdz](https://github.com/AgusRdz)
- Enhanced with peer-reviewed research from PMC, ARVO, Nielsen Norman Group, and others

## Disclaimer

This tool provides comfort recommendations, not medical advice. If you experience persistent eye strain or vision problems, please consult an optometrist or ophthalmologist.

## License

MIT
