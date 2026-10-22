import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { site } from "@/content";
import { OptionalImage } from "./OptionalImage";

const OMAN: [number, number][] = [
  [56.3, 24.9], [56.9, 24.1], [57.6, 23.7], [58.7, 23.6], [59.4, 22.6], [59.8, 22.4], [58.5, 20.4],
  [57.8, 20.2], [57.7, 19.0], [56.8, 18.6], [56.3, 17.9], [55.4, 17.6], [55.0, 17.0], [53.1, 16.6],
  [52.0, 19.0], [55.0, 20.0], [55.7, 22.0], [55.2, 22.7], [56.0, 24.0],
];
const DHOFAR: [number, number][] = [
  [53.1, 16.6], [55.0, 17.0], [55.4, 17.6], [56.3, 17.9], [56.8, 18.6], [55.6, 19.7], [55.0, 20.0], [52.0, 19.0],
];
const toShape = (pts: [number, number][]) => {
  const s = new THREE.Shape();
  pts.forEach(([lon, lat], i) => (i ? s.lineTo(lon - 56, lat - 20.5) : s.moveTo(lon - 56, lat - 20.5)));
  s.closePath();
  return s;
};
const TARGET = new THREE.Vector3(-1.9, -2.6, 0);

function Map({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const omanGeo = useMemo(() => new THREE.ExtrudeGeometry(toShape(OMAN), { depth: 0.3, bevelEnabled: false }), []);
  const dhGeo = useMemo(() => new THREE.ExtrudeGeometry(toShape(DHOFAR), { depth: 0.55, bevelEnabled: false }), []);
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const t = useRef(reduced ? 10 : 0);
  const done = useRef(false);
  useFrame(({ camera }, d) => {
    t.current += Math.min(d, 0.05);
    const k = THREE.MathUtils.smoothstep(t.current, 1.2, 4.5);
    const start = new THREE.Vector3(0, -9, 11);
    const end = new THREE.Vector3(TARGET.x, TARGET.y - 2.2, 3.2);
    camera.position.lerpVectors(start, end, k);
    camera.lookAt(new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 0, 0), TARGET, k));
    const p = 0.6 + Math.sin(t.current * 3) * 0.4;
    if (glow.current) glow.current.emissiveIntensity = 0.8 + p;
    if (light.current) light.current.intensity = 6 + p * 6;
    if (k >= 1 && !done.current) { done.current = true; onDone(); }
  });
  return (
    <>
      <mesh geometry={omanGeo}>
        <meshStandardMaterial color="#2c2660" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh geometry={dhGeo}>
        <meshStandardMaterial ref={glow} color="#4c9a68" emissive="#e3b04b" emissiveIntensity={1} />
      </mesh>
      <pointLight ref={light} position={[TARGET.x, TARGET.y, 1.5]} color="#e3b04b" distance={8} />
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#171433" />
      </mesh>
      <gridHelper args={[40, 40, "#3a3380", "#221d4a"]} rotation-x={Math.PI / 2} position={[0, 0, -0.04]} />
    </>
  );
}

export function OmanGate({ reduced, onNext }: { reduced: boolean; onNext: () => void }) {
  const [arrived, setArrived] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <section className="relative h-full w-full" aria-label="البوابة الزمنية">
      {ready && (
        <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [0, -9, 11] }}>
          <color attach="background" args={["#0d0b22"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, -5, 10]} intensity={1.2} />
          <Map reduced={reduced} onDone={() => setArrived(true)} />
        </Canvas>
      )}
      {arrived && (
        <img src={site.gateCover} alt="بوابة ظفار وجبالها الخضراء في موسم الخريف" className="absolute inset-0 h-full w-full object-cover opacity-60 animate-fade-up" />
      )}
      {arrived && (
        <div className="absolute inset-x-0 bottom-36 flex flex-col items-center gap-5 px-6 text-center animate-fade-up">
          <h2 className="font-display text-2xl leading-relaxed text-glow md:text-4xl">{site.gateText}</h2>
          <button className="btn-gold" onClick={onNext}>{site.gateButton}</button>
        </div>
      )}
      <div className="pointer-events-none absolute right-2 top-3 z-10 flex w-24 flex-col items-center gap-1 rounded-xl border border-amber-200/30 bg-[#100d2b]/80 px-1.5 py-2 text-center shadow-xl backdrop-blur-sm sm:right-4 sm:top-4 sm:w-32 sm:gap-1.5 sm:px-2 sm:py-2.5">
        <OptionalImage src="/images/moe-logo.png" alt="شعار وزارة التعليم" className="h-10 w-12 object-contain sm:h-14 sm:w-16" />
        <p className="font-display text-[9px] font-bold leading-snug text-amber-100 sm:text-[11px]">وزارة التعليم — سلطنة عُمان</p>
        <div className="my-0.5 h-px w-full bg-amber-200/30" />
        <p className="font-display text-[8px] leading-snug text-amber-50 sm:text-[10px]">الموسوعة العُمانية</p>
        <p className="font-display text-[10px] leading-relaxed text-amber-50 sm:text-sm">فريق سراج عُمان</p>
        <p className="font-display text-[10px] leading-relaxed text-amber-50 sm:text-sm">مدرسة زينب بنت الرسول</p>
        <p className="font-display text-[10px] leading-relaxed text-amber-50 sm:text-sm">أ. أحلام الرواحية<br />أ. ثريا الرواحية</p>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[54%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="font-display text-3xl font-black tracking-[0.18em] text-[#4a2c0a] drop-shadow-[0_3px_0_rgba(255,255,255,0.45)] sm:text-5xl">ظُفَار</h2>
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[#8b5e22]/70 sm:w-32" />
      </div>
    </section>
  );
}
