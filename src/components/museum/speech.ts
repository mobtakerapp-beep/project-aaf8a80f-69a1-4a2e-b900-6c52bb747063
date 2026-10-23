// Arabic narration helper: prefer an available Arabic masculine voice and use a lower pitch.
export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const speakWithAvailableVoice = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.88;
    utterance.pitch = 0.72;

    const voices = synth.getVoices().filter((voice) =>
      voice.lang?.toLowerCase().startsWith("ar")
    );
    // Voice gender metadata is not standardized, so prefer Arabic voices whose names
    // commonly identify a masculine voice, then Saudi Arabic, then any Arabic voice.
    const maleVoice = voices.find((voice) =>
      /male|hamza|majed|tarik|tariq|naayf|nayef|hamed|hamid|abdul|mohammed|muhammad|omar|ahmed|arabic.*male/i.test(voice.name)
    );
    const selectedVoice =
      maleVoice ??
      voices.find((voice) => /saudi|ar-sa/i.test(voice.name + " " + voice.lang)) ??
      voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "ar-SA";
    }
    if (onEnd) utterance.onend = onEnd;
    synth.speak(utterance);
  };

  // Some browsers load their voice list asynchronously.
  if (synth.getVoices().length > 0) {
    speakWithAvailableVoice();
  } else {
    const onVoicesChanged = () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      speakWithAvailableVoice();
    };
    synth.addEventListener("voiceschanged", onVoicesChanged);
    window.setTimeout(() => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      if (synth.speaking || synth.pending) return;
      speakWithAvailableVoice();
    }, 800);
  }
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
