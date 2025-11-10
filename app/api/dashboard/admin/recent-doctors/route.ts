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

    // Get recently registered doctors (last 10)
    const doctors = await User.find({ role: "doctor" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const formattedDoctors = doctors.map(doc => ({
      _id: doc._id,
      name: `${doc.name?.first || ''} ${doc.name?.last || ''}`.trim() || 'Unknown',
      email: doc.email,
      phone: doc.phone,
      specialization: doc.doctor?.specialization,
      verified: doc.doctor?.verified || false
    }))

    return NextResponse.json(formattedDoctors)
  } catch (error) {
    console.error('Error fetching recent doctors:', error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}
