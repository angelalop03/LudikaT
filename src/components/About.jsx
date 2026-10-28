function About() {
  return (
    <section id="nosotras" className="section">
      <div className="container split">
        <div className="card" data-reveal>
          <span className="label tone-pink">Nosotras</span>
          <h2 className="section-title">¿Quiénes somos?</h2>

          <p>
            Hola, somos dos chicas de 22 años a las que nos encantan los niños.
            Nos dedicamos al cuidado infantil y a la animación en eventos.
          </p>
          <p>
            Una es educadora infantil y la otra psicóloga, así que ofrecemos un
            cuidado cercano y profesional.
          </p>

          <div className="team">
            <figure className="team-member tone-pink">
              <img src="/chica1.png" alt="Educadora infantil de LudikaT" loading="lazy" />
              <figcaption>Educadora infantil</figcaption>
            </figure>
            <figure className="team-member tone-blue">
              <img src="/chica2.png" alt="Psicóloga de LudikaT" loading="lazy" />
              <figcaption>Psicóloga</figcaption>
            </figure>
          </div>
        </div>

        <div className="baby-stage" data-baby-stage data-baby-look="left" aria-hidden="true" />
      </div>
    </section>
  )
}

export default About
