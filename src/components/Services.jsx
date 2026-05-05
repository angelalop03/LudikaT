const services = [
  {
    title: "Cuidado infantil",
    text: "Atención personalizada para niños en casa, hoteles o eventos.",
    color: "green",
  },
  {
    title: "Cumpleaños",
    text: "Juegos, actividades, pintacaras y entretenimiento infantil.",
    color: "pink",
  },
  {
    title: "Comuniones",
    text: "Acompañamiento y diversión para los más pequeños durante el evento.",
    color: "blue",
  },
]

function Services() {
  return (
    <section className="services-section">
      <div className="section-title">
        <span>Servicios</span>
        <h2>Todo pensado para que las familias disfruten tranquilas</h2>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <article key={service.title} className={`service-card ${service.color}`}>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services