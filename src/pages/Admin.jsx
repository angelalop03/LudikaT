import { useState } from "react"
import AdminPanel from "../components/AdminPanel"

function Admin() {
  const [isLogged, setIsLogged] = useState(false)
  const [password, setPassword] = useState("")

  const ADMIN_PASSWORD = "totosDeLoka"

  function handleLogin(e) {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      setIsLogged(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  return (
    <div className="admin-page">
      {!isLogged ? (
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Acceso cuidadoras</h2>

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary">Entrar</button>
        </form>
      ) : (
        <AdminPanel />
      )}
    </div>
  )
}

export default Admin