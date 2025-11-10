// app/api/doctor/schedule/leave/route.ts
import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { DoctorLeave } from "@/models/DoctorSchedule"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
    const auth = await requireAuth(["doctor", "admin"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get("doctorId") || auth.sub

    const leaves = await DoctorLeave.find({ doctorId }).sort({ startDate: -1 })
    return json(leaves)
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth(["doctor"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const body = await req.json()
    const { startDate, endDate, leaveType = "personal", reason } = body

    if (!startDate || !endDate) return error("Start and end date required", 400)

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) return error("Invalid date range", 400)

    const leave = await DoctorLeave.create({
        doctorId: auth.sub,
        startDate: start,
        endDate: end,
        leaveType,
        reason,
        isApproved: true,
    })

    return json({ success: true, leaveId: leave._id })
}

export async function DELETE(req: NextRequest) {
    const auth = await requireAuth(["doctor"])
    if (!auth) return error("Unauthorized", 401)
    await connectDB()

    const { searchParams } = new URL(req.url)
    const leaveId = searchParams.get("id")

    const leave = await DoctorLeave.findOne({ _id: leaveId, doctorId: auth.sub })
    if (!leave) return error("Leave not found", 404)

    await DoctorLeave.findByIdAndDelete(leaveId)
    return json({ success: true })
}
