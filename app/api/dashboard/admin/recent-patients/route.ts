import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"

export async function GET() {
    const auth = await requireAuth(["admin"])
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        await connectDB()

        // Get recently registered patients (last 10)
        const patients = await User.find({ role: "user" })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()

        const formattedPatients = patients.map(patient => ({
            _id: patient._id,
            name: `${patient.name?.first || ''} ${patient.name?.last || ''}`.trim() || 'Unknown',
            email: patient.email,
            phone: patient.phone,
            age: patient.profile?.age,
            bloodGroup: patient.profile?.bloodGroup
        }))

        return NextResponse.json(formattedPatients)
    } catch (error) {
        console.error('Error fetching recent patients:', error)
        return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
    }
}
