'use client'

import React, { useEffect, useState } from 'react';
import { UserCheck, Mail, Phone } from 'lucide-react';

export default function RecentDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/admin/recent-doctors')
            .then(res => res.json())
            .then(data => {
                setDoctors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching doctors:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Recently Registered Doctors</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recently Registered Doctors</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <div key={doctor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <UserCheck size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{doctor.name}</p>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                            <Mail size={12} />
                                            <span>{doctor.email}</span>
                                        </div>
                                        {doctor.phone && (
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <Phone size={12} />
                                                <span>{doctor.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                {doctor.specialization && (
                                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                )}
                                {doctor.verified && (
                                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent doctors</p>
                )}
            </div>
        </div>
    );
}
