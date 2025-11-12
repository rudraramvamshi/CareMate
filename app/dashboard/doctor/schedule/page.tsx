import DoctorSchedule from '../DoctorSchedule'
import DashboardLayout from '@/components/DashboardLayout'

export function DoctorSchedulePanel() {
    return <DoctorSchedule />
}

export default function DoctorSchedulePage() {
    return (
        <DashboardLayout>
            <DoctorSchedulePanel />
        </DashboardLayout>
    )
}
