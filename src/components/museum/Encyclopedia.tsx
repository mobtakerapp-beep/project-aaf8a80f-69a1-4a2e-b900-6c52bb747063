import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { encyclopedia, SOURCE_LINE, site } from "@/content";
import { OptionalImage } from "./OptionalImage";
import { speak, stopSpeech } from "./speech";

function Book({ open, onClick }: { open: boolean; onClick: () => void }) {
  const cover = useRef<THREE.Group>(null);
  const grp = useRef<THREE.Group>(null);
  useFrame(({ clock }, d) => {
    if (cover.current) cover.current.rotation.y = THREE.MathUtils.damp(cover.current.rotation.y, open ? -Math.PI * 0.95 : 0, 3, d);
    if (grp.current) grp.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });
  return (
    <group ref={grp} rotation={[0.5, 0, 0]} onClick={onClick} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
      <mesh position={[1, 0, -0.1]}>
        <boxGeometry args={[2, 2.8, 0.2]} />
        <meshStandardMaterial color="#f1e4c8" emissive="#e3b04b" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[1, 0, -0.25]}>
        <boxGeometry args={[2.05, 2.85, 0.08]} />
        <meshStandardMaterial color="#064e3b" />
      </mesh>
      <group ref={cover}>
        <mesh position={[1, 0, 0.04]}>
          <boxGeometry args={[2.05, 2.85, 0.08]} />
          <meshStandardMaterial color="#064e3b" emissive="#e3b04b" emissiveIntensity={0.15} metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[1, 0, 0.09]}>
          <ringGeometry args={[0.45, 0.55, 8]} />
          <meshStandardMaterial color="#e3b04b" emissive="#e3b04b" emissiveIntensity={0.7} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[1, 0, 0.095]}>
          <circleGeometry args={[0.36, 32]} />
          <meshStandardMaterial color="#0b3b2e" metalness={0.35} roughness={0.5} />
        </mesh>
      </group>
      <pointLight position={[1, 0, 1.5]} color="#e3b04b" intensity={5} distance={6} />
    </group>
  );
}

function Guide({ text, intro }: { text: string; intro?: string }) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#fffaf0] to-amber-50 p-4 text-sm leading-loose text-[#26382f] shadow-inner sm:p-5">
      {intro && <p className="mb-2 font-display font-bold text-emerald-900">{intro}</p>}
      <p>{text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-amber-900/15 pt-3">
        <button className="rounded-full bg-emerald-900 px-4 py-2 text-xs font-semibold text-amber-50 shadow hover:bg-emerald-800" onClick={() => speak(text)}>🔊 استمع للحكاية</button>
        <button className="rounded-full border border-emerald-900/25 px-4 py-2 text-xs text-emerald-950 hover:bg-emerald-900/5" onClick={stopSpeech}>⏹ إيقاف الصوت</button>
        <span className="text-[11px] text-emerald-950/60">استمعي للحكاية بالصوت العربي المتاح على جهازك</span>
      </div>
    </div>
  );
}

export function Encyclopedia({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const greeted = useRef(false);
  useEffect(() => setReady(true), []);
  useEffect(() => () => stopSpeech(), []);
  const p = encyclopedia[page] ?? encyclopedia[0];
  const pageText = p ? p.guide || p.text : "";
  useEffect(() => {
    if (!open || !pageText) return;
    if (!greeted.current) { greeted.current = true; speak(site.narratorGreeting, () => speak(pageText)); }
    else speak(pageText);
  }, [open, page, pageText]);
  if (!p) return null;

  return (
    <section className="flex h-full w-full flex-col overflow-y-auto bg-gradient-to-b from-emerald-950/[0.04] via-background to-amber-500/[0.05]" aria-label="الموسوعة العُمانية الذكية">
      <div className={`relative w-full shrink-0 overflow-hidden transition-all duration-700 ${open ? "h-40" : "h-[60vh]"}`}>
        <div className="pointer-events-none absolute inset-x-6 top-4 z-10 rounded-2xl border border-amber-500/30 bg-emerald-950/90 px-4 py-3 text-center text-amber-100 shadow-lg">
          <p className="font-display text-xs tracking-widest text-amber-300">حكايات من أرض اللبان</p>
          <h2 className="mt-1 font-display text-xl sm:text-2xl">شيفرة الهبوت</h2>
          <p className="mt-1 text-xs text-emerald-100/90">ذاكرة ظفار الرقمية</p>
        </div>
        {ready && (
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 3, 4]} intensity={1} />
            <group position={[-1, 0, 0]}><Book open={open} onClick={() => setOpen(true)} /></group>
          </Canvas>
        )}
        {!open && (
          <div className="absolute inset-x-0 bottom-4 text-center">
            <h2 className="font-display text-2xl text-glow">الموسوعة العُمانية الذكية</h2>
            <p className="mt-1 text-sm font-medium text-amber-300 drop-shadow" dir="rtl">ص ٣٧٣٩–٣٧٤٠</p>
            <button className="btn-gold mt-3 shadow-lg" onClick={() => setOpen(true)}>✦ افتح الكتاب واكتشف الحكاية ✦</button>
          </div>
        )}
      </div>
      {open && (
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 animate-fade-up">
          <div className="mb-3 text-center" dir="rtl"><p className="text-base font-bold text-foreground">الموسوعة العُمانية الذكية</p><p className="mt-1 text-sm font-semibold text-foreground">الصفحات: ٣٧٣٩–٣٧٤٠</p></div>
          <div role="tablist" className="mb-4 flex flex-wrap justify-center gap-2">
            {encyclopedia.map((e, i) => (
              <button key={e.tab} role="tab" aria-selected={i === page} onClick={() => setPage(i)}
                className={`rounded-full border px-4 py-1.5 font-display text-sm ${i === page ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                {e.tab}
              </button>
            ))}
          </div>
          <article role="tabpanel" className="overflow-hidden rounded-3xl border border-amber-500/25 bg-card/95 p-4 shadow-xl sm:p-6">
            <div className="mb-4 h-1.5 w-24 rounded-full bg-gradient-to-l from-amber-300 via-amber-600 to-emerald-800" />
            <h3 className="font-display text-2xl text-primary sm:text-3xl">{p.title}</h3>
            <p className="mt-3 leading-loose">{p.text}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {p.image ? <img src={p.image} alt={p.imageCaption} className="aspect-video w-full rounded-xl object-cover" /> : (
                <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed text-sm text-muted-foreground">🖼️ {p.imageCaption}</div>
              )}

            </div>
            <div className="mt-5"><Guide text={pageText} intro={page === 0 ? site.narratorGreeting : undefined} /></div>
          </article>
          <div className="mt-6 flex justify-between">
            <button className="btn-ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>→ السابقة</button>
            {page < encyclopedia.length - 1
              ? <button className="btn-ghost" onClick={() => setPage(page + 1)}>التالية ←</button>
              : <button className="btn-gold" onClick={onNext}>ادخل مشهد الهبوت</button>}
          </div>
        </div>
      )}
      <p className="mx-auto px-4 pb-4 text-center text-xs text-muted-foreground">{SOURCE_LINE}</p>
    </section>
  );
}
