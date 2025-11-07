import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const doc = await User.findById(params.id).select("-passwordHash")
  if (!doc || doc.role !== "doctor") return error("Not found", 404)
  return json(doc)
}
