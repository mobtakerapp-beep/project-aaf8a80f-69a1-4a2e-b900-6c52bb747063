import { useState } from "react";
import { locks, QUIZ_NOTE, site } from "@/content";

export function Decode({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState<boolean[]>(locks.map(() => false));
  const [active, setActive] = useState(0);
  const [shake, setShake] = useState(false);
  const all = opened.every(Boolean);
  const lock = locks[active] ?? locks[0]!;

  const answer = (i: number) => {
    if (i === lock.answer) {
      const n = [...opened]; n[active] = true; setOpened(n);
      const next = n.findIndex((o) => !o); if (next >= 0) setActive(next);
    } else { setShake(false); requestAnimationFrame(() => setShake(true)); }
  };

  return (
    <section className="mx-auto flex h-full w-full max-w-3xl flex-col items-center overflow-y-auto px-4 py-8 text-center" aria-label="فك شيفرة التراث">
      <h2 className="font-display text-3xl text-glow">فكّ شيفرة التراث</h2>
      <p className="mt-1 text-xs text-accent">{QUIZ_NOTE}</p>
      <div className="mt-8 flex gap-4">
        {locks.map((l, i) => (
          <button key={l.letter} onClick={() => !opened[i] && setActive(i)} aria-label={`القفل ${l.letter}${opened[i] ? " مفتوح" : ""}`}
            className={`flex h-24 w-20 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500 md:h-32 md:w-28 ${opened[i] ? "border-primary bg-primary text-primary-foreground glow-gold" : i === active ? "border-primary bg-card animate-pulse-glow" : "bg-card"}`}>
            <span className="text-xl">{opened[i] ? "🔓" : "🔒"}</span>
            <span className="font-display text-4xl md:text-5xl">{l.letter}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 min-h-8 font-display text-xl text-primary">
        {locks.map((l, i) => (opened[i] ? l.reveal : "•••")).join(" · ")}
      </p>
      {!all ? (
        <div key={active} className={`mt-6 w-full rounded-2xl border bg-card p-5 ${shake ? "animate-shake" : ""}`} onAnimationEnd={() => setShake(false)}>
          <p className="font-display text-lg">القفل «{lock.letter}»: {lock.question}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {lock.options.map((o, i) => <button key={o} className="btn-ghost justify-center py-3 text-base" onClick={() => answer(i)}>{o}</button>)}
          </div>
          {shake && <p className="mt-3 text-sm text-accent" role="alert">إجابة غير صحيحة… حاول مرة أخرى</p>}
        </div>
      ) : (
        <div className="mt-8 animate-fade-up">
          <p className="font-display text-2xl leading-relaxed text-glow">{site.decodeSuccess}</p>
          <button className="btn-gold mt-6" onClick={onNext}>استلم وسامك</button>
        </div>
      )}
    </section>
  );
}
