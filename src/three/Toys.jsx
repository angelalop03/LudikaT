import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { sphere, heart, star, visibleHeight } from "./shapes"

const PALETTE = ["#f6a9bd", "#a9dcef", "#d6c6f2", "#bfead6", "#ffe39a", "#ffc9b0"]
const KINDS = [
  "balloon", "star", "block", "cloud", "duck", "ring", "heart",
  "balloon", "star", "block", "cloud", "heart", "ring", "balloon",
]
// Los juguetes se repiten cada SPAN pantallas de scroll, así siempre hay alguno a la vista
const SPAN = 2.6

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seeded(7)
const LAYOUT = KINDS.map((kind, i) => {
  const side = i % 2 === 0 ? -1 : 1
  return {
    kind,
    color: PALETTE[i % PALETTE.length],
    // Posición horizontal como fracción de pantalla: asoman por los bordes sin tapar el texto
    x: side * (0.46 + rand() * 0.06),
    docY: (i / KINDS.length) * SPAN + rand() * 0.15,
    z: -2 - rand() * 4,
    speed: 0.35 + rand() * 0.35,
    size: 0.6 + rand() * 0.5,
    phase: rand() * Math.PI * 2,
    spin: kind === "cloud" ? 0 : (rand() - 0.5) * 0.8,
  }
})

const mod = (n, m) => ((n % m) + m) % m

function Soft({ color, roughness = 0.45 }) {
  return <meshStandardMaterial color={color} roughness={roughness} />
}

function Toy({ kind, color }) {
  switch (kind) {
    case "balloon":
      return (
        <group>
          <mesh geometry={sphere} scale={[0.5, 0.6, 0.5]}>
            <Soft color={color} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.64, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.08, 0.12, 12]} />
            <Soft color={color} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
            <Soft color="#c9b6d9" />
          </mesh>
        </group>
      )
    case "star":
      return (
        <mesh geometry={star} scale={1.1}>
          <Soft color={color} />
        </mesh>
      )
    case "heart":
      return (
        <mesh geometry={heart} scale={0.8}>
          <Soft color={color} />
        </mesh>
      )
    case "block":
      return (
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.14} smoothness={4}>
          <Soft color={color} roughness={0.55} />
        </RoundedBox>
      )
    case "ring":
      return (
        <mesh>
          <torusGeometry args={[0.36, 0.15, 16, 40]} />
          <Soft color={color} />
        </mesh>
      )
    case "duck":
      return (
        <group>
          <mesh geometry={sphere} scale={[0.55, 0.4, 0.42]}>
            <Soft color="#ffe39a" />
          </mesh>
          <mesh geometry={sphere} position={[0, 0.4, 0.18]} scale={0.28}>
            <Soft color="#ffe39a" />
          </mesh>
          <mesh geometry={sphere} position={[0, 0.36, 0.46]} scale={[0.12, 0.06, 0.13]}>
            <Soft color="#ffb38a" />
          </mesh>
          <mesh geometry={sphere} position={[-0.11, 0.47, 0.4]} scale={0.04}>
            <Soft color="#3a2a35" />
          </mesh>
          <mesh geometry={sphere} position={[0.11, 0.47, 0.4]} scale={0.04}>
            <Soft color="#3a2a35" />
          </mesh>
        </group>
      )
    default:
      return (
        <group>
          {[
            [-0.45, 0, 0, 0.38],
            [0, 0.15, 0, 0.5],
            [0.45, 0, 0, 0.36],
            [0.15, -0.12, 0.1, 0.4],
          ].map(([x, y, z, r]) => (
            <mesh key={x} geometry={sphere} position={[x, y, z]} scale={r}>
              <Soft color="#ffffff" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )
  }
}

// Globos, estrellas, bloques, patitos y nubes que flotan detrás del contenido con parallax
export default function Toys({ count }) {
  const groups = useRef([])
  const items = LAYOUT.slice(0, count)

  useFrame(({ clock, size }) => {
    const t = clock.elapsedTime
    const scroll = window.scrollY / size.height
    const aspect = size.width / size.height

    items.forEach((item, i) => {
      const g = groups.current[i]
      if (!g) return
      const visH = visibleHeight(item.z)
      const screenY = mod(item.docY - scroll * item.speed, SPAN) - 0.3
      g.position.set(
        item.x * visH * aspect,
        -(screenY - 0.5) * visH + Math.sin(t * 0.8 + item.phase) * 0.2,
        item.z
      )
      g.rotation.y = t * item.spin
      g.rotation.z = Math.sin(t * 0.6 + item.phase) * 0.15
    })
  })

  return items.map((item, i) => (
    <group key={i} ref={(el) => (groups.current[i] = el)} scale={item.size}>
      <Toy kind={item.kind} color={item.color} />
    </group>
  ))
}
