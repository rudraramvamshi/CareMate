// app/api/doctor/schedule/available-slots/route.ts
import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { getAvailableSlots } from "@/lib/slotAvailability"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    if (!doctorId || !date) {
        return error("Doctor ID and date required", 400)
    }

    try {
        const slots = await getAvailableSlots(doctorId, new Date(date))
        return json({ slots })
    } catch (err) {
        console.error('Error getting available slots:', err)
        return error("Failed to get available slots", 500)
    }
}