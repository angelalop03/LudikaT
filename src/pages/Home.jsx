import { lazy, Suspense } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import About from "../components/About"
import Services from "../components/Services"
import Booking from "../components/Booking"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import useReveal from "../hooks/useReveal"
import { canUse3D } from "../three/support"

// Three.js se carga aparte, después del contenido, para que la web aparezca antes
const Scene = lazy(() => import("../three/Scene"))
const USE_3D = canUse3D()

function Home() {
  useReveal()

  return (
    <div className={USE_3D ? "page" : "page no-3d"}>
      {USE_3D && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}

      <Navbar />

      <main>
        <Hero show3D={USE_3D} />
        <About />
        <Services />
        <Booking />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default Home
