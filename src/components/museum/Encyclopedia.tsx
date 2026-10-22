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
        <meshStandardMaterial color="#c25a3a" />
      </mesh>
      <group ref={cover}>
        <mesh position={[1, 0, 0.04]}>
          <boxGeometry args={[2.05, 2.85, 0.08]} />
          <meshStandardMaterial color="#c25a3a" emissive="#e3b04b" emissiveIntensity={0.15} metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[1, 0, 0.09]}>
          <ringGeometry args={[0.45, 0.55, 8]} />
          <meshStandardMaterial color="#e3b04b" emissive="#e3b04b" emissiveIntensity={1.2} />
        </mesh>
      </group>
      <pointLight position={[1, 0, 1.5]} color="#e3b04b" intensity={5} distance={6} />
    </group>
  );
}

function Guide({ text, intro }: { text: string; intro?: string }) {
  return (
    <div className="flex items-end gap-3">
      <OptionalImage src="/images/characters/grandfather.png" alt="الجد الراوي العُماني" className="h-32 w-24 shrink-0 object-contain" />
      <div className="relative rounded-2xl rounded-be-none border bg-muted p-3 text-sm leading-relaxed">
        {intro && <p className="mb-2 font-display text-primary">{intro}</p>}
        <p>{text}</p>
        <div className="mt-2 flex gap-3">
          <button className="text-xs text-primary underline" onClick={() => speak(text)}>🔊 استمع</button>
          <button className="text-xs text-muted-foreground underline" onClick={stopSpeech}>⏸ إيقاف</button>
        </div>
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
    <section className="flex h-full w-full flex-col overflow-y-auto" aria-label="الموسوعة العُمانية الذكية">
      <div className={`relative w-full shrink-0 transition-all duration-700 ${open ? "h-40" : "h-[60vh]"}`}>
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
            <button className="btn-gold mt-3" onClick={() => setOpen(true)}>افتح الكتاب</button>
          </div>
        )}
      </div>
      {open && (
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 animate-fade-up">
          <div role="tablist" className="mb-4 flex flex-wrap justify-center gap-2">
            {encyclopedia.map((e, i) => (
              <button key={e.tab} role="tab" aria-selected={i === page} onClick={() => setPage(i)}
                className={`rounded-full border px-4 py-1.5 font-display text-sm ${i === page ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                {e.tab}
              </button>
            ))}
          </div>
          <article role="tabpanel" className="rounded-2xl border bg-card p-5 glow-gold">
            <h3 className="font-display text-2xl text-primary">{p.title}</h3>
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
