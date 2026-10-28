const YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#inicio" className="nav-logo">
          <img src="/logo-rosa-128.png" alt="" width="40" height="40" />
          LudikaT
        </a>
        <p>Cuidado infantil y animación de eventos</p>
        <a href="/admin" className="footer-access">
          Acceso cuidadoras
        </a>
      </div>
      <p className="footer-copy">© {YEAR} LudikaT</p>
    </footer>
  )
}

export default Footer
