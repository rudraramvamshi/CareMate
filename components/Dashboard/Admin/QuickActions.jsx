'use client'

import React from 'react';
import { BarChart, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
    const actions = [
        {
            title: 'Approve Doctors',
            description: 'Review pending applications',
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            href: '/admin/approve-doctors'
        },
        {
            title: 'View Analytics',
            description: 'System analytics & reports',
            icon: BarChart,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            href: '/analytics'
        },
        {
            title: 'All Appointments',
            description: 'Manage all bookings',
            icon: Calendar,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            href: '/appointments'
        },
        {
            title: 'System Settings',
            description: 'Configure platform',
            icon: Settings,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50',
            href: '/settings'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, idx) => (
                    <Link
                        key={idx}
                        href={action.href}
                        className={`flex flex-col items-center p-4 ${action.bgColor} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                    >
                        <action.icon size={24} className={action.color} />
                        <p className="font-semibold text-gray-800 text-sm mt-2 text-center">{action.title}</p>
                        <p className="text-xs text-gray-600 mt-1 text-center">{action.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
