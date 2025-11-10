'use client'

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar, Clock, User } from 'lucide-react';

export default function UpcomingAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/upcoming-appointments')
            .then(res => res.json())
            .then(data => {
                setAppointments(data.slice(0, 5));
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching appointments:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Appointments</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <div key={apt._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{apt.patient?.name || 'Patient'}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <Calendar size={12} />
                                                <span>{dayjs(apt.start).format('MMM DD, YYYY')}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span>{dayjs(apt.start).format('h:mm A')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                )}
            </div>
        </div>
    );
}
