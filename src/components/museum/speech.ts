// Arabic text-to-speech helper. Cancels previous speech before speaking.
export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  const voice = s.getVoices().find((v) => v.lang?.toLowerCase().startsWith("ar"));
  if (voice) u.voice = voice;
  if (onEnd) u.onend = onEnd;
  s.speak(u);
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
