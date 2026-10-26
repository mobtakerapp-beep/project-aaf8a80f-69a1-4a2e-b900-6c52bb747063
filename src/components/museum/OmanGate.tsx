import { site } from "@/content";

export function OmanGate({ reduced, onNext }: { reduced: boolean; onNext: () => void }) {
  return (
    <section
      className="relative h-full w-full overflow-hidden bg-black"
      aria-label="مقدمة اللعبة — فريق سراج عُمان"
    >
      <button
        type="button"
        onClick={onNext}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer"
        aria-label="الانتقال إلى اللعبة"
      >
        <img
          src="/IMG_6153.PNG"
          alt="شعار وزارة التعليم العُمانية وبيانات فريق سراج عُمان ومدرسة زينب بنت الرسول للتعليم الأساسي، ٢٠٢٦"
          className="h-full w-full object-contain"
          fetchPriority="high"
        />
      </button>
    </section>
  );
}
