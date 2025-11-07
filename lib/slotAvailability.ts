// lib/slotAvailability.ts
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
import { FreeSlot, DoctorLeave, BusyHour } from '@/models/DoctorSchedule'
import { Appointment } from '@/models/Appointment'

export interface TimeSlot {
    start: Date
    end: Date
    available: boolean
}

/**
 * Get available appointment slots for a doctor on a specific date
 * Takes into account: free slots, leaves, busy hours, and existing appointments
 */
export async function getAvailableSlots(doctorId: string, date: Date): Promise<TimeSlot[]> {
    const targetDate = dayjs(date).startOf('day')
    const dayOfWeek = targetDate.day()

    // 1. Get doctor's free slots for this day of week
    const freeSlots = await FreeSlot.find({
        doctorId,
        dayOfWeek,
        isActive: true
    })

    if (freeSlots.length === 0) {
        return [] // Doctor doesn't work on this day
    }

    // 2. Check if doctor is on leave
    const leaves = await DoctorLeave.find({
        doctorId,
        startDate: { $lte: targetDate.toDate() },
        endDate: { $gte: targetDate.toDate() }
    })

    if (leaves.length > 0) {
        return [] // Doctor is on leave
    }

    // 3. Get busy hours for this date (both one-time and recurring)
    const busyHours = await BusyHour.find({
        doctorId,
        $or: [
            // One-time busy hours for this specific date
            {
                isRecurring: false,
                date: {
                    $gte: targetDate.toDate(),
                    $lt: targetDate.add(1, 'day').toDate()
                }
            },
            // Recurring weekly busy hours for this day of week
            {
                isRecurring: true,
                dayOfWeek
            }
        ]
    })

    // 4. Get existing appointments for this date
    const appointments = await Appointment.find({
        doctorId,
        start: {
            $gte: targetDate.toDate(),
            $lt: targetDate.add(1, 'day').toDate()
        },
        status: { $in: ['confirmed', 'pending'] }
    })

    // 5. Generate all possible slots from free slots
    const allSlots: TimeSlot[] = []

    for (const freeSlot of freeSlots) {
        const [startHour, startMin] = freeSlot.startTime.split(':').map(Number)
        const [endHour, endMin] = freeSlot.endTime.split(':').map(Number)

        let currentSlotStart = targetDate.hour(startHour).minute(startMin).second(0)
        const slotEnd = targetDate.hour(endHour).minute(endMin).second(0)

        while (currentSlotStart.isBefore(slotEnd)) {
            const currentSlotEnd = currentSlotStart.add(freeSlot.slotDurationMins, 'minute')

            if (currentSlotEnd.isAfter(slotEnd)) break

            // Check if slot is available
            const isAvailable = checkSlotAvailability(
                currentSlotStart.toDate(),
                currentSlotEnd.toDate(),
                busyHours,
                appointments
            )

            allSlots.push({
                start: currentSlotStart.toDate(),
                end: currentSlotEnd.toDate(),
                available: isAvailable
            })

            currentSlotStart = currentSlotEnd
        }
    }

    return allSlots
}

/**
 * Check if a specific time slot is available
 * Returns false if slot conflicts with busy hours or appointments
 */
function checkSlotAvailability(
    slotStart: Date,
    slotEnd: Date,
    busyHours: any[],
    appointments: any[]
): boolean {
    const slotStartTime = dayjs(slotStart)
    const slotEndTime = dayjs(slotEnd)

    // Check busy hours
    for (const busy of busyHours) {
        const [busyStartHour, busyStartMin] = busy.startTime.split(':').map(Number)
        const [busyEndHour, busyEndMin] = busy.endTime.split(':').map(Number)

        const busyStart = slotStartTime.hour(busyStartHour).minute(busyStartMin)
        const busyEnd = slotStartTime.hour(busyEndHour).minute(busyEndMin)

        // Check for overlap
        if (
            (slotStartTime.isSameOrAfter(busyStart) && slotStartTime.isBefore(busyEnd)) ||
            (slotEndTime.isAfter(busyStart) && slotEndTime.isSameOrBefore(busyEnd)) ||
            (slotStartTime.isSameOrBefore(busyStart) && slotEndTime.isSameOrAfter(busyEnd))
        ) {
            return false // Conflicts with busy hour
        }
    }

    // Check appointments
    for (const appt of appointments) {
        const apptStart = dayjs(appt.start)
        const apptEnd = dayjs(appt.end)

        // Check for overlap
        if (
            (slotStartTime.isSameOrAfter(apptStart) && slotStartTime.isBefore(apptEnd)) ||
            (slotEndTime.isAfter(apptStart) && slotEndTime.isSameOrBefore(apptEnd)) ||
            (slotStartTime.isSameOrBefore(apptStart) && slotEndTime.isSameOrAfter(apptEnd))
        ) {
            return false // Conflicts with appointment
        }
    }

    return true // Slot is available
}

/**
 * Validate if an appointment can be booked at specific time
 */
export async function validateAppointmentTime(
    doctorId: string,
    start: Date,
    end: Date,
    excludeAppointmentId?: string
): Promise<{ valid: boolean; reason?: string }> {
    const startDate = dayjs(start)
    const endDate = dayjs(end)

    // Check if in past
    if (startDate.isBefore(dayjs())) {
        return { valid: false, reason: 'Cannot book appointments in the past' }
    }

    // Check if start is before end
    if (startDate.isSameOrAfter(endDate)) {
        return { valid: false, reason: 'Start time must be before end time' }
    }

    const dayOfWeek = startDate.day()

    // 1. Check free slots
    const freeSlots = await FreeSlot.find({
        doctorId,
        dayOfWeek,
        isActive: true
    })

    if (freeSlots.length === 0) {
        return { valid: false, reason: 'Doctor does not work on this day' }
    }

    // Verify time falls within free slot
    const startTime = startDate.format('HH:mm')
    const endTime = endDate.format('HH:mm')

    const withinFreeSlot = freeSlots.some(slot => {
        return startTime >= slot.startTime && endTime <= slot.endTime
    })

    if (!withinFreeSlot) {
        return { valid: false, reason: 'Time is outside doctor\'s working hours' }
    }

    // 2. Check leaves
    const leaves = await DoctorLeave.find({
        doctorId,
        startDate: { $lte: startDate.toDate() },
        endDate: { $gte: startDate.toDate() }
    })

    if (leaves.length > 0) {
        return { valid: false, reason: 'Doctor is on leave on this date' }
    }

    // 3. Check busy hours
    const busyHours = await BusyHour.find({
        doctorId,
        $or: [
            {
                isRecurring: false,
                date: {
                    $gte: startDate.startOf('day').toDate(),
                    $lt: startDate.add(1, 'day').startOf('day').toDate()
                }
            },
            {
                isRecurring: true,
                dayOfWeek
            }
        ]
    })

    for (const busy of busyHours) {
        const [busyStartHour, busyStartMin] = busy.startTime.split(':').map(Number)
        const [busyEndHour, busyEndMin] = busy.endTime.split(':').map(Number)

        const busyStart = startDate.hour(busyStartHour).minute(busyStartMin)
        const busyEnd = startDate.hour(busyEndHour).minute(busyEndMin)

        if (
            (startDate.isSameOrAfter(busyStart) && startDate.isBefore(busyEnd)) ||
            (endDate.isAfter(busyStart) && endDate.isSameOrBefore(busyEnd)) ||
            (startDate.isSameOrBefore(busyStart) && endDate.isSameOrAfter(busyEnd))
        ) {
            return { valid: false, reason: 'Doctor is busy during this time' }
        }
    }

    // 4. Check existing appointments
    const query: any = {
        doctorId,
        start: { $lt: endDate.toDate() },
        end: { $gt: startDate.toDate() },
        status: { $in: ['confirmed', 'pending'] }
    }

    if (excludeAppointmentId) {
        query._id = { $ne: excludeAppointmentId }
    }

    const conflictingAppts = await Appointment.find(query)

    if (conflictingAppts.length > 0) {
        return { valid: false, reason: 'Time slot is already booked' }
    }

    return { valid: true }
}