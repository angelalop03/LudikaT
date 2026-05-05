import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import SidebarMenu from "../components/SidebarMenu"
import About from "../components/About"
import Services from "../components/Services"
import Booking from "../components/Booking"
import Contact from "../components/Contact"
import CalendarAvailability from "../components/CalendarAvailability"

function Home() {
  return (
    <div className="page">
      <header className="hero-section">
        <Navbar />
        <Hero />
      </header>

      <main className="main-layout">
        <SidebarMenu />

        <div className="content">
          <section id="nosotras">
            <About />
          </section>

          <section id="servicios">
            <Services />
          </section>

          <section id="calendario">
            <CalendarAvailability />
          </section>

          <section id="reserva">
            <Booking />
          </section>

          <section id="contacto">
            <Contact />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home