import { useEffect, useRef, useState } from "react";

/** A locally rendered particle sculpture: no video download or external runtime. */
export function GeometricHero({ centerShift = 0, motion = "default", space = "default" }: { centerShift?: number; motion?: "default" | "A" | "B" | "C" | "D"; space?: "default" | "flow" | "rings" | "facets" }) {
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
      // Edge-to-edge studies. A single canvas clock keeps pause/reduced motion consistent.
      context.save();
      if (space === "flow") {
        for (let row = 0; row < 32; row++) {
          for (let col = 0; col < 150; col++) {
            const t = col / 149;
            const x = t * width;
            const y = height * (.5 + .26 * Math.sin(t * 7 + time * .22 + row * .035)) + (row - 16) * 7;
            const edge = Math.pow(Math.abs(t - .5) * 2, .5);
            context.fillStyle = `rgba(255,${80 + row * 3},${130 + row * 2},${.18 + edge * .55})`;
            context.fillRect(x, y, 1.5, 1.5);
          }
        }
      }
      if (space === "rings") {
        for (const side of [-1, 1]) {
          context.save();
          context.translate(side < 0 ? width * .035 : width * .965, height * (side < 0 ? .43 : .57));
          context.rotate(side * .45 + time * .045);
          for (let r = 0; r < 20; r++) {
            context.strokeStyle = r % 4 === 0 ? "rgba(255,55,125,.65)" : "rgba(179,223,219,.25)";
            context.lineWidth = r % 4 === 0 ? 1.3 : .65;
            context.beginPath();
            context.ellipse(0, 0, height * (.24 + r * .016), height * (.13 + r * .01), r * .025, 0, Math.PI * 2);
            context.stroke();
          }
          context.restore();
        }
      }
      if (space === "facets") {
        for (const side of [-1, 1]) {
          const vertices = Array.from({length: 42}, (_, i) => {
            const row = Math.floor(i / 6), col = i % 6;
            const x = (col / 5 * width * .33 - width * .06) + Math.sin(row * .8 + time * .14) * 16;
            return [side < 0 ? x : width - x, row / 6 * height + Math.cos(col + time * .18) * 35];
          });
          for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) {
            const i = row * 6 + col;
            for (const ids of [[i,i+1,i+6],[i+1,i+7,i+6]]) {
              context.beginPath();
              ids.forEach((id,j)=>j ? context.lineTo(vertices[id][0],vertices[id][1]) : context.moveTo(vertices[id][0],vertices[id][1]));
              context.closePath();
              context.fillStyle = `rgba(255,${45+row*13},${110+col*10},${.025 + (Math.sin(i + time * .2) + 1) * .035})`;
              context.fill(); context.strokeStyle = "rgba(232,130,158,.3)"; context.lineWidth = .8; context.stroke();
            }
          }
          context.fillStyle="rgba(255,143,164,.85)";
          vertices.forEach(([x,y])=>context.fillRect(x-1.5,y-1.5,3,3));
        }
      }
      context.restore();
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
  }, [paused, reduced, centerShift, motion, space]);

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
