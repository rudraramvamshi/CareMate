'use client'

import DoctorDashboard from './DoctorDashboard'
import { DoctorSchedulePanel } from './schedule/page'
import DashboardLayout from '@/components/DashboardLayout'
import { useSearchParams } from 'next/navigation'
import { AppointmentsPanel } from '../../appointments/page'
import { PrescriptionsPanel } from '../../prescriptions/page'
import { ProfilePanel } from '../../profile/page'
import { DoctorProfilePanel } from './profile/page'

export default function DoctorDashboardPage() {
  const searchParams = useSearchParams()
  const tab = searchParams?.get('tab') || 'dashboard'

  let Content: any = DoctorDashboard
  if (tab === 'schedule') Content = DoctorSchedulePanel
  else if (tab === 'appointments') Content = AppointmentsPanel
  else if (tab === 'prescriptions') Content = PrescriptionsPanel
  else if (tab === 'profile') Content = DoctorProfilePanel

  return (
    <DashboardLayout>
      <Content />
    </DashboardLayout>
  )
}
