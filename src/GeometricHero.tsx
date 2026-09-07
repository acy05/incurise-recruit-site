import { useEffect, useRef, useState } from "react";

/** A locally rendered particle sculpture: no video download or external runtime. */
export function GeometricHero({ centerShift = 0, motion = "default" }: { centerShift?: number; motion?: "default" | "A" | "B" | "C" | "D" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let time = timeRef.current;
    let inView = true;
    const pointer = { x: -10000, y: -10000, tilt: 0, targetTilt: 0 };
    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top;
      pointer.targetTilt = pointer.x >= 0 && pointer.x <= box.width && pointer.y >= 0 && pointer.y <= box.height ? (pointer.x / box.width - .5) * .45 : 0;
    };
    if (motion === "C") window.addEventListener("pointermove", move, { passive: true });
    if (motion === "C") window.addEventListener("pointerdown", move, { passive: true });
    const still = paused || reduced || matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deterministic sampling avoids a flashing/random composition on resize.
    const points = Array.from({ length: 12000 }, (_, i) => ({
      u: (i / 12000) * Math.PI * 2,
      v: ((i * .61803398875) % 1) * Math.PI * 2,
      seed: ((i * .754877666) % 1),
    }));

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const mobile = width < 768;
      const progress = motion === "D" && !still ? Math.max(0, Math.min(1, -canvas.getBoundingClientRect().top / height)) : 0;
      const scale = Math.min(width * (mobile ? .49 : .27), height * .43) * (1 + progress * 2.5);
      const cx = width * ((mobile ? .64 : .74) + centerShift);
      const cy = height * (mobile ? .30 : .46);
      if (!still) pointer.tilt += (pointer.targetTilt - pointer.tilt) * .08;
      const spin = time * .085 + .3 + (motion === "C" ? pointer.tilt : 0);
      const tilt = .65 + Math.sin(time * .12) * .16;
      const cos = Math.cos(spin), sin = Math.sin(spin);
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const stride = mobile ? 2 : 1;
      for (let i = 0; i < points.length; i += stride) {
        const { u, v, seed } = points[i];
        const wave = Math.sin(u * 3 + time * .22);
        const ring = .94 + .14 * wave;
        const tube = .25 + .065 * Math.cos(u * 5 - time * .15);
        let x = (ring + tube * Math.cos(v)) * Math.cos(u);
        let y = (ring + tube * Math.cos(v)) * Math.sin(u);
        let z = tube * Math.sin(v) + .28 * Math.sin(u * 3 + time * .13);
        if (motion === "A" && !reduced) {
          const spread = Math.pow(1 - Math.min(time / 2.4, 1), 3);
          x += Math.sin(i * 1.73) * 4 * spread;
          y += Math.cos(i * 2.31) * 3 * spread;
          z += Math.sin(i * .97) * spread;
        }
        if (motion === "B") {
          const phase = (time / 5) % 3;
          const blend = (1 - Math.cos((phase % 1) * Math.PI)) / 2;
          const sz = Math.cos(v), sr = Math.sin(v);
          const sphere = [sr * Math.cos(u), sr * Math.sin(u), sz];
          const max = Math.max(...sphere.map(Math.abs));
          const cube = sphere.map(value => value / max * .85);
          const shapes = [sphere, cube, [x, y, z]];
          const from = shapes[Math.floor(phase)], to = shapes[(Math.floor(phase) + 1) % 3];
          [x, y, z] = from.map((value, axis) => value + (to[axis] - value) * blend);
        }
        const rx = x * cos - z * sin;
        const rz = x * sin + z * cos;
        const ry = y * ct - rz * st;
        const depth = y * st + rz * ct;
        const perspective = 3.3 / (3.3 - depth);
        let px = cx + rx * scale * perspective;
        let py = cy + ry * scale * perspective;
        if (motion === "C" && !still) {
          const dx = px - pointer.x, dy = py - pointer.y;
          const distance = Math.hypot(dx, dy);
          const push = Math.max(0, 1 - distance / 150) * 55;
          px += dx / Math.max(distance, 1) * push;
          py += dy / Math.max(distance, 1) * push;
        }
        const light = Math.max(.14, Math.min(1, (depth + 1.3) / 2.3));
        const hue = Math.sin(u * 2 + v * .3 + time * .06);
        context.fillStyle = hue > .52 ? `rgba(255,155,113,${.22 + light * .66})`
          : hue < -.6 ? `rgba(193,234,223,${.12 + light * .4})`
          : `rgba(255,${Math.round(20 + seed * 55)},${Math.round(100 + seed * 65)},${.2 + light * .7})`;
        const size = (.7 + seed * .8) * perspective * (mobile ? .9 : 1);
        context.fillRect(px, py, size, size);
      }
      // Quiet orbital guides give the cloud a clear geometric structure.
      context.save();
      context.translate(cx, cy);
      context.rotate(-.36 + Math.sin(time * .09) * .08);
      context.strokeStyle = "rgba(181,218,211,.13)";
      context.lineWidth = .7;
      [1.32, 1.48].forEach((radius) => {
        context.beginPath();
        context.ellipse(0, 0, scale * radius, scale * radius * .64, 0, 0, Math.PI * 2);
        context.stroke();
      });
      context.restore();
    };
    const tick = (now: number) => {
      frame = 0;
      if (still || !inView || document.hidden) return;
      if (now - last >= 1000 / 30) {
        time += Math.min((now - last) / 1000, .05);
        timeRef.current = time;
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = performance.now();
      if (!still && inView && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const box = canvas.getBoundingClientRect();
      width = box.width; height = box.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect(); observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
    };
  }, [paused, reduced, centerShift, motion]);

  return <>
    <div className="cr2-geometric-background" aria-hidden="true">
      <div className="cr2-geometric-glow" />
      <canvas ref={canvasRef} />
      <div className="cr2-geometric-grid" />
    </div>
    {!reduced && <button className="cr2-motion-toggle" type="button" aria-label={paused ? "背景アニメーションを再生" : "背景アニメーションを一時停止"} aria-pressed={paused} onClick={() => setPaused(!paused)}>
      <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span><span>{paused ? "PLAY" : "PAUSE"}</span>
    </button>}
  </>;
}
