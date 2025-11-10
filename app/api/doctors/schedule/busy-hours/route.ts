// app/api/doctor/schedule/busy-hours/route.ts
import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { BusyHour } from "@/models/DoctorSchedule"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
    const auth = await requireAuth(["doctor", "admin"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get("doctorId") || auth.sub

    const busyHours = await BusyHour.find({ doctorId }).sort({ date: -1 })
    return json(busyHours)
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth(["doctor"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const body = await req.json()
    const { date, startTime, endTime, isRecurring = false, dayOfWeek, reason } = body

    if (!date || !startTime || !endTime) return error("Date, start and end time required", 400)

    if (isRecurring && (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6)) {
        return error("Valid day of week required for recurring busy hours", 400)
    }

    const busyHour = await BusyHour.create({
        doctorId: auth.sub,
        date: new Date(date),
        startTime,
        endTime,
        isRecurring,
        dayOfWeek: isRecurring ? dayOfWeek : undefined,
        reason,
    })

    return json({ success: true, busyHourId: busyHour._id })
}

export async function DELETE(req: NextRequest) {
    const auth = await requireAuth(["doctor"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const busyHourId = searchParams.get("id")

    const busyHour = await BusyHour.findOne({ _id: busyHourId, doctorId: auth.sub })
    if (!busyHour) return error("Busy hour not found", 404)

    await BusyHour.findByIdAndDelete(busyHourId)
    return json({ success: true })
}