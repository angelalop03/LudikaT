import { useState } from "react"

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]

const pad = (n) => String(n).padStart(2, "0")
const toIso = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`

function Calendar({ reservedDates, selected, onSelect }) {
  const [today] = useState(() => new Date())
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const { year, month } = view
  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate())
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Semanas de lunes a domingo
  const offset = (new Date(year, month, 1).getDay() + 6) % 7

  function goTo(delta) {
    const d = new Date(year, month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div className="calendar">
      <div className="calendar-head">
        <button
          type="button"
          className="calendar-nav"
          onClick={() => goTo(-1)}
          disabled={isCurrentMonth}
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <h3>
          {MONTHS[month]} {year}
        </h3>
        <button type="button" className="calendar-nav" onClick={() => goTo(1)} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const iso = toIso(year, month, day)
          const past = iso < todayIso
          const reserved = reservedDates.includes(iso)
          const state = past ? "past" : reserved ? "reserved" : "available"
          const classes = [
            "calendar-day",
            `is-${state}`,
            selected === iso && "is-selected",
            iso === todayIso && "is-today",
          ]

          return (
            <button
              key={iso}
              type="button"
              className={classes.filter(Boolean).join(" ")}
              disabled={past || reserved}
              aria-pressed={selected === iso}
              aria-label={`${day} de ${MONTHS[month]}${reserved ? ", ocupado" : ""}`}
              onClick={() => onSelect(iso)}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span><i className="dot dot-available" /> Libre</span>
        <span><i className="dot dot-reserved" /> Ocupado</span>
        <span><i className="dot dot-past" /> Pasado</span>
      </div>
    </div>
  )
}

export default Calendar
