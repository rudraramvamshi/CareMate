import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { User } from "@/models/User"
import dayjs from "dayjs"

export async function GET() {
    const auth = await requireAuth(["doctor"])
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        await connectDB()

        const doctorId = auth.userId
        const startOfToday = dayjs().startOf('day').toDate()
        const endOfToday = dayjs().endOf('day').toDate()

        // Get today's appointments with patient details
        const appointments = await Appointment.find({
            doctorId,
            start: { $gte: startOfToday, $lte: endOfToday }
        }).sort({ start: 1 }).lean()

        // Fetch patient details
        const appointmentsWithPatients = await Promise.all(
            appointments.map(async (apt) => {
                try {
                    const patient = await User.findById(apt.patientId).lean()
                    return {
                        ...apt,
                        patient: patient ? {
                            name: `${patient.name?.first || ''} ${patient.name?.last || ''}`.trim() || 'Unknown',
                            email: patient.email,
                            phone: patient.phone,
                            age: patient.profile?.age,
                            bloodGroup: patient.profile?.bloodGroup
                        } : null
                    }
                } catch (err) {
                    return { ...apt, patient: null }
                }
            })
        )

        return NextResponse.json(appointmentsWithPatients)
    } catch (error) {
        console.error('Error fetching today appointments:', error)
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
    }
}
