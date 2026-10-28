// Sin WebGL, o si el usuario pide menos movimiento, la web se muestra sin escena 3D
export function canUse3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}
