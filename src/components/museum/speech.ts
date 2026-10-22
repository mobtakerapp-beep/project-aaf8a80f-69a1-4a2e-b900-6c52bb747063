// Arabic text-to-speech helper. Prefers a mature-sounding Arabic voice when the browser exposes one.
export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const s = window.speechSynthesis;
  s.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.9;
  utterance.pitch = 0.82;
  const voices = s.getVoices().filter((voice) => voice.lang?.toLowerCase().startsWith("ar"));
  // Browsers do not reliably expose voice gender; choose a likely male voice if its name identifies one.
  const maleVoice = voices.find((voice) => /male|hamza|majed|tarik|naayf|hamed|abdul/i.test(voice.name));
  const selectedVoice = maleVoice ?? voices.find((voice) => /saudi|ar-sa/i.test(voice.name + " " + voice.lang)) ?? voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;
  if (onEnd) utterance.onend = onEnd;
  s.speak(utterance);
}
export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
