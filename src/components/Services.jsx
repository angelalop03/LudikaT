function Services() {
  return (
    <div className="services-section">
      <h2>Servicios</h2>

      <div className="service-grid">
        <div className="service-card green">
          <h3>Cuidado infantil</h3>
          <p>
            Cuidamos de los peques en casa, eventos o momentos puntuales,
            siempre con atención cercana, paciencia y cariño.
          </p>
        </div>

        <div className="service-card pink">
          <h3>Cumpleaños</h3>
          <p>
            Organizamos juegos, dinámicas, actividades creativas y entretenimiento
            para que los niños disfruten durante toda la celebración.
          </p>
        </div>

        <div className="service-card blue">
          <h3>Comuniones</h3>
          <p>
            Acompañamos a los niños durante la comunión con actividades adaptadas
            a su edad, para que las familias puedan disfrutar tranquilas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Services