import { useEffect, useRef, useState } from "react";
import { site, steps } from "@/content";
import { useReducedMotion } from "./hooks";
import { OmanGate } from "./OmanGate";
import { Encyclopedia } from "./Encyclopedia";
import { Panorama } from "./Panorama";
import { Decode } from "./Decode";
import { Certificate } from "./Certificate";

function Opener({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const [show, setShow] = useState(false);
  const [lift, setLift] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), reduced ? 300 : 3500); return () => clearTimeout(t); }, [reduced]);
  return (
    <section className={`flex h-full flex-col items-center justify-center gap-10 px-6 text-center transition-colors duration-[1500ms] ${lift ? "bg-night" : "bg-void"}`}>
      <h1 className="font-display text-3xl leading-relaxed text-muted-foreground animate-fade-up md:text-5xl">{site.opener}</h1>
      <button className={`btn-gold transition-opacity duration-1000 ${show ? "opacity-100" : "pointer-events-none opacity-0"}`} tabIndex={show ? 0 : -1}
        onClick={() => { setLift(true); setTimeout(onNext, reduced ? 0 : 1200); }}>
        {site.openerButton}
      </button>
    </section>
  );
}

function AmbientToggle() {
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const toggle = () => {
    if (on) { if (timer.current) clearInterval(timer.current); ctx.current?.close(); ctx.current = null; setOn(false); return; }
    const a = new AudioContext(); ctx.current = a;
    const master = a.createGain(); master.gain.value = 0.15; master.connect(a.destination);
    [110, 165].forEach((f) => { const o = a.createOscillator(); o.frequency.value = f; const gg = a.createGain(); gg.gain.value = 0.25; o.connect(gg).connect(master); o.start(); });
    let n = 0;
    timer.current = window.setInterval(() => {
      const o = a.createOscillator(); const gg = a.createGain(); o.frequency.value = n % 4 === 0 ? 70 : 110;
      gg.gain.setValueAtTime(0.9, a.currentTime); gg.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.25);
      o.connect(gg).connect(master); o.start(); o.stop(a.currentTime + 0.3); n++;
    }, 450);
    setOn(true);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); ctx.current?.close(); }, []);
  return <button className="btn-ghost text-xs" onClick={toggle} aria-pressed={on}>{on ? "🔊 الصوت: يعمل" : "🔇 الصوت: متوقف"}</button>;
}

export function Museum() {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  useEffect(() => setMaxStep((m) => Math.max(m, step)), [step]);
  const reduced = useReducedMotion();
  const next = () => setStep((s) => Math.min(5, s + 1));
  return (
    <main dir="rtl" lang="ar" className="fixed inset-0 flex flex-col bg-night">
      {step > 0 && (
        <header className="z-20 flex items-center justify-between gap-3 border-b bg-card/80 px-3 py-2 backdrop-blur">
          <span className="hidden font-display text-sm text-primary md:block">{site.title}</span>
          <span className="shrink-0 rounded-full border border-primary/40 px-2 py-1 text-[10px] font-medium text-primary md:text-xs whitespace-nowrap" aria-label="أرقام الصفحات">ص ٣٧٣٩–٣٧٤٠</span>
          <ol className="flex flex-1 items-center gap-1 md:max-w-lg" aria-label="مراحل الرحلة">
            {steps.map((s, i) => (
              <li key={s} className="flex-1" aria-current={i + 1 === step ? "step" : undefined}>
                <button type="button" disabled={i + 1 > maxStep} onClick={() => setStep(i + 1)} aria-label={`انتقل إلى: ${s}`}
                  className="block w-full py-1 disabled:cursor-not-allowed disabled:opacity-50">
                  <div className={`h-1.5 rounded-full transition-colors duration-500 ${i + 1 <= step ? "bg-primary" : "bg-muted"}`} />
                  <span className={`mt-1 block text-center text-[10px] md:text-xs ${i + 1 === step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                </button>
              </li>
            ))}
          </ol>
          <AmbientToggle />
        </header>
      )}
      <div key={step} className="relative min-h-0 flex-1 animate-fade-up">
        {step === 0 && <Opener onNext={next} reduced={reduced} />}
        {step === 1 && <OmanGate reduced={reduced} onNext={next} />}
        {step === 2 && <Encyclopedia onNext={next} />}
        {step === 3 && <Panorama onNext={next} />}
        {step === 4 && <Decode onNext={next} />}
        {step === 5 && <Certificate onRestart={() => setStep(0)} />}
      </div>
    </main>
  );
}
