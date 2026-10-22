import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { hotspots, site, type Hotspot } from "@/content";
import { speak, stopSpeech } from "./speech";

function drawPlaceholder() {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 1024;
  const g = c.getContext("2d")!;
  const sky = g.createLinearGradient(0, 0, 0, 1024);
  sky.addColorStop(0, "#0b0920"); sky.addColorStop(0.5, "#221d4a"); sky.addColorStop(0.62, "#3a2a55");
  g.fillStyle = sky; g.fillRect(0, 0, 2048, 1024);
  let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(241,228,200,${rnd() * 0.8})`; g.fillRect(rnd() * 2048, rnd() * 480, 2, 2); }
  g.fillStyle = "#f1e4c8"; g.beginPath(); g.arc(1500, 220, 36, 0, 7); g.fill();
  const hill = (base: number, amp: number, col: string, ph: number) => {
    g.fillStyle = col; g.beginPath(); g.moveTo(0, 1024);
    for (let x = 0; x <= 2048; x += 8) g.lineTo(x, base - amp * (Math.sin((x / 2048) * Math.PI * 6 + ph) * 0.6 + Math.sin((x / 2048) * Math.PI * 14 + ph) * 0.4));
    g.lineTo(2048, 1024); g.fill();
  };
  hill(560, 60, "#1d3a33", 0); hill(600, 40, "#24503c", 2); hill(640, 25, "#2c5e44", 4);
  g.fillStyle = "#3a2a1e"; g.fillRect(0, 640, 2048, 384);
  // fire at center (front)
  const fx = 1024, fy = 700;
  const fg = g.createRadialGradient(fx, fy, 5, fx, fy, 220);
  fg.addColorStop(0, "rgba(255,210,120,.9)"); fg.addColorStop(1, "rgba(227,176,75,0)");
  g.fillStyle = fg; g.fillRect(fx - 220, fy - 220, 440, 440);
  g.fillStyle = "#e3b04b"; g.beginPath(); g.moveTo(fx - 30, fy + 20); g.quadraticCurveTo(fx, fy - 110, fx + 30, fy + 20); g.fill();
  g.fillStyle = "#c25a3a"; g.beginPath(); g.moveTo(fx - 18, fy + 20); g.quadraticCurveTo(fx, fy - 60, fx + 18, fy + 20); g.fill();
  // performers circle
  for (let i = 0; i < 14; i++) {
    const x = 640 + i * 56, y = 740 + Math.abs(i - 6.5) * -6;
    g.fillStyle = "#0d0b16";
    g.beginPath(); g.arc(x, y - 70, 12, 0, 7); g.fill();
    g.fillRect(x - 13, y - 58, 26, 66);
    if (i % 4 === 1) { g.fillStyle = "#c25a3a"; g.beginPath(); g.ellipse(x + 16, y - 30, 14, 18, 0, 0, 7); g.fill(); }
  }
  // drummers on right side
  for (let i = 0; i < 4; i++) { const x = 1380 + i * 60; g.fillStyle = "#0d0b16"; g.fillRect(x - 12, 690, 24, 60); g.beginPath(); g.arc(x, 678, 12, 0, 7); g.fill(); g.fillStyle = "#c25a3a"; g.beginPath(); g.ellipse(x, 740, 22, 12, 0, 0, 7); g.fill(); }
  g.fillStyle = "rgba(241,228,200,.6)"; g.font = "28px 'Noto Naskh Arabic'"; g.textAlign = "center";
  g.fillText("مشهد تجريبي — أضف صورة 360 خاصة بك", 1024, 960);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const toPos = (yaw: number, pitch: number, r = 40) => {
  const y = THREE.MathUtils.degToRad(yaw), p = THREE.MathUtils.degToRad(pitch);
  return new THREE.Vector3(r * Math.cos(p) * Math.sin(y), r * Math.sin(p), -r * Math.cos(p) * Math.cos(y));
};

function Sphere({ tex }: { tex: THREE.Texture }) {
  const geo = useMemo(() => { const g = new THREE.SphereGeometry(50, 64, 32); g.scale(-1, 1, 1); return g; }, []);
  return <mesh geometry={geo} rotation-y={-Math.PI / 2}><meshBasicMaterial map={tex} /></mesh>;
}

function Spot({ h, onOpen }: { h: Hotspot; onOpen: (h: Hotspot) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.15); });
  return (
    <mesh ref={ref} position={toPos(h.yaw, h.pitch)} onClick={(e) => { e.stopPropagation(); onOpen(h); }}
      onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
      <sphereGeometry args={[1.3, 24, 24]} />
      <meshBasicMaterial color="#e3b04b" transparent opacity={0.85} />
    </mesh>
  );
}

function Look({ view }: { view: React.MutableRefObject<{ lon: number; lat: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    const v = view.current; v.lat = Math.max(-80, Math.min(80, v.lat));
    camera.lookAt(toPos(v.lon, v.lat, 10));
  });
  return null;
}

export function Panorama({ onNext }: { onNext: () => void }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [card, setCard] = useState<Hotspot | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [gyro, setGyro] = useState(false);
  const view = useRef({ lon: 0, lat: 0 });
  const drag = useRef<{ x: number; y: number; lon: number; lat: number } | null>(null);

  useEffect(() => {
    new THREE.TextureLoader().load(site.panoramaPath, (t) => { t.colorSpace = THREE.SRGBColorSpace; setTex(t); }, undefined, () => setTex(drawPlaceholder()));
  }, []);

  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    if (!gyro) return;
    const f = (e: DeviceOrientationEvent) => { if (e.alpha == null || e.beta == null) return; view.current.lon = -e.alpha; view.current.lat = e.beta - 90; };
    window.addEventListener("deviceorientation", f);
    return () => window.removeEventListener("deviceorientation", f);
  }, [gyro]);

  const enableGyro = async () => {
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (D.requestPermission) { try { if ((await D.requestPermission()) !== "granted") return; } catch { return; } }
    setGyro((g) => !g);
  };

  const onFile = (f?: File) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; setTex(t); });
  };

  const open = (h: Hotspot) => { setCard(h); speak(h.text); setSeen((s) => new Set(s).add(h.id)); };

  return (
    <section className="relative h-full w-full touch-none select-none" aria-label="مشهد الهبوت 360"
      onPointerDown={(e) => (drag.current = { x: e.clientX, y: e.clientY, ...view.current })}
      onPointerMove={(e) => { const d = drag.current; if (!d) return; view.current.lon = d.lon - (e.clientX - d.x) * 0.2; view.current.lat = d.lat + (e.clientY - d.y) * 0.2; }}
      onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)}>
      <Canvas camera={{ fov: 75, position: [0, 0, 0.01] }} dpr={[1, 2]}>
        {tex && <Sphere tex={tex} />}
        {hotspots.map((h) => <Spot key={h.id} h={h} onOpen={open} />)}
        <Look view={view} />
      </Canvas>
      <div className="absolute inset-x-0 top-3 flex flex-wrap justify-center gap-2 px-3" onPointerDown={(e) => e.stopPropagation()}>
        <label className="btn-ghost cursor-pointer">
          📷 ارفع صورة 360
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <button className="btn-ghost" onClick={enableGyro} aria-pressed={gyro}>📱 {gyro ? "إيقاف الجيروسكوب" : "الجيروسكوب"}</button>
        {hotspots.map((h) => (
          <button key={h.id} className={`btn-ghost text-xs ${seen.has(h.id) ? "text-primary" : ""}`} onClick={() => { view.current.lon = h.yaw; view.current.lat = h.pitch; open(h); }}>
            {seen.has(h.id) ? "✓ " : "◉ "}{h.title}
          </button>
        ))}
      </div>
      <p className="pointer-events-none absolute inset-x-0 bottom-28 text-center text-sm text-muted-foreground">اسحب للتجوّل · اضغط على النقاط المضيئة</p>
      {card && (
        <div role="dialog" aria-label={card.title} className="absolute inset-x-4 bottom-28 mx-auto max-w-md rounded-2xl border bg-card p-5 glow-gold animate-fade-up" onPointerDown={(e) => e.stopPropagation()}>
          <h3 className="font-display text-xl text-primary">{card.title}</h3>
          <button className="mt-1 text-xs text-primary underline" onClick={() => speak(card.text)}>🔊 استمع</button>
          <p className="mt-2 leading-loose">{card.text}</p>
          <button className="btn-ghost mt-3" onClick={() => { stopSpeech(); setCard(null); }} autoFocus>إغلاق</button>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-background/90 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6" onPointerDown={(e) => e.stopPropagation()}>
        <button className="btn-gold w-full max-w-md justify-center py-4 text-lg font-bold glow-gold animate-pulse-glow md:text-xl" onClick={() => { stopSpeech(); onNext(); }}>🔐 {seen.size >= hotspots.length ? "إلى الأقفال الرقمية" : `اكتشف النقاط (${seen.size}/${hotspots.length}) أو تابع`}</button>
      </div>
    </section>
  );
}
