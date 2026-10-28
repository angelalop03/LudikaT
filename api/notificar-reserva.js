// Función de Vercel: avisa por correo a Isabel y María cada vez que se guarda una reserva.
// Usa Resend (https://resend.com). En Vercel hay que configurar RESEND_API_KEY y,
// cuando tengáis dominio verificado, RESEND_FROM (p. ej. "LudikaT <reservas@ludikat.es>").

// Correos de prueba: cambiadlos por los reales
const CUIDADORAS = {
  Isabel: "isabel@ejemplo.com",
  María: "maria@ejemplo.com",
}

const FROM = process.env.RESEND_FROM || "LudikaT <onboarding@resend.dev>"

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Método no permitido" })
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Falta RESEND_API_KEY" })
  }

  const r = req.body || {}
  if (!r.fecha || !r.cliente_email || !r.cuidadora) {
    return res.status(400).json({ error: "Faltan datos de la reserva" })
  }

  const filas = [
    ["Con quién", r.cuidadora],
    ["Servicio", r.servicio],
    ["Fecha", formatDate(r.fecha)],
    ["Hora", r.hora],
    ["Dirección", r.direccion],
    ["Email del cliente", r.cliente_email],
    ["Teléfono", r.telefono],
    ["Notas", r.notas || "—"],
  ]

  const html = `
    <div style="font-family: sans-serif; color: #4b3b5c">
      <h2 style="color: #d95f80">Nueva reserva en LudikaT</h2>
      <table cellpadding="6">
        ${filas
          .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
          .join("")}
      </table>
    </div>`

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: Object.values(CUIDADORAS),
      reply_to: r.cliente_email,
      subject: `Nueva reserva (${r.cuidadora}): ${r.servicio} el ${formatDate(r.fecha)}`,
      html,
    }),
  })

  if (!response.ok) {
    console.error("Error de Resend:", response.status, await response.text())
    return res.status(502).json({ error: "No se pudo enviar el correo" })
  }

  return res.status(200).json({ ok: true })
}
