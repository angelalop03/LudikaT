import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import {
  sphere,
  armGeometry,
  legGeometry,
  curl,
  pacifierRing,
  heart,
  shadowTexture,
} from "./shapes"

const mat = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...extra })

const M = {
  skin: mat("#ffdcc8"),
  nose: mat("#ffc6ad"),
  onesie: mat("#a9dcef"),
  pink: mat("#f6a9bd"),
  eye: mat("#3a2a35", { roughness: 0.25 }),
  shine: mat("#ffffff", { roughness: 0.2 }),
  cheek: mat("#ff9db5", { transparent: true, opacity: 0.7 }),
  hair: mat("#d9a679"),
  ring: mat("#ffe39a"),
  hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  shadow: new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
}

const tmp = new THREE.Vector3()
const { clamp, damp } = THREE.MathUtils
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

function Part(props) {
  return <mesh geometry={sphere} {...props} />
}

function Arm({ ref, side }) {
  return (
    <group ref={ref} position={[side * 0.68, -0.55, 0.05]}>
      <mesh geometry={armGeometry} material={M.onesie} position={[0, -0.32, 0]} />
      <Part material={M.skin} position={[0, -0.72, 0]} scale={0.2} />
    </group>
  )
}

function Leg({ ref, side }) {
  return (
    <group ref={ref} position={[side * 0.38, -1.55, 0.2]}>
      <mesh
        geometry={legGeometry}
        material={M.onesie}
        position={[0, 0, 0.32]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Part material={M.skin} position={[0, 0.02, 0.78]} scale={[0.24, 0.27, 0.22]} />
    </group>
  )
}

// Bebé sentado hecho solo con primitivas: respira, parpadea, sigue el ratón con la
// mirada, saluda de vez en cuando y, al hacerle cosquillas, salta y da una vuelta.
export default function Baby({ onTickle }) {
  const root = useRef()
  const head = useRef()
  const eyes = useRef()
  const armL = useRef()
  const armR = useRef()
  const legL = useRef()
  const legR = useRef()
  const shadow = useRef()
  const anim = useRef({ jump: 0, hover: false, hoverAmt: 0, blink: 2.5 })

  useFrame((state, dt) => {
    const a = anim.current
    const t = state.clock.elapsedTime

    a.hoverAmt = damp(a.hoverAmt, a.hover ? 1 : 0, 8, dt)
    a.jump = Math.max(0, a.jump - dt / 1.1)
    const p = a.jump > 0 ? 1 - a.jump : 0
    const arc = Math.sin(p * Math.PI)

    // Salto con squash & stretch, vuelta completa y risita al pasar el ratón
    const stretch = 1 + Math.sin(t * 2.2) * 0.018 + arc * 0.12
    root.current.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch))
    root.current.position.y = arc * 0.9
    root.current.rotation.y = easeInOut(p) * Math.PI * 2
    root.current.rotation.z = Math.sin(t * 16) * 0.05 * a.hoverAmt
    shadow.current.scale.set(2.6 * (1 - arc * 0.45), 1.6 * (1 - arc * 0.45), 1)

    // La cabeza sigue al puntero
    root.current.getWorldPosition(tmp)
    const px = (state.pointer.x * state.viewport.width) / 2
    const py = (state.pointer.y * state.viewport.height) / 2
    head.current.rotation.y = damp(head.current.rotation.y, clamp((px - tmp.x) * 0.16, -0.7, 0.7), 5, dt)
    head.current.rotation.x = damp(head.current.rotation.x, clamp(-(py - tmp.y) * 0.12, -0.35, 0.35), 5, dt)
    head.current.rotation.z = Math.sin(t * 0.9) * 0.05 + a.hoverAmt * 0.1

    // Parpadeo cada pocos segundos; con el ratón encima, ojos contentos
    a.blink -= dt
    if (a.blink < -0.15) a.blink = 2 + Math.random() * 3.5
    eyes.current.scale.y = a.blink < 0 ? 0.15 : 1 - a.hoverAmt * 0.45

    // Saluda cada 7 segundos, y levanta los brazos al saltar o con el ratón encima
    const cycle = t % 7
    const wave = Math.max(cycle < 2 ? Math.sin((cycle / 2) * Math.PI) : 0, a.hoverAmt, arc)
    armR.current.rotation.z = 0.5 + wave * 2 + Math.sin(t * 10) * 0.25 * wave
    armL.current.rotation.z = -(0.5 + Math.max(arc, a.hoverAmt * 0.6) * 2) + Math.sin(t * 1.7) * 0.06

    const kick = Math.max(a.hoverAmt, arc)
    legL.current.rotation.x = -0.1 - Math.sin(t * 11) * 0.3 * kick
    legR.current.rotation.x = -0.1 - Math.sin(t * 11 + Math.PI) * 0.3 * kick
  })

  function handleOver(e) {
    e.stopPropagation()
    anim.current.hover = true
    document.body.style.cursor = "pointer"
  }

  function handleOut() {
    anim.current.hover = false
    document.body.style.cursor = ""
  }

  function handleClick(e) {
    e.stopPropagation()
    if (anim.current.jump > 0) return
    anim.current.jump = 1
    root.current.getWorldPosition(tmp)
    onTickle?.(tmp.clone())
  }

  return (
    <group>
      <mesh ref={shadow} material={M.shadow} position={[0, -1.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
      </mesh>

      <group ref={root}>
        {/* Cuerpo con pijama, babero y un corazón en la tripa */}
        <Part material={M.onesie} position={[0, -0.95, 0]} scale={[0.85, 0.92, 0.8]} />
        <Part material={M.pink} position={[0, -0.4, 0.56]} scale={[0.5, 0.33, 0.16]} rotation={[-0.45, 0, 0]} />
        <mesh geometry={heart} material={M.pink} position={[0, -1.05, 0.8]} rotation={[-0.15, 0, 0]} scale={0.32} />

        <Arm ref={armL} side={-1} />
        <Arm ref={armR} side={1} />
        <Leg ref={legL} side={-1} />
        <Leg ref={legR} side={1} />

        <group ref={head} position={[0, 0.62, 0]}>
          <Part material={M.skin} scale={[1.02, 0.96, 0.98]} />
          <Part material={M.skin} position={[-0.98, -0.02, 0]} scale={[0.16, 0.24, 0.14]} />
          <Part material={M.skin} position={[0.98, -0.02, 0]} scale={[0.16, 0.24, 0.14]} />

          {/* Ricito de pelo */}
          <Part material={M.hair} position={[0, 0.93, 0.18]} scale={[0.14, 0.1, 0.14]} />
          <mesh geometry={curl} material={M.hair} position={[0.06, 1, 0.22]} rotation={[0.2, 0, 0.8]} />

          <group ref={eyes} position={[0, 0.06, 0]}>
            <Part material={M.eye} position={[-0.33, 0, 0.88]} scale={[0.1, 0.13, 0.08]} />
            <Part material={M.eye} position={[0.33, 0, 0.88]} scale={[0.1, 0.13, 0.08]} />
            <Part material={M.shine} position={[-0.3, 0.05, 0.97]} scale={0.035} />
            <Part material={M.shine} position={[0.36, 0.05, 0.97]} scale={0.035} />
          </group>

          <Part material={M.cheek} position={[-0.58, -0.2, 0.74]} scale={[0.2, 0.13, 0.1]} />
          <Part material={M.cheek} position={[0.58, -0.2, 0.74]} scale={[0.2, 0.13, 0.1]} />
          <Part material={M.nose} position={[0, -0.12, 0.97]} scale={[0.08, 0.06, 0.06]} />

          {/* Chupete */}
          <group position={[0, -0.4, 0.93]}>
            <Part material={M.pink} scale={[0.27, 0.17, 0.08]} />
            <mesh geometry={pacifierRing} material={M.ring} position={[0, -0.02, 0.09]} />
          </group>
        </group>

        {/* Zona invisible para detectar el ratón sobre todo el bebé */}
        <Part
          material={M.hit}
          position={[0, -0.25, 0]}
          scale={[1.3, 1.95, 1.1]}
          onPointerOver={handleOver}
          onPointerOut={handleOut}
          onClick={handleClick}
        />
      </group>
    </group>
  )
}
