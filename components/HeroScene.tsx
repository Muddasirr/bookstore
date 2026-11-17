"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const pointer = { x: 0, y: 0 };

function coverTexture(color: string, title: string, sub: string, num: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 680;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 512, 680);
  grd.addColorStop(0, color);
  grd.addColorStop(1, new THREE.Color(color).multiplyScalar(0.7).getStyle());
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 680);
  g.fillStyle = "rgba(255,255,255,.12)";
  g.fillRect(0, 0, 30, 680);
  g.fillStyle = "rgba(0,0,0,.18)";
  g.fillRect(30, 0, 6, 680);
  g.fillStyle = "rgba(255,255,255,.75)";
  g.font = "600 26px Arial";
  g.fillText(sub.toUpperCase(), 70, 90);
  g.fillStyle = "#fff";
  g.font = "600 64px Georgia";
  title.split("\n").forEach((l, i) => g.fillText(l, 70, 170 + i * 72));
  g.fillStyle = "#f4c21b";
  g.font = "bold 220px Georgia";
  g.textAlign = "right";
  g.fillText(num, 470, 630);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function pageTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 680;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fffaf0";
  g.fillRect(0, 0, 512, 680);
  g.fillStyle = "#13265c";
  g.font = "600 46px Georgia";
  g.fillText("Contents", 50, 100);
  g.font = "26px Georgia";
  ["Getting started", "Shapes & sizes", "Numbers in life", "Stories we share", "Time & money", "Our world", "Revision"].forEach((t, i) => {
    const y = 175 + i * 66;
    g.fillStyle = "#3a4466";
    g.fillText(t, 50, y);
    g.fillText(String((i + 1) * 9), 430, y);
    g.strokeStyle = "rgba(19,38,92,.25)";
    g.setLineDash([3, 6]);
    g.beginPath();
    g.moveTo(60 + g.measureText(t).width, y);
    g.lineTo(420, y);
    g.stroke();
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function insideTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 340;
  const g = c.getContext("2d")!;
  g.fillStyle = "#efe4cc";
  g.fillRect(0, 0, 256, 340);
  g.fillStyle = "rgba(19,38,92,.45)";
  g.font = "italic 20px Georgia";
  g.textAlign = "center";
  g.fillText("This book belongs to", 128, 160);
  g.fillRect(48, 190, 160, 1.5);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type BookProps = {
  color: string;
  title: string;
  sub: string;
  num: string;
  w?: number;
  d?: number;
  t?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  delay: number;
  openable?: boolean;
  open?: boolean;
};

function Book({ color, title, sub, num, w = 1.6, d = 2.1, t = 0.28, position, rotation = [0, 0, 0], delay, openable, open }: BookProps) {
  const group = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const born = useRef<number | null>(null);
  const tex = useMemo(() => coverTexture(color, title, sub, num), [color, title, sub, num]);
  const pageTex = useMemo(() => (openable ? pageTexture() : null), [openable]);
  const inTex = useMemo(() => (openable ? insideTexture() : null), [openable]);
  const coverMats = useMemo(() => {
    const base = new THREE.MeshStandardMaterial({ color, roughness: 0.55 });
    const top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    const inside = inTex ? new THREE.MeshStandardMaterial({ map: inTex, roughness: 0.9 }) : base;
    return [base, base, top, inside, base, base];
  }, [color, tex, inTex]);
  const cover = 0.035;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (born.current === null) born.current = state.clock.elapsedTime;
    const age = state.clock.elapsedTime - born.current - delay;
    const p = Math.max(0, Math.min(1, age / 0.9));
    const e = 1 - Math.pow(1 - p, 4) + Math.sin(p * Math.PI) * 0.06;
    g.position.y = position[1] + (1 - e) * 4;
    g.rotation.z = rotation[2] + (1 - e) * 0.6;
    g.visible = age > -0.05;
    if (hinge.current) {
      const target = open ? 2.55 : 0;
      hinge.current.rotation.z = THREE.MathUtils.damp(hinge.current.rotation.z, target, 3.2, dt);
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} visible={false}>
      {/* page block */}
      <mesh castShadow receiveShadow position={[0.02, 0, 0]}>
        <boxGeometry args={[w - 0.08, t - cover * 2, d - 0.08]} />
        <meshStandardMaterial color="#f4ecd9" roughness={0.95} />
      </mesh>
      {pageTex && (
        <mesh position={[0.02, t / 2 - cover + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w - 0.12, d - 0.12]} />
          <meshStandardMaterial map={pageTex} roughness={0.95} />
        </mesh>
      )}
      {/* back cover */}
      <mesh castShadow receiveShadow position={[0, -t / 2 + cover / 2, 0]}>
        <boxGeometry args={[w, cover, d]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* spine */}
      <RoundedBox args={[0.07, t, d]} radius={0.03} position={[-w / 2 + 0.02, 0, 0]} castShadow>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} roughness={0.5} />
      </RoundedBox>
      {/* front cover on a hinge */}
      <group ref={hinge} position={[-w / 2, t / 2 - cover / 2, 0]}>
        <mesh castShadow position={[w / 2, 0, 0]} material={coverMats}>
          <boxGeometry args={[w, cover, d]} />
        </mesh>
      </group>
    </group>
  );
}

function PencilCup({ position }: { position: [number, number, number] }) {
  const pencils = ["#d6452b", "#f4c21b", "#1e4fd6", "#1f7a4d"];
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.36, 0.32, 0.9, 40, 1, true]} />
        <meshStandardMaterial color="#13265c" roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
        <meshStandardMaterial color="#0e1a3d" />
      </mesh>
      {pencils.map((c, i) => (
        <group key={c} position={[Math.cos(i * 1.7) * 0.14, 0.75, Math.sin(i * 1.7) * 0.14]} rotation={[Math.sin(i) * 0.18, 0, Math.cos(i * 2) * 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.045, 1.1 + i * 0.08, 6]} />
            <meshStandardMaterial color={c} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.6 + i * 0.04, 0]}>
            <coneGeometry args={[0.045, 0.14, 6]} />
            <meshStandardMaterial color="#efc999" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({ open }: { open: boolean }) {
  const rig = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!rig.current) return;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, -0.35 + pointer.x * 0.35, 2.5, dt);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, pointer.y * 0.12, 2.5, dt);
  });
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 2, -2]} intensity={18} color="#f4c21b" />
      <pointLight position={[3, 1, 4]} intensity={6} color="#9db4ff" />
      <group ref={rig} position={[0, -0.9, 0]}>
        <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.35}>
          <Book color="#2a6b4f" title={"General\nScience"} sub="Class 6" num="6" position={[0, 0.14, 0]} rotation={[0, 0.12, 0]} delay={0.1} w={1.9} d={2.4} />
          <Book color="#c98a12" title={"Social\nStudies"} sub="Class 5" num="5" position={[0.05, 0.43, 0.02]} rotation={[0, -0.1, 0]} delay={0.35} w={1.8} d={2.3} />
          <Book color="#1e4fd6" title={"Physics"} sub="Matric" num="9" position={[-0.05, 0.72, 0]} rotation={[0, 0.2, 0]} delay={0.6} w={1.7} d={2.2} />
          <Book color="#d6452b" title={"Mathe-\nmatics"} sub="Class 5" num="5" position={[0, 1.02, 0.05]} rotation={[0, -0.05, 0]} delay={0.85} openable open={open} w={1.6} d={2.1} />
        </Float>
        <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.25}>
          <Book color="#1b3478" title={"English\nReader"} sub="Class 5" num="5" position={[0.9, 1.25, -1.6]} rotation={[Math.PI / 2 - 0.1, 0, -0.18]} delay={1.05} w={1.5} d={2.1} t={0.3} />
        </Float>
        <PencilCup position={[2.15, 0, 0.5]} />
        <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={9} blur={2.6} far={3} resolution={256} color="#050b22" />
      </group>
    </>
  );
}

export default function HeroScene() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (wrap.current) io.observe(wrap.current);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2300);
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <div ref={wrap} className="relative h-full w-full cursor-pointer" onClick={() => setOpen((o) => !o)} title="Click to open / close the book">
      <Canvas shadows frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ position: [0.6, 3.6, 6.2], fov: 34 }} onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}>
        <Scene open={open} />
      </Canvas>
    </div>
  );
}
