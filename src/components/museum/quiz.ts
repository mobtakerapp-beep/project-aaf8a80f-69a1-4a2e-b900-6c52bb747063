import type { Lock } from "@/content";

export function shuffleLock(lock: Lock, random = Math.random): Lock {
  const options = lock.options.map((text, originalIndex) => ({ text, originalIndex }));
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = options[i];
    const b = options[j];
    if (a && b) { options[i] = b; options[j] = a; }
  }
  return { ...lock, options: options.map((o) => o.text), answer: options.findIndex((o) => o.originalIndex === lock.answer) };
}