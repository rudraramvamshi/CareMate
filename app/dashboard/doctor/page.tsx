'use client'

import DoctorDashboard from './DoctorDashboard'
import DoctorSchedule from './DoctorSchedule'
import DashboardLayout from '@/components/DashboardLayout'
import { useSearchParams } from 'next/navigation'
import AppointmentsPage from '../../appointments/page'
import PrescriptionsPage from '../../prescriptions/page'
import ProfilePage from '../../profile/page'

export default function DoctorDashboardPage() {
  const searchParams = useSearchParams()
  const tab = searchParams?.get('tab') || 'dashboard'

  let Content: any = DoctorDashboard
  if (tab === 'schedule') Content = DoctorSchedule
  else if (tab === 'appointments') Content = AppointmentsPage
  else if (tab === 'prescriptions') Content = PrescriptionsPage
  else if (tab === 'profile') Content = ProfilePage

  return (
    <DashboardLayout>
      <Content />
    </DashboardLayout>
  )
}
