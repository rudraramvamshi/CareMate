import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Prescription } from "@/models/Prescription"
import { error, json } from "@/app/api/_utils"

export async function GET() {
    const auth = await requireAuth()
    if (!auth) return error("Unauthorized", 401)
    await connectDB()
    const items = await Prescription.find({ patientId: auth.sub }).sort({ createdAt: -1 }).limit(100)
    return json(items)
}
