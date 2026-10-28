-- Ejecutar una vez en Supabase → SQL Editor, antes de publicar el nuevo formulario.
-- Guarda con quién quiere la reserva el cliente: 'Isabel', 'María' o 'Las dos'.
alter table "Reservas"
  add column if not exists cuidadora text
  check (cuidadora in ('Isabel', 'María', 'Las dos'));
