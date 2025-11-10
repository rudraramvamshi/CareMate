'use client'

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

export default function RecentPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/admin/recent-patients')
            .then(res => res.json())
            .then(data => {
                setPatients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching patients:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Recently Registered Patients</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recently Registered Patients</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <div key={patient._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{patient.name}</p>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                            <Mail size={12} />
                                            <span>{patient.email}</span>
                                        </div>
                                        {patient.phone && (
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <Phone size={12} />
                                                <span>{patient.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                {patient.age && <p className="text-sm text-gray-600">Age: {patient.age}</p>}
                                {patient.bloodGroup && (
                                    <p className="text-xs text-gray-500 mt-1">{patient.bloodGroup}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent patients</p>
                )}
            </div>
        </div>
    );
}
