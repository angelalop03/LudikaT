import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const weekDays = ["L", "M", "X", "J", "V", "S", "D"]

function CalendarAvailability() {
  const [reservas, setReservas] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    obtenerReservas()
  }, [])

  async function obtenerReservas() {
    const { data, error } = await supabase
      .from("Reservas")
      .select("id, fecha")

    if (error) {
      console.error("Error cargando reservas:", error)
    } else {
      setReservas(data)
    }
  }

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  function formatDate(day) {
    const mm = String(month + 1).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    return `${year}-${mm}-${dd}`
  }

  const reservedDates = reservas
    .filter((r) => r.fecha)
    .map((r) => r.fecha)

  function isReserved(day) {
    return reservedDates.includes(formatDate(day))
  }

  function selectDay(day) {
    const date = formatDate(day)
    if (isReserved(day)) return
    setSelectedDate(date)
  }

  function isPast(day) {
  const today = new Date()
  const date = new Date(year, month, day)

  // quitamos horas para comparar solo fechas
  today.setHours(0, 0, 0, 0)

  return date < today
}

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const firstDay = new Date(year, month, 1).getDay()
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1
  

  return (
    <div className="calendar">
        <h2>Calendario</h2>

      <p>
        Consulta las fechas disponibles. Los días ocupados ya tienen una reserva
        registrada.
      </p>
    <div className="calendar-box">
    
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav">
          ‹
        </button>

        <h3>
          {monthNames[month]} {year}
        </h3>

        <button onClick={nextMonth} className="calendar-nav">
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
                key={day}
                className={`calendar-day 
                    ${reserved ? "reserved" : ""}
                    ${past ? "past" : ""}
                    ${!reserved && !past ? "available" : ""}
                    ${selectedDate === date ? "selected" : ""}
                `}
                onClick={() => selectDay(day)}
                disabled={reserved || past}
                >
              {day}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <p className="selected-date">
          Fecha seleccionada: <strong>{selectedDate}</strong>
        </p>
      )}

      <div className="calendar-legend">
        <span className="legend available-dot"></span> Libre
        <span className="legend reserved-dot"></span> Ocupado
      </div>
    </div>
    </div>
  )
}

export default CalendarAvailability