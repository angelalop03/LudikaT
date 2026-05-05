function About() {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>¿Quiénes somos?</h2>

        <p>
          ¡Hola!, somos Isabel y María, dos chicas de 22 años a las que nos encantan los niños y
          trabajar con ellos. Nos dedicamos al cuidado infantil y a la
          animación en eventos como cumpleaños y comuniones.
        </p>

        <p>
          Una de nosotras es educadora infantil y la otra psicóloga, lo que nos
          permite ofrecer un cuidado cercano, profesional y adaptado a cada
          niño.
        </p>

        <p>
          Nuestro objetivo es que los niños disfruten, se sientan seguros y que
          las familias estén tranquilas.
        </p>
      </div>

      <div className="about-images">
        <div className="about-card">
          <img src="/chica1.png" alt="Cuidadora 1" />
          <span>Maria- Educadora infantil</span>
        </div>

        <div className="about-card">
          <img src="/chica2.png" alt="Cuidadora 2" />
          <span>Isabel- Psicóloga</span>
        </div>
      </div>
    </section>
  )
}

export default About