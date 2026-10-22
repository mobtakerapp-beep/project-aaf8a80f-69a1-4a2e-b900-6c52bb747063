// Arabic text-to-speech helper. Cancels previous speech before speaking.
export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  const arabicVoices = s.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("ar"));
  // Prefer commonly named male Arabic voices when the device provides them.
  const maleVoice = arabicVoices.find((v) => /male|majid|majed|hamed|hamid|naayf|tarik|salim|maged|arabic.*(male|man)/i.test(v.name));
  const voice = maleVoice ?? arabicVoices.find((v) => /ar-sa|saudi|arabic/i.test(v.lang + " " + v.name));
  if (voice) u.voice = voice;
  // A slightly lower pitch and measured pace suit the heritage narrator.
  u.pitch = 0.82;
  u.rate = 0.92;
  if (onEnd) u.onend = onEnd;
  s.speak(u);
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
