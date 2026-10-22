import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { site } from "@/content";
import { makeTextTexture } from "./hooks";

function drawMedalFace(g: CanvasRenderingContext2D, w: number, cx = w / 2, cy = w / 2, r = w / 2) {
  const grad = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  grad.addColorStop(0, "#fbe3a0"); grad.addColorStop(0.6, "#e3b04b"); grad.addColorStop(1, "#8a6420");
  g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
  g.strokeStyle = "#171433"; g.lineWidth = r * 0.03; g.beginPath(); g.arc(cx, cy, r * 0.85, 0, 7); g.stroke();
  g.fillStyle = "#171433"; g.textAlign = "center"; g.direction = "rtl";
  g.font = `bold ${r * 0.5}px 'Reem Kufi'`; g.fillText("هبوت", cx, cy + r * 0.1);
  g.font = `${r * 0.15}px 'Reem Kufi'`; g.fillText(site.medalTitle, cx, cy + r * 0.45);
}

function Medal() {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeTextTexture((g, w) => drawMedalFace(g, w)));
    t.colorSpace = THREE.SRGBColorSpace; t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; return t;
  }, []);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.8; });
  return (
    <group ref={ref}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[1.5, 1.5, 0.18, 64]} />
        <meshStandardMaterial attach="material-0" color="#c99a3a" metalness={0.9} roughness={0.3} />
        <meshStandardMaterial attach="material-1" map={tex} metalness={0.5} roughness={0.4} />
        <meshStandardMaterial attach="material-2" map={tex} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

async function drawCertificate(name: string) {
  await Promise.all([document.fonts.load("60px 'Reem Kufi'"), document.fonts.load("40px 'Noto Naskh Arabic'")]).catch(() => {});
  const W = 1600, H = 1131;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const bg = g.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.7);
  bg.addColorStop(0, "#221d4a"); bg.addColorStop(1, "#171433");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = "#e3b04b"; g.lineWidth = 10; g.strokeRect(40, 40, W - 80, H - 80);
  g.lineWidth = 3; g.strokeRect(70, 70, W - 140, H - 140);
  g.direction = "rtl"; g.textAlign = "center";
  g.fillStyle = "#e3b04b"; g.font = "bold 84px 'Reem Kufi'"; g.fillText("شهادة حارس التراث", W / 2, 210);
  g.fillStyle = "#f1e4c8"; g.font = "38px 'Noto Naskh Arabic'"; g.fillText("تُمنح هذه الشهادة إلى المستكشف", W / 2, 300);
  g.fillStyle = "#e3b04b"; g.font = "bold 96px 'Reem Kufi'"; g.fillText(name, W / 2, 430);
  g.fillStyle = "#f1e4c8"; g.font = "36px 'Noto Naskh Arabic'";
  g.fillText("لنجاحه في فكّ «شيفرة الهبوت» واستكشاف ذاكرة ظفار الرقمية،", W / 2, 520);
  g.fillText(`ونيله وسام «${site.medalTitle}»`, W / 2, 575);
  drawMedalFace(g, 0, W / 2, 770, 140);
  g.fillStyle = "#4c9a68"; g.font = "30px 'Noto Naskh Arabic'"; g.fillText(site.closing, W / 2, 990);
  g.fillStyle = "#f1e4c8"; g.font = "26px 'Reem Kufi'"; g.fillText(site.title + " · " + new Date().toLocaleDateString("ar-OM"), W / 2, 1040);
  return c.toDataURL("image/png");
}

export function Certificate({ onRestart }: { onRestart: () => void }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const make = async () => { setBusy(true); setImg(await drawCertificate(name.trim())); setBusy(false); };

  return (
    <section className="mx-auto flex h-full w-full max-w-3xl flex-col items-center overflow-y-auto px-4 py-6 text-center" aria-label="الوسام والشهادة">
      <div className="h-56 w-full md:h-72">
        {ready && <img src={site.medalImage} alt={`وسام ${site.medalTitle}`} className="mx-auto h-full w-auto object-contain drop-shadow-2xl animate-fade-up" />}
      </div>
      <h2 className="font-display text-3xl text-primary text-glow">{site.medalTitle}</h2>
      <form className="mt-5 flex w-full max-w-md flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (name.trim()) make(); }}>
        <label htmlFor="name" className="text-sm text-muted-foreground">اكتب اسمك كما تريده في الشهادة</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40}
          className="rounded-full border bg-card px-5 py-3 text-center text-lg" placeholder="الاسم" />
        <button type="submit" className="btn-gold" disabled={!name.trim() || busy}>{busy ? "جارٍ الإنشاء…" : "أنشئ الشهادة كصورة"}</button>
      </form>
      {img && (
        <div className="mt-6 w-full animate-fade-up">
          <img src={img} alt={`شهادة ${name}`} className="w-full rounded-xl border glow-gold" />
          <p className="mt-2 text-xs text-muted-foreground">على الهاتف: اضغط مطوّلًا على الصورة لحفظها</p>
          <a href={img} download="shahadat-habout.png" className="btn-gold mt-3">⬇ تحميل الشهادة</a>
        </div>
      )}
      <p className="mt-8 font-display text-xl leading-relaxed text-glow">{site.closing}</p>
      <button className="btn-ghost mt-4" onClick={onRestart}>ابدأ من جديد</button>
    </section>
  );
}
