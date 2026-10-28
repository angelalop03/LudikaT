import { useImperativeHandle, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { heart, star } from "./shapes"

const COUNT = 16
const COLORS = ["#f6a9bd", "#a9dcef", "#d6c6f2", "#ffe39a", "#bfead6"]
const materials = COLORS.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.45 }))
const offset = new THREE.Vector3()

// Corazones y estrellas que salen del bebé al hacerle cosquillas
export default function Hearts({ ref }) {
  const meshes = useRef([])
  const particles = useRef(
    Array.from({ length: COUNT }, () => ({ life: 0, size: 1, spin: 0, velocity: new THREE.Vector3() }))
  )

  useImperativeHandle(ref, () => ({
    burst(origin, scale) {
      particles.current.forEach((p, i) => {
        const mesh = meshes.current[i]
        p.life = 1
        p.size = scale * (0.18 + Math.random() * 0.14)
        p.spin = (Math.random() - 0.5) * 6
        p.velocity
          .set((Math.random() - 0.5) * 4, 2.5 + Math.random() * 2.5, Math.random() * 1.5)
          .multiplyScalar(scale)
        mesh.position.copy(origin).add(offset.set(0, 0.6 * scale, 0.4 * scale))
        mesh.visible = true
      })
    },
  }))

  useFrame((_, dt) => {
    particles.current.forEach((p, i) => {
      if (p.life <= 0) return
      const mesh = meshes.current[i]
      p.life -= dt / 1.6
      p.velocity.y -= 1.5 * dt
      p.velocity.multiplyScalar(1 - dt * 0.8)
      mesh.position.addScaledVector(p.velocity, dt)
      mesh.rotation.z += p.spin * dt
      mesh.rotation.y += p.spin * 0.5 * dt
      mesh.scale.setScalar(p.size * Math.min(1, (1 - p.life) * 6) * Math.min(1, p.life * 3))
      if (p.life <= 0) mesh.visible = false
    })
  })

  return Array.from({ length: COUNT }, (_, i) => (
    <mesh
      key={i}
      ref={(el) => (meshes.current[i] = el)}
      geometry={i % 4 === 3 ? star : heart}
      material={materials[i % materials.length]}
      visible={false}
    />
  ))
}
