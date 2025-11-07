// app/api/doctor/schedule/free-slots/route.ts
import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { FreeSlot } from "@/models/DoctorSchedule"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
    const auth = await requireAuth(["doctor", "admin"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get("doctorId") || auth.sub

    const slots = await FreeSlot.find({ doctorId, isActive: true }).sort({ dayOfWeek: 1, startTime: 1 })
    return json(slots)
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth(["doctor"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const body = await req.json()
    const { dayOfWeek, startTime, endTime, slotDurationMins = 30 } = body

    if (dayOfWeek < 0 || dayOfWeek > 6) return error("Invalid day of week", 400)
    if (!startTime || !endTime) return error("Start and end time required", 400)

    const slot = await FreeSlot.create({
        doctorId: auth.sub,
        dayOfWeek,
        startTime,
        endTime,
        slotDurationMins,
        isActive: true,
    })

    return json({ success: true, slotId: slot._id })
}

export async function DELETE(req: NextRequest) {
    const auth = await requireAuth(["doctor"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const slotId = searchParams.get("id")

    const slot = await FreeSlot.findOne({ _id: slotId, doctorId: auth.sub })
    if (!slot) return error("Slot not found", 404)

    await FreeSlot.findByIdAndDelete(slotId)
    return json({ success: true })
}