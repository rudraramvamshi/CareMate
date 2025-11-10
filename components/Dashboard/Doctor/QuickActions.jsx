'use client'

import React from 'react';
import { Calendar, FileText, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
    const actions = [
        {
            title: 'View Prescriptions',
            description: 'Manage patient prescriptions',
            icon: FileText,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            href: '/prescriptions'
        },
        {
            title: 'My Patients',
            description: 'View all your patients',
            icon: Users,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            href: '/dashboard/doctor?tab=patients'
        },
        {
            title: 'All Appointments',
            description: 'View complete schedule',
            icon: Calendar,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            href: '/appointments'
        },
        {
            title: 'Profile Settings',
            description: 'Update your information',
            icon: Settings,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50',
            href: '/profile'
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
