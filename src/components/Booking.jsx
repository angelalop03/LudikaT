import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const weekDays = ["L", "M", "X", "J", "V", "S", "D"]

function Booking() {
  const [reservas, setReservas] = useState([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const [form, setForm] = useState({
    cliente_email: "",
    telefono: "",
    servicio: "",
    fecha: "",
    hora: "",
    direccion: "",
    notas: "",
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    obtenerReservas()
  }, [])

  async function obtenerReservas() {
    const { data, error } = await supabase
      .from("Reservas")
      .select("id, fecha")

    if (!error) setReservas(data)
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function formatDate(day) {
    const mm = String(month + 1).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    return `${year}-${mm}-${dd}`
  }

  function isReserved(day) {
    return reservas.some((r) => r.fecha === formatDate(day))
  }

  function isPast(day) {
    const today = new Date()
    const date = new Date(year, month, day)
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  function selectDay(day) {
    if (isReserved(day) || isPast(day)) return

    setForm({
      ...form,
      fecha: formatDate(day),
    })

    setShowCalendar(false)
  }

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  async function crearReserva(e) {
    e.preventDefault()

    if (!form.fecha) {
      alert("Selecciona una fecha disponible")
      return
    }

    const { error } = await supabase.from("Reservas").insert([
      {
        cliente_email: form.cliente_email,
        telefono: form.telefono,
        servicio: form.servicio,
        fecha: form.fecha,
        hora: form.hora,
        direccion: form.direccion,
        notas: form.notas,
      },
    ])

    if (error) {
      console.error(error)
      alert("Error al guardar la reserva")
      return
    }

    alert("Reserva guardada correctamente")

    setForm({
      cliente_email: "",
      telefono: "",
      servicio: "",
      fecha: "",
      hora: "",
      direccion: "",
      notas: "",
    })

    obtenerReservas()
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1

  return (
    <div className="booking-section">
      <h2>Reserva</h2>

      <p>Completa tus datos y elige una fecha disponible.</p>

      <form className="booking-form single-form" onSubmit={crearReserva}>
        <input
          name="cliente_email"
          type="email"
          placeholder="Email del cliente"
          value={form.cliente_email}
          onChange={handleChange}
          required
        />

        <input
          name="telefono"
          type="tel"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
        />

        <select
          name="servicio"
          value={form.servicio}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona servicio</option>
          <option value="Cuidado infantil">Cuidado infantil</option>
          <option value="Cumpleaños">Cumpleaños</option>
          <option value="Comunión">Comunión</option>
        </select>

        <input
          type="text"
          placeholder="Selecciona una fecha"
          value={form.fecha}
          readOnly
          onClick={() => setShowCalendar(true)}
          required
        />

        <input
          name="hora"
          type="time"
          value={form.hora}
          onChange={handleChange}
          required
        />

        <input
          name="direccion"
          type="text"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          required
        />

        <textarea
          name="notas"
          placeholder="Notas"
          value={form.notas}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary">
          Guardar reserva
        </button>
      </form>

      {showCalendar && (
        <div className="calendar-popup-overlay">
          <div className="calendar-popup">
            <button
              type="button"
              className="close-popup"
              onClick={() => setShowCalendar(false)}
            >
              ×
            </button>

            <div className="calendar-header">
              <button type="button" onClick={previousMonth} className="calendar-nav">
                ‹
              </button>

              <h3>
                {monthNames[month]} {year}
              </h3>

              <button type="button" onClick={nextMonth} className="calendar-nav">
                ›
              </button>
            </div>

            <div className="calendar-weekdays">
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {Array.from({ length: emptyDays }).map((_, index) => (
                <div key={`empty-${index}`} className="calendar-empty"></div>
              ))}

              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1
                const reserved = isReserved(day)
                const past = isPast(day)
                const date = formatDate(day)

                return (
                  <button
                    type="button"
                    key={day}
                    className={`calendar-day
                      ${reserved ? "reserved" : ""}
                      ${past ? "past" : ""}
                      {!reserved && !past ? "available" : ""}
                      ${form.fecha === date ? "selected" : ""}
                    `}
                    onClick={() => selectDay(day)}
                    disabled={reserved || past}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            <div className="calendar-legend">
              <span className="legend available-dot"></span> Libre
              <span className="legend reserved-dot"></span> Ocupado
              <span className="legend past-dot"></span> Pasado
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking