function About() {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>¿Quiénes somos?</h2>

        <p>
          Hola, somos dos chicas de 22 años a las que nos encantan los niños.
          Nos dedicamos al cuidado infantil y animación en eventos.
        </p>

        <p>
          Una es educadora infantil y la otra psicóloga, ofreciendo un cuidado
          cercano y profesional.
        </p>
      </div>

      <div className="about-images">
        <div className="about-card">
          <img src="/chica1.png" />
          <span>Educadora infantil</span>
        </div>

        <div className="about-card">
          <img src="/chica2.png" />
          <span>Psicóloga</span>
        </div>
      </div>
    </section>
  )
}

export default About