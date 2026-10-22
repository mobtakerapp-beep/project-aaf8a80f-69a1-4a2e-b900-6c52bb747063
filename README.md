# شيفرة الهبوت

Build an Arabic (RTL) interactive 3D virtual museum website titled «شيفرة الهبوت… ذاكرة ظفار الرقمية» (The Habout Code: Dhofar's Digital Memory). It is a competition entry about Habout, a traditional folk art of Dhofar, Oman, based on the Omani Encyclopedia. The judge enters through an electronic gate and becomes an explorer who decodes heritage. All UI text in Arabic, dir=rtl, mobile-first, fonts Reem Kufi (headings) + Noto Naskh Arabic (body). Palette: night indigo #171433, deeper #221d4a, frankincense gold #e3b04b, khareef green #4c9a68, drum-leather rust #c25a3a, sand #f1e4c8. Use three.js / @react-three/fiber for real 3D.

Flow (single-page, 6 screens with a 5-step progress bar):
0. Opener: fully dark silent screen with the text «ماذا لو اختفى الهبوت من ذاكرتنا؟». After a few seconds a button «أعِد إحياءه» fades in and lifts the darkness.
1. Digital time gate: a 3D stylised map of Oman on screen; Dhofar (south-west) glows, the camera zooms cinematically into it, then the text «لقد وصلت إلى ظفار… هل أنت مستعد لاكتشاف شيفرة الهبوت؟» and a button «ابدأ الرحلة».
2. Smart Omani Encyclopedia: a glowing 3D book that opens on click; pages (tabs) with documented text about Habout, image slots, an audio-player slot per page, and a small digital heritage guide character that narrates. Use clearly marked placeholder text («نص تجريبي — يُستبدل بنص مدخل الهبوت من الموسوعة العُمانية») and keep all content in one editable data file (content.ts) so it is easy to replace.
3. 360° Habout scene: a three.js panorama sphere viewer (drag/touch to look around, gyroscope optional). It must load a panoramic image from a single file path (public/panorama.jpg) and include an upload button so the user can pick their own 360/wide photo from their device and apply it instantly. Until a photo is provided, show a simple night scene of Dhofar hills with a drum circle and a fire as a procedural placeholder. Add 4 glowing interactive hotspots (group performance, rhythm, traditional dress, Dhofari environment) that open an info card; hotspot positions and texts are in content.ts.
4. Decode the heritage code: three digital locks showing letters ه، ب، و. Each opens only after answering a multiple-choice question from content.ts (wrong answer = shake + retry, correct = lock opens with a glow and reveals part of the hidden message). Questions are illustrative placeholders marked «أسئلة تجريبية — تُستبدل بأسئلة من مدخل الهبوت في الموسوعة». After all three: «أحسنت! لقد فككت الشيفرة. التراث ذاكرة وطن، وحفظه مسؤولية الأجيال.»
5. Medal and certificate: a 3D rotating medal «حارس التراث الظفاري». The participant types their name and a button «أنشئ الشهادة كصورة» draws the certificate on a canvas (Arabic text, gold double border, medal, name) and shows it as a PNG image with a Download button (and a note to long-press the image to save on phones). Do NOT rely on window.print. Closing line: «حين نحفظ تراثنا بالمعرفة، ونحييه بالتقنية… فإننا نمنحه مستقبلًا لا ينتهي.»

Quality: smooth transitions, respect prefers-reduced-motion, visible focus states, ambient audio toggle (silent by default, off), no external image hotlinks except bundled assets, works on phones.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aaf8a80f-69a1-4a2e-b900-6c52bb747063).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
