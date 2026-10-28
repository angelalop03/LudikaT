import * as THREE from "three"

export const FOV = 35
export const CAMERA_Z = 12

// Altura del bebé de los pies a la coronilla, para escalarlo al hueco de cada sección
export const BABY_HEIGHT = 3.6
export const BABY_WIDTH = 2.3

// Alto visible del mundo a una profundidad z, para pasar de píxeles a unidades 3D
export function visibleHeight(z = 0) {
  return 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * (CAMERA_Z - z)
}

// Una sola esfera unitaria para casi todas las piezas: se escala en cada mesh
export const sphere = new THREE.SphereGeometry(1, 40, 28)
export const armGeometry = new THREE.CapsuleGeometry(0.2, 0.42, 6, 16)
export const legGeometry = new THREE.CapsuleGeometry(0.23, 0.32, 6, 16)
export const curl = new THREE.TorusGeometry(0.14, 0.045, 10, 28, Math.PI * 1.5)
export const pacifierRing = new THREE.TorusGeometry(0.12, 0.035, 10, 28)

const extrude = {
  depth: 0.22,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.07,
  bevelSegments: 4,
  curveSegments: 18,
}

function heartShape() {
  const s = new THREE.Shape()
  s.moveTo(0.25, 0.25)
  s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0)
  s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35)
  s.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95)
  s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35)
  s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0)
  s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25)
  return s
}

function starShape(points = 5, outer = 0.5, inner = 0.23) {
  const s = new THREE.Shape()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  s.closePath()
  return s
}

// La forma del corazón está dibujada con la punta hacia arriba: se gira y se centra
export const heart = new THREE.ExtrudeGeometry(heartShape(), extrude).rotateZ(Math.PI).center()
export const star = new THREE.ExtrudeGeometry(starShape(), {
  ...extrude,
  depth: 0.16,
  bevelThickness: 0.06,
  bevelSize: 0.05,
}).center()

// Sombra suave bajo el bebé: un degradado radial en lugar de sombras reales
function makeShadowTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext("2d")
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, "rgba(120, 80, 140, 0.32)")
  g.addColorStop(1, "rgba(120, 80, 140, 0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export const shadowTexture = makeShadowTexture()
