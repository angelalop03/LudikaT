import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

function AdminPanel() {
  const [reservas, setReservas] = useState([])
  const [filtroFecha, setFiltroFecha] = useState("")
  const [orden, setOrden] = useState("futuras")

  useEffect(() => {
    obtenerReservas()
  }, [])

  async function obtenerReservas() {
    const { data, error } = await supabase
      .from("Reservas")
      .select("*")
      .order("fecha", { ascending: true })

    if (error) {
      console.error(error)
    } else {
      setReservas(data)
    }
  }

  async function eliminarReserva(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar esta reserva?")

    if (!confirmar) return

    const { error } = await supabase
      .from("Reservas")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      alert("Error al eliminar la reserva")
      return
    }

    setReservas(reservas.filter((reserva) => reserva.id !== id))
  }

  function esFutura(fecha) {
    const hoy = new Date()
    const fechaReserva = new Date(fecha)

    hoy.setHours(0, 0, 0, 0)
    fechaReserva.setHours(0, 0, 0, 0)

    return fechaReserva >= hoy
  }

  const reservasFiltradas = reservas
    .filter((reserva) => {
      if (!filtroFecha) return true
      return reserva.fecha === filtroFecha
    })
    .filter((reserva) => {
      if (orden === "todas") return true
      if (orden === "futuras") return esFutura(reserva.fecha)
      if (orden === "pasadas") return !esFutura(reserva.fecha)
      return true
    })
    .sort((a, b) => {
      if (orden === "pasadas") {
        return new Date(b.fecha) - new Date(a.fecha)
      }

      return new Date(a.fecha) - new Date(b.fecha)
    })

  return (
    <div className="admin-panel">
      <h3>Reservas</h3>

      <div className="admin-filters">
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="futuras">Solo futuras</option>
          <option value="pasadas">Solo pasadas</option>
          <option value="todas">Todas</option>
        </select>

        <button onClick={() => setFiltroFecha("")}>
          Limpiar fecha
        </button>
      </div>

      {reservasFiltradas.length === 0 ? (
        <p className="admin-empty">No hay reservas con esos filtros.</p>
      ) : (
        <div className="admin-reservas">
          {reservasFiltradas.map((reserva) => (
            <div className="admin-card" key={reserva.id}>
              <strong>
                {reserva.fecha} - {reserva.hora}
              </strong>

              <p><b>Servicio:</b> {reserva.servicio}</p>
              <p><b>Email:</b> {reserva.cliente_email}</p>
              <p><b>Teléfono:</b> {reserva.telefono}</p>
              <p><b>Dirección:</b> {reserva.direccion}</p>

              {reserva.notas && (
                <p><b>Notas:</b> {reserva.notas}</p>
              )}

              <button
                className="delete-reserva"
                onClick={() => eliminarReserva(reserva.id)}
              >
                Eliminar reserva
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPanel