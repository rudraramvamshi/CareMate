'use client'

import React, { useState } from 'react';
import DoctorTopCards from '@/components/Dashboard/Doctor/TopCards';
import TodayAppointments from '@/components/Dashboard/Doctor/TodayAppointments';
import RecentPatients from '@/components/Dashboard/Doctor/RecentPatients';
import UpcomingAppointments from '@/components/Dashboard/Doctor/UpcomingAppointments';
import ScheduleOverview from '@/components/Dashboard/Doctor/ScheduleOverview';
import QuickActions from '@/components/Dashboard/Doctor/QuickActions';
import DoctorSchedule from './DoctorSchedule';

export default function CompleteDoctorDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  if (activeView === 'schedule') {
    return <DoctorSchedule />;
  }

  return (
    <div>
      {/* Top Stats Cards */}
      <DoctorTopCards />

      {/* Main Content Grid */}
      <div className='grid grid-cols-3 gap-8'>
        {/* Left Column - 2/3 width */}
        <div className='col-span-2 space-y-8'>
          <TodayAppointments />
          <UpcomingAppointments />
        </div>

        {/* Right Column - 1/3 width */}
        <div className='space-y-6'>
          <ScheduleOverview />
          <QuickActions />
          <RecentPatients />
        </div>
      </div>
    </div>
  );
}
