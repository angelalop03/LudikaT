import { useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import Baby from "./Baby"
import Hearts from "./Hearts"
import Toys from "./Toys"
import { BABY_HEIGHT, BABY_WIDTH, CAMERA_Z, FOV, visibleHeight } from "./shapes"

const { damp } = THREE.MathUtils
const LOOK = { left: -0.35, right: 0.35 }

// Coloca al bebé sobre el hueco [data-baby-stage] más cercano al centro de la pantalla.
// Al cambiar de sección, vuela hasta el siguiente hueco con un saltito.
function BabyRig() {
  const rig = useRef()
  const hearts = useRef()
  const stages = useRef([])
  const track = useRef({ index: -1, hop: 0, y: 0 })
  const size = useThree((s) => s.size)

  useEffect(() => {
    stages.current = [...document.querySelectorAll("[data-baby-stage]")]
  }, [])

  useFrame((_, dt) => {
    let rect = null
    let index = -1
    let best = Infinity
    stages.current.forEach((el, i) => {
      const r = el.getBoundingClientRect()
      if (r.height === 0) return
      const d = Math.abs(r.top + r.height / 2 - size.height / 2)
      if (d < best) {
        best = d
        rect = r
        index = i
      }
    })
    if (!rect) return

    const g = rig.current
    const s = track.current
    const visH = visibleHeight(0)
    const visW = (visH * size.width) / size.height
    const x = ((rect.left + rect.width / 2) / size.width - 0.5) * visW
    const y = -((rect.top + rect.height / 2) / size.height - 0.5) * visH
    // Si el hueco más cercano ya no está en pantalla (p. ej. en la reserva), el bebé se esconde
    const centerY = rect.top + rect.height / 2
    const onScreen = centerY > 0 && centerY < size.height
    const scale = onScreen
      ? Math.min(
          ((rect.height / size.height) * visH * 0.92) / BABY_HEIGHT,
          ((rect.width / size.width) * visW * 0.9) / BABY_WIDTH
        )
      : 0.001
    const look = LOOK[stages.current[index].dataset.babyLook] ?? 0

    if (s.index === -1) {
      g.position.set(x, y, 0)
      g.scale.setScalar(scale)
      s.y = y
    } else if (index !== s.index) {
      s.hop = 1
    }
    s.index = index

    s.hop = Math.max(0, s.hop - dt / 0.9)
    const hopY = s.hop > 0 ? Math.sin((1 - s.hop) * Math.PI) * 1.2 * scale : 0
    s.y = damp(s.y, y, 9, dt)
    g.position.x = damp(g.position.x, x, 5, dt)
    g.position.y = s.y + hopY
    g.scale.setScalar(damp(g.scale.x, scale, 5, dt))
    g.rotation.y = damp(g.rotation.y, look, 3, dt)
  })

  function handleTickle(position) {
    hearts.current?.burst(position, rig.current.scale.x)
    window.dispatchEvent(new Event("ludikat:cosquillas"))
  }

  return (
    <>
      <group ref={rig}>
        <group position={[0, 0.13, 0]}>
          <Baby onTickle={handleTickle} />
        </group>
      </group>
      <Hearts ref={hearts} />
    </>
  )
}

export default function Scene() {
  const mobile = window.matchMedia("(max-width: 820px)").matches

  return (
    <Canvas
      flat
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      eventSource={document.getElementById("root")}
      eventPrefix="client"
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#fff3f7", "#cbe9f7", 1.6]} />
      <directionalLight position={[4, 6, 8]} intensity={1.8} />
      <directionalLight position={[-6, 1, 4]} intensity={0.6} color="#bfe2ff" />
      <Toys count={mobile ? 7 : 14} />
      <BabyRig />
    </Canvas>
  )
}
