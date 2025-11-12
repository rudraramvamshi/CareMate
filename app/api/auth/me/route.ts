import { connectDB } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET() {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const user = await User.findById(auth.sub).select("-passwordHash").lean()
  if (!user) return error("Not found", 404)
  const u: any = user

  // Format response
  const formattedUser = {
    id: String(u._id),
    email: u.email,
    // keep legacy string name for UI but also expose the profile object
    name: u.name ? `${u.name.first} ${u.name.last}` : 'User',
    role: u.role,
    phone: u.phone,
    avatarUrl: u.avatarUrl,
    profile: u.profile,
    // Expose healthStats (top-level or profile fallback) so client can display vitals
    healthStats: u.healthStats || u.profile?.healthStats || undefined,
    isVerified: u.isVerified,
    doctorProfile: u.doctorProfile
  }

  return json(formattedUser)
}
