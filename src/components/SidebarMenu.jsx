function SidebarMenu() {
  const links = ["Home", "Nosotras", "Servicios", "Calendario", "Reserva", "Contactanos"]

  return (
    <aside className="sidebar-menu">
      {links.map((link) => (
        <a key={link} className="menu-pill">
          {link}
        </a>
      ))}
    </aside>
  )
}

export default SidebarMenu