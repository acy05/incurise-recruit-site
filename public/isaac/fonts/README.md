# Sample site typography

All five families are distributed under the SIL Open Font License 1.1. They may be used commercially and embedded in websites without a font usage fee, subject to the included license terms. Exact installed package versions: 5.3.0. Fonts are served from this project through Vite; no Google Fonts API or external font CDN is used at runtime. `font-display: swap` and the upstream Unicode ranges are retained. Font files themselves have not been edited.

| Site | Display / Japanese | Latin and UI | Intent |
| --- | --- | --- | --- |
| SORA | Noto Serif JP (variable, 400–500); existing Noto Sans JP for body/forms | Jost (variable, 400–450) | Quiet Mincho headlines; spaced geometric wordmark |
| next. | Zen Kaku Gothic New (400, 700) | Outfit (variable, 400–750) | Friendly shapes, strong readable Japanese headlines |
| mellow | Cormorant Garamond (500 normal and real italic); Zen Kaku Gothic New (400) | Jost | Soft editorial display type; restrained, readable product UI |

The gallery cards and full sites share `src/sample-fonts.css`. ISAAC's own hero and main typography are unchanged.

## Sources and bundled licenses

- Noto Serif JP: [upstream license](https://github.com/google/fonts/blob/main/ofl/notoserifjp/OFL.txt) · [bundled license](noto-serif-jp-OFL.txt)
- Jost: [upstream license](https://github.com/google/fonts/blob/main/ofl/jost/OFL.txt) · [bundled license](jost-OFL.txt)
- Outfit: [upstream license](https://github.com/google/fonts/blob/main/ofl/outfit/OFL.txt) · [bundled license](outfit-OFL.txt)
- Zen Kaku Gothic New: [upstream license](https://github.com/google/fonts/blob/main/ofl/zenkakugothicnew/OFL.txt) · [bundled license](zen-kaku-gothic-new-OFL.txt)
- Cormorant Garamond: [upstream license](https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt) · [bundled license](cormorant-garamond-OFL.txt)

No custom font was needed. The existing Noto Sans JP Fontsource dependency continues to supply neutral Japanese body text on SORA and the ISAAC landing page.
