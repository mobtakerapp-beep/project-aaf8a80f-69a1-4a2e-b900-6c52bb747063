// =====================================================================
// كل محتوى المتحف في ملف واحد — استبدل النصوص التجريبية بنصوص الموسوعة العُمانية
// =====================================================================

export const PLACEHOLDER_NOTE = "نص تجريبي — يُستبدل بنص مدخل الهبوت من الموسوعة العُمانية";
export const IMAGES_NOTE = "الصور الحالية مولّدة بالذكاء الاصطناعي لأغراض توضيحية فقط، ويجب استبدالها بصور موثّقة من الموسوعة العُمانية قبل التسليم.";
export const QUIZ_NOTE = "أسئلة تجريبية — تُستبدل بأسئلة من مدخل الهبوت في الموسوعة";

export const site = {
  title: "شيفرة الهبوت… ذاكرة ظفار الرقمية",
  opener: "ماذا لو اختفى الهبوت من ذاكرتنا؟",
  openerButton: "أعِد إحياءه",
  gateText: "لقد وصلت إلى ظفار… هل أنت مستعد لاكتشاف شيفرة الهبوت؟",
  gateButton: "ابدأ الرحلة",
  decodeSuccess: "أحسنت! لقد فككت الشيفرة. التراث ذاكرة وطن، وحفظه مسؤولية الأجيال.",
  medalTitle: "حارس التراث الظفاري",
  closing: "حين نحفظ تراثنا بالمعرفة، ونحييه بالتقنية… فإننا نمنحه مستقبلًا لا ينتهي.",
  panoramaPath: "/panorama.jpg", // صورة توضيحية مولّدة — انظر IMAGES_NOTE
  gateCover: "/images/gate-cover.jpg",
  medalImage: "/images/medal.png",
};

export const steps = ["البوابة", "الموسوعة", "المشهد", "الشيفرة", "الوسام"];

export type EncyclopediaPage = {
  tab: string;
  title: string;
  text: string;
  image?: string; // مسار صورة مضمّنة مثل "/images/habout-1.jpg"
  imageCaption: string;
  audio?: string; // مسار ملف صوتي مثل "/audio/page1.mp3"
  guide: string; // ما يقوله المرشد الرقمي
};

export const encyclopedia: EncyclopediaPage[] = [
  {
    tab: "التعريف",
    title: "ما هو الهبوت؟",
    text: "الهبوت فنٌّ شعبي جماعي من فنون محافظة ظفار، يؤدّيه الرجال في صفوف متقابلة مصحوبًا بالإيقاع والإنشاد، ويرتبط بالمناسبات الاجتماعية والاحتفالات. (" + PLACEHOLDER_NOTE + ")",
    image: "/images/performance.jpg",
    imageCaption: "صورة توضيحية: صفوف المؤدّين",
    guide: "مرحبًا أيها المستكشف! أنا دليلك التراثي. هذه أول صفحة في سجلّ الهبوت.",
  },
  {
    tab: "الأداء",
    title: "طريقة الأداء",
    text: "يتقدّم المؤدّون بخطوات منتظمة متناغمة، ويتبادلون الأبيات بين الصفوف، فيما يضبط الإيقاع حركة الجماعة. (" + PLACEHOLDER_NOTE + ")",
    image: "/images/performance.jpg",
    imageCaption: "صورة توضيحية: حركة الصفوف",
    guide: "لاحظ كيف تتحرك الجماعة كقلب واحد… هنا يكمن سرّ الشيفرة الأول.",
  },
  {
    tab: "الإيقاع",
    title: "الإيقاع والأدوات",
    text: "يعتمد الهبوت على الطبول والتصفيق والإنشاد الجماعي، ولكل إيقاع دلالته ومناسبته. (" + PLACEHOLDER_NOTE + ")",
    image: "/images/drums.jpg",
    imageCaption: "صورة توضيحية: الطبول",
    guide: "أنصت جيدًا للإيقاع، فهو لغة تتوارثها الأجيال.",
  },
  {
    tab: "المكان",
    title: "بيئة ظفار",
    text: "تحتضن ظفار جبالًا خضراء في موسم الخريف وسهولًا وسواحل، وقد انعكست هذه البيئة على فنونها وأشعارها. (" + PLACEHOLDER_NOTE + ")",
    image: "/images/landscape.jpg",
    imageCaption: "صورة توضيحية: جبال ظفار في الخريف",
    guide: "احفظ ما تعلّمته… فالأقفال الرقمية تنتظرك!",
  },
];

export type Hotspot = { id: string; yaw: number; pitch: number; title: string; text: string };

// yaw: زاوية أفقية بالدرجات (0 = أمام المشاهد)، pitch: زاوية رأسية
export const hotspots: Hotspot[] = [
  { id: "group", yaw: 0, pitch: -8, title: "الأداء الجماعي", text: "يقف المؤدّون في صفوف متقابلة ويؤدّون بروح الجماعة. (" + PLACEHOLDER_NOTE + ")" },
  { id: "rhythm", yaw: 70, pitch: -12, title: "الإيقاع", text: "الطبول والتصفيق تضبط خطوات المؤدّين وتمنح الفن روحه. (" + PLACEHOLDER_NOTE + ")" },
  { id: "dress", yaw: -75, pitch: -10, title: "الزي التقليدي", text: "يرتدي المؤدّون الزي العُماني التقليدي بألوانه وتفاصيله. (" + PLACEHOLDER_NOTE + ")" },
  { id: "env", yaw: 170, pitch: 6, title: "البيئة الظفارية", text: "جبال ظفار وليالي الخريف تشكّل خلفية هذا الفن. (" + PLACEHOLDER_NOTE + ")" },
];

export type Lock = { letter: string; question: string; options: string[]; answer: number; reveal: string };

export const locks: Lock[] = [
  { letter: "ه", question: "في أي محافظة عُمانية يشتهر فن الهبوت؟", options: ["مسندم", "ظفار", "الداخلية"], answer: 1, reveal: "التراث" },
  { letter: "ب", question: "ما الذي يضبط حركة المؤدّين في الهبوت؟", options: ["الإيقاع", "الصمت", "الإضاءة"], answer: 0, reveal: "ذاكرة" },
  { letter: "و", question: "كيف يُؤدّى الهبوت عادةً؟", options: ["أداء فردي", "أداء جماعي", "عرض مسرحي"], answer: 1, reveal: "وطن" },
];
