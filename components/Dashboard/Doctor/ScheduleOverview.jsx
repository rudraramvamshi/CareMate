'use client'

import React from 'react';
import { Calendar, Clock, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function ScheduleOverview() {
    const scheduleTips = [
        {
            title: 'Manage Free Slots',
            description: 'Set your available time slots for appointments',
            icon: Calendar,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Set Busy Hours',
            description: 'Block time for breaks and personal tasks',
            icon: Coffee,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'Mark Leave Days',
            description: 'Schedule your vacations and time off',
            icon: Clock,
            color: 'text-green-500',
            bgColor: 'bg-green-50'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Schedule Management</h3>
                <Link
                    href="/dashboard/doctor?tab=schedule"
                    className="text-blue-600 text-sm font-medium hover:underline"
                >
                    Manage Schedule
                </Link>
            </div>
            <div className="space-y-4">
                {scheduleTips.map((tip, idx) => (
                    <div key={idx} className={`flex space-x-3 p-4 ${tip.bgColor} rounded-lg`}>
                        <div className={`${tip.color} mt-1`}>
                            <tip.icon size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{tip.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
