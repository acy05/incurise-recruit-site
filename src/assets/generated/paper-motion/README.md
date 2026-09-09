# Sunlit paper waves

Original procedural motion artwork rendered locally with Blender 4.5 Cycles. Seven matte sculpted sheets in ivory, sand, and terracotta, lit with two large area lights. No stock footage or third-party artwork.

Delivery: 800 × 800 H.264, 24 fps, eight-second silent loop. The animation travels forward and back through nine rendered poses; optical-flow interpolation produces smooth playback. The page retains its existing pause and reduced-motion behavior.

Reproduce from the project root with Blender: `PAPER_END=9 .../Blender --background --factory-startup --python src/assets/generated/paper-motion/render.py`. The script uses Metal on this Mac and writes to `output/paper-motion/keyframes`. Sequence poses 0–8, 7–0, then 1–2 as interpolation padding at 2 fps; apply ffmpeg `minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, trim to 8 seconds, encode libx264 CRF 20, yuv420p, faststart. Extract the first frame as the JPEG poster.
