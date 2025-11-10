import DoctorSchedule from '../DoctorSchedule'
import DoctorSidebar from '@/components/Dashboard/Doctor/Sidebar'

export default function DoctorSchedulePage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DoctorSidebar />
            <main className="flex-1 ml-64 p-8">
                <DoctorSchedule />
            </main>
        </div>
    )
}
