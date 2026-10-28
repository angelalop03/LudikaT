import { useEffect, useState } from "react"

const LETTERS = ["L", "u", "d", "i", "k", "a", "T"]

function Hero({ show3D }) {
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const hide = () => setHint(false)
    window.addEventListener("ludikat:cosquillas", hide)
    return () => window.removeEventListener("ludikat:cosquillas", hide)
  }, [])

  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <span className="pill">Cuidado infantil · Animación de eventos</span>

          <h1 className="hero-title" aria-label="LudikaT">
            {LETTERS.map((letter, i) => (
              <span key={i} aria-hidden="true">
                {letter}
              </span>
            ))}
          </h1>

          <p className="hero-lead">
            Cuidamos de tus peques en casa y animamos cumpleaños y comuniones,
            con cariño, juego y un enfoque profesional.
          </p>

          <div className="hero-buttons">
            <a href="#reserva" className="btn btn-primary">
              Reserva ahora
            </a>
            <a href="#servicios" className="btn btn-secondary">
              Ver servicios
            </a>
          </div>

          <ul className="hero-badges">
            <li>Educadora infantil</li>
            <li>Psicóloga</li>
            <li>Cumpleaños y comuniones</li>
          </ul>
        </div>

        <div className="baby-stage stage-hero" data-baby-stage data-baby-look="left" aria-hidden="true">
          {show3D ? (
            <span className={hint ? "baby-hint" : "baby-hint is-hidden"}>¡Hazme cosquillas!</span>
          ) : (
            <img className="stage-fallback" src="/logo-rosa-512.png" alt="" />
          )}
        </div>
      </div>

      <a href="#nosotras" className="scroll-cue" aria-label="Bajar a Nosotras">
        <span />
      </a>
    </section>
  )
}

export default Hero
