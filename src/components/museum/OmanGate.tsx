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
      <div className="pointer-events-none absolute inset-x-0 top-3 flex flex-col items-center gap-1 px-4 text-center">
        <OptionalImage src="/images/moe-logo.png" alt="شعار وزارة التعليم" className="h-16 w-20 object-contain md:h-20 md:w-24" />
        <p className="font-display text-sm text-foreground">وزارة التعليم — سلطنة عُمان</p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 px-4 text-center text-sm leading-relaxed text-foreground">
        <p>الموسوعة العُمانية</p>
        <p>فريق سراج عُمان</p>
        <p>مدرسة زينب بنت الرسول</p>
        <p>أ.أحلام الرواحية — أ.ثريا الرواحية</p>
      </div>
    </section>
  );
}
