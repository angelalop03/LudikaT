import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import Calendar from "./Calendar"

const CUIDADORAS = ["Isabel", "María", "Las dos"]

const EMPTY_FORM = {
  cliente_email: "",
  telefono: "",
  cuidadora: "",
  servicio: "",
  fecha: "",
  hora: "",
  direccion: "",
  notas: "",
}

function formatLongDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

async function obtenerFechasReservadas() {
  const { data, error } = await supabase.from("Reservas").select("fecha")

  if (error) {
    console.error("Error cargando reservas:", error)
    return null
  }
  return data.map((r) => r.fecha).filter(Boolean)
}

// Avisa por correo a Isabel y María. Si falla, la reserva ya está guardada igualmente.
async function notificarReserva(reserva) {
  try {
    const res = await fetch("/api/notificar-reserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva),
    })
    if (!res.ok) console.warn("No se pudo enviar el aviso por correo:", res.status)
  } catch (error) {
    console.warn("No se pudo enviar el aviso por correo:", error)
  }
}

function Booking() {
  const [reservedDates, setReservedDates] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  function refrescarFechas() {
    return obtenerFechasReservadas().then((fechas) => {
      if (fechas) setReservedDates(fechas)
    })
  }

  useEffect(() => {
    let cancelado = false
    obtenerFechasReservadas().then((fechas) => {
      if (fechas && !cancelado) setReservedDates(fechas)
    })
    return () => {
      cancelado = true
    }
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function crearReserva(e) {
    e.preventDefault()

    if (!form.fecha) {
      setStatus({ type: "error", text: "Elige un día libre en el calendario." })
      return
    }

    setSending(true)
    const { error } = await supabase.from("Reservas").insert([form])
    setSending(false)

    if (error) {
      console.error(error)
      setStatus({
        type: "error",
        text: "No hemos podido guardar la reserva. Inténtalo de nuevo o llámanos.",
      })
      return
    }

    notificarReserva(form)
    setStatus({
      type: "ok",
      text: `¡Reserva guardada para el ${formatLongDate(form.fecha)}! Te contactaremos pronto.`,
    })
    setForm(EMPTY_FORM)
    refrescarFechas()
  }

  return (
    <section id="reserva" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="label tone-mint">Reserva</span>
          <h2 className="section-title">Elige un día y cuéntanos</h2>
          <p className="section-lead">
            Los días en rosa ya están reservados. Elige uno libre, rellena tus datos
            y te confirmamos lo antes posible.
          </p>
        </div>

        <div className="booking-grid">
          <div className="card" data-reveal>
            <Calendar
              reservedDates={reservedDates}
              selected={form.fecha}
              onSelect={(fecha) => setForm({ ...form, fecha })}
            />
          </div>

          <form className="card booking-form" onSubmit={crearReserva} data-reveal>
            <p className={form.fecha ? "selected-day" : "selected-day is-empty"}>
              {form.fecha ? (
                <>
                  Día elegido: <strong>{formatLongDate(form.fecha)}</strong>
                </>
              ) : (
                "Todavía no has elegido día en el calendario"
              )}
            </p>

            <label>
              Email
              <input
                name="cliente_email"
                type="email"
                autoComplete="email"
                value={form.cliente_email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Teléfono
              <input
                name="telefono"
                type="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </label>

            <fieldset className="choice-group">
              <legend>¿Con quién?</legend>
              <div className="choice-options">
                {CUIDADORAS.map((nombre) => (
                  <label key={nombre} className="choice">
                    <input
                      type="radio"
                      name="cuidadora"
                      value={nombre}
                      checked={form.cuidadora === nombre}
                      onChange={handleChange}
                      required
                    />
                    <span>{nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form-row">
              <label>
                Servicio
                <select name="servicio" value={form.servicio} onChange={handleChange} required>
                  <option value="">Selecciona</option>
                  <option value="Cuidado infantil">Cuidado infantil</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Comunión">Comunión</option>
                </select>
              </label>

              <label>
                Hora
                <input name="hora" type="time" value={form.hora} onChange={handleChange} required />
              </label>
            </div>

            <label>
              Dirección
              <input
                name="direccion"
                type="text"
                autoComplete="street-address"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>
                Notas <span className="optional">(opcional)</span>
              </span>
              <textarea
                name="notas"
                placeholder="Número de niños, edades, alergias…"
                value={form.notas}
                onChange={handleChange}
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Guardando…" : "Guardar reserva"}
            </button>

            {status && (
              <p className={`form-status is-${status.type}`} role="status">
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Booking
