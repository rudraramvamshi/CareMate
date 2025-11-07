// app/api/appointments/[id]/route.ts (UPDATED VERSION)
import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { error, json } from "@/app/api/_utils"
import { validateAppointmentTime } from "@/lib/slotAvailability"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()

  const appt = await Appointment.findById(params.id)
  if (!appt) return error("Not found", 404)

  const isOwner = appt.patientId?.toString() === auth.sub || appt.doctorId?.toString() === auth.sub
  if (!isOwner && auth.role !== "admin") return error("Forbidden", 403)

  const body = await req.json()

  if (body.status) {
    appt.status = body.status
  }

  if (body.start && body.end) {
    const start = new Date(body.start)
    const end = new Date(body.end)

    if (+start >= +end) return error("Invalid times", 400)

    // Validate with schedule checking (exclude current appointment)
    const validation = await validateAppointmentTime(
      appt.doctorId.toString(),
      start,
      end,
      params.id
    )

    if (!validation.valid) {
      return error(validation.reason || "Time slot not available", 409)
    }

    appt.start = start
    appt.end = end
  }

  await appt.save()
  return json({ success: true })
}