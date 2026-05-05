import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import SidebarMenu from "../components/SidebarMenu"
import About from "../components/About"

function Home() {
  return (
    <div className="page">
      <div className="website-frame">
        <header className="hero-section">
          <Navbar />
          <Hero />
        </header>

        <main className="main-layout">
          <SidebarMenu />
          <About />
        </main>
      </div>
    </div>
  )
}

export default Home