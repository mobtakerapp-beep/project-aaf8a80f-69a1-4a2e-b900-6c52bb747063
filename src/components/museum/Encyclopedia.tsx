import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { encyclopedia, PLACEHOLDER_NOTE } from "@/content";

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

function Guide({ text }: { text: string }) {
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="flex items-end gap-3">
      <svg viewBox="0 0 60 80" className="h-20 w-14 shrink-0" aria-hidden>
        <circle cx="30" cy="20" r="13" fill="var(--color-foreground)" />
        <path d="M17 16 Q30 2 43 16 L43 12 Q30 0 17 12Z" fill="var(--color-primary)" />
        <circle cx="25" cy="21" r="2" fill="var(--color-background)" /><circle cx="35" cy="21" r="2" fill="var(--color-background)" />
        <path d="M10 80 Q12 38 30 36 Q48 38 50 80Z" fill="var(--color-foreground)" />
        <path d="M30 36 L30 80" stroke="var(--color-primary)" strokeWidth="2" />
      </svg>
      <div className="relative rounded-2xl rounded-be-none border bg-muted p-3 text-sm leading-relaxed">
        <p>{text}</p>
        <button className="mt-2 text-xs text-primary underline" onClick={speak}>🔊 استمع للمرشد</button>
      </div>
    </div>
  );
}

export function Encyclopedia({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const p = encyclopedia[page];
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
            <p className="mt-1 text-xs text-accent">{PLACEHOLDER_NOTE}</p>
            <p className="mt-3 leading-loose">{p.text}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {p.image ? <img src={p.image} alt={p.imageCaption} className="aspect-video w-full rounded-xl object-cover" /> : (
                <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed text-sm text-muted-foreground">🖼️ {p.imageCaption}</div>
              )}
              <div className="flex flex-col justify-center gap-2 rounded-xl border bg-muted p-3">
                <span className="text-sm text-muted-foreground">🎧 التسجيل الصوتي للصفحة</span>
                {p.audio ? <audio controls src={p.audio} className="w-full" /> : <span className="text-xs">مكان ملف صوتي (يُضاف في content.ts)</span>}
              </div>
            </div>
            <div className="mt-5"><Guide text={p.guide} /></div>
          </article>
          <div className="mt-6 flex justify-between">
            <button className="btn-ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>→ السابقة</button>
            {page < encyclopedia.length - 1
              ? <button className="btn-ghost" onClick={() => setPage(page + 1)}>التالية ←</button>
              : <button className="btn-gold" onClick={onNext}>ادخل مشهد الهبوت</button>}
          </div>
        </div>
      )}
    </section>
  );
}
