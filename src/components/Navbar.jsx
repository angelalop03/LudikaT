import { useState } from "react"

const LINKS = [
  ["#nosotras", "Nosotras"],
  ["#servicios", "Servicios"],
  ["#reserva", "Reserva"],
  ["#contacto", "Contacto"],
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <a href="#inicio" className="nav-logo">
        <img src="/logo-rosa-128.png" alt="" width="40" height="40" />
        LudikaT
      </a>

      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Secciones">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <a href="#reserva" className="btn btn-primary btn-small">
          Reservar
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Navbar
