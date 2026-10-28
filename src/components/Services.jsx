const SERVICES = [
  {
    title: "Cuidado infantil",
    icon: "🧸",
    tone: "pink",
    text: "Cuidamos de los peques en casa, eventos o momentos puntuales, siempre con atención cercana, paciencia y cariño.",
  },
  {
    title: "Cumpleaños",
    icon: "🎈",
    tone: "blue",
    text: "Organizamos juegos, dinámicas, actividades creativas y entretenimiento para que los niños disfruten durante toda la celebración.",
  },
  {
    title: "Comuniones",
    icon: "🕊️",
    tone: "lilac",
    text: "Acompañamos a los niños durante la comunión con actividades adaptadas a su edad, para que las familias puedan disfrutar tranquilas.",
  },
]

function Services() {
  return (
    <section id="servicios" className="section">
      <div className="container split split-reverse">
        <div className="baby-stage" data-baby-stage data-baby-look="right" aria-hidden="true" />

        <div>
          <div data-reveal>
            <span className="label tone-blue">Servicios</span>
            <h2 className="section-title">¿Qué hacemos?</h2>
          </div>

          <div className="service-list">
            {SERVICES.map((service) => (
              <article key={service.title} className={`service-card tone-${service.tone}`} data-reveal>
                <span className="service-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
