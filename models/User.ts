import { Schema, model, models } from "mongoose"

const NameSchema = new Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  { _id: false },
)

const AvailableSlotSchema = new Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true }, // "HH:MM"
    endTime: { type: String, required: true },
    slotDurationMins: { type: Number, required: true },
  },
  { _id: false },
)

const DoctorProfileSchema = new Schema(
  {
    specialization: String,
    yearsExperience: Number,
    qualifications: [String],
    clinicAddress: String,
    availableSlots: [AvailableSlotSchema],
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    bio: String,
    consultationFee: Number,
  },
  { _id: false },
)

const ProfileSchema = new Schema(
  {
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    address: String,
    bloodGroup: String,
    medicalHistory: [String],
    mobileNumber: String,
    // healthStats moved to top-level but keep placeholder here for backwards compatibility
    // Note: units are standardized and not stored. Only numeric values/status are persisted.
    healthStats: {
      bmi: { value: Number, status: String },
      heartRate: { value: Number },
      bloodPressure: { systolic: Number, diastolic: Number }
    }
  },
  { _id: false },
)

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: NameSchema, required: true },
    role: { type: String, enum: ["user", "doctor", "admin"], required: true },
    phone: String,
    avatarUrl: String,
    profile: ProfileSchema,
    // summary of key vitals and stats for users
    // Units are standardized (bpm for heart rate, mmHg for blood pressure) and not stored in DB.
    healthStats: {
      bmi: { value: Number, status: String },
      heartRate: { value: Number },
      bloodPressure: { systolic: Number, diastolic: Number },
      // optional weight in kilograms (no units stored)
      weight: { value: Number },
      // optional height in centimeters (used to compute BMI on the server/client)
      height: { value: Number }
    },
    isVerified: { type: Boolean, default: false },
    doctorProfile: DoctorProfileSchema,
  },
  { timestamps: true },
)

export type IUser = {
  _id: any
  email: string
  passwordHash: string
  name: { first: string; last: string }
  role: "user" | "doctor" | "admin"
  phone?: string
  avatarUrl?: string
  profile?: {
    age?: number
    gender?: "male" | "female" | "other"
    address?: string
    bloodGroup?: string
    medicalHistory?: string[]
    height?: number
    weight?: number
  }
  isVerified: boolean
  doctorProfile?: {
    specialization?: string
    yearsExperience?: number
    qualifications?: string[]
    clinicAddress?: string
    availableSlots?: {
      dayOfWeek: number
      startTime: string
      endTime: string
      slotDurationMins: number
    }[]
    isApproved?: boolean
    approvedBy?: any
    bio?: string
    consultationFee?: number
  }
}

export const User = models.User || model("User", UserSchema)
