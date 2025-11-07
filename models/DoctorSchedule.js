// models/DoctorSchedule.ts
import { Schema, model, models } from "mongoose"

// Free Slots - Regular availability
const FreeSlotSchema = new Schema(
    {
        doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0 = Sunday, 6 = Saturday
        startTime: { type: String, required: true }, // "HH:MM" format
        endTime: { type: String, required: true }, // "HH:MM" format
        slotDurationMins: { type: Number, default: 30 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

// Leave/Holiday - Doctor not available
const DoctorLeaveSchema = new Schema(
    {
        doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true, index: true },
        leaveType: {
            type: String,
            enum: ["vacation", "sick", "emergency", "personal", "conference", "other"],
            default: "personal",
        },
        reason: String,
        isApproved: { type: Boolean, default: true }, // Can add approval workflow later
    },
    { timestamps: true }
)

// Busy Hours - Doctor busy for specific time
const BusyHourSchema = new Schema(
    {
        doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        date: { type: Date, required: true, index: true }, // Specific date for one-time busy
        startTime: { type: String, required: true }, // "HH:MM"
        endTime: { type: String, required: true }, // "HH:MM"
        isRecurring: { type: Boolean, default: false },
        dayOfWeek: { type: Number, min: 0, max: 6 }, // For recurring weekly busy hours
        reason: String, // e.g., "Lunch break", "Surgery", "Meeting"
    },
    { timestamps: true }
)

export const FreeSlot = models.FreeSlot || model("FreeSlot", FreeSlotSchema)
export const DoctorLeave = models.DoctorLeave || model("DoctorLeave", DoctorLeaveSchema)
export const BusyHour = models.BusyHour || model("BusyHour", BusyHourSchema)