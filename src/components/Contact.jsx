function Contact() {
  return (
    <section id="contacto" className="section">
      <div className="container split">
        <div className="card" data-reveal>
          <span className="label tone-lilac">Contacto</span>
          <h2 className="section-title">¡Pregunta sin compromiso!</h2>
          <p>Llámanos y te contamos todo lo que necesites saber.</p>

          <div className="contact-list">
            <a className="contact-pill tone-pink" href="tel:+34622605898">
              <span>Isabel</span>
              <strong>622 605 898</strong>
            </a>
            <a className="contact-pill tone-blue" href="tel:+34673975844">
              <span>María</span>
              <strong>673 975 844</strong>
            </a>
          </div>
        </div>

        <div className="baby-stage" data-baby-stage data-baby-look="left" aria-hidden="true" />
      </div>
    </section>
  )
}

export default Contact
