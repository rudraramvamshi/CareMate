import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  const awaitedParams: any = await params
  const id = awaitedParams.id
  if (auth.sub !== id && auth.role !== "admin") return error("Forbidden", 403)
  try {
    await connectDB()
  } catch (err: any) {
    if (err?.isDbConnectionError || err?.original) {
      console.error('[GET /api/users/:id] DB connect failed:', err.original || err)
      return error('Service temporarily unavailable: unable to connect to the database. Check MONGODB_URI and network/DNS.', 503)
    }
    throw err
  }

  const user = await User.findById(id).select("-passwordHash")
  if (!user) return error("Not found", 404)
  return json(user)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  const awaitedParams: any = await params
  const id = awaitedParams.id
  if (auth.sub !== id && auth.role !== "admin") return error("Forbidden", 403)
  try {
    await connectDB()
  } catch (err: any) {
    // If connectDB tagged the error, return a friendly 503 with some diagnostics (non-sensitive)
    if (err?.isDbConnectionError || err?.original) {
      console.error('[PUT /api/users/:id] DB connect failed:', err.original || err)
      return error('Service temporarily unavailable: unable to connect to the database. Check MONGODB_URI and network/DNS.', 503)
    }
    throw err
  }
  const body = await req.json()
  const update: any = {}
  if (body?.profile) update.profile = body.profile
  if (body?.phone !== undefined) update.phone = body.phone
  if (body?.name) update.name = body.name
  if (body?.healthStats) {
    const hs = body.healthStats
    const sanitized: any = {}
    if (hs.bmi) sanitized.bmi = { value: hs.bmi?.value !== undefined ? Number(hs.bmi.value) : undefined, status: hs.bmi?.status }
    if (hs.heartRate) sanitized.heartRate = { value: hs.heartRate?.value !== undefined ? Number(hs.heartRate.value) : undefined }
    if (hs.bloodPressure) {
      // accept older string '120/80' or object { systolic, diastolic }
      let systolic: number | undefined, diastolic: number | undefined
      if (typeof hs.bloodPressure === 'string') {
        const parts = hs.bloodPressure.split('/').map((p: string) => parseInt(p, 10))
        systolic = parts[0] || undefined
        diastolic = parts[1] || undefined
      } else {
        systolic = hs.bloodPressure.systolic !== undefined ? Number(hs.bloodPressure.systolic) : (hs.bloodPressure?.value && typeof hs.bloodPressure.value === 'string' ? Number(hs.bloodPressure.value.split('/')[0]) : undefined)
        diastolic = hs.bloodPressure.diastolic !== undefined ? Number(hs.bloodPressure.diastolic) : (hs.bloodPressure?.value && typeof hs.bloodPressure.value === 'string' ? Number(hs.bloodPressure.value.split('/')[1]) : undefined)
      }
      sanitized.bloodPressure = { systolic, diastolic }
    }
    // accept weight and height (numeric values only)
    if (hs.weight) {
      sanitized.weight = { value: hs.weight?.value !== undefined ? Number(hs.weight.value) : undefined }
    }
    if (hs.height) {
      sanitized.height = { value: hs.height?.value !== undefined ? Number(hs.height.value) : undefined }
    }
    update.healthStats = sanitized
  }
  if (Object.keys(update).length > 0) {
    console.log('[PUT /api/users/:id] auth.sub=', auth.sub, 'id=', id, 'update=', JSON.stringify(update))
    await User.findByIdAndUpdate(id, { $set: update })
    const updated = await User.findById(id).select('-passwordHash')
    console.log('[PUT /api/users/:id] updated=', updated?._id)
    return json({ success: true, updated })
  }
  console.log('[PUT /api/users/:id] no update fields present, body ignored')
  return json({ success: true })
}
