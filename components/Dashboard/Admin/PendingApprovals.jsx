'use client'

import React, { useEffect, useState } from 'react';
import { UserCheck, Mail, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PendingApprovals() {
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const fetchPendingDoctors = () => {
        fetch('/api/dashboard/admin/pending-approvals')
            .then(res => res.json())
            .then(data => {
                setPendingDoctors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching pending approvals:', err);
                setLoading(false);
            });
    };

    const handleApprove = async (doctorId) => {
        try {
            const response = await fetch(`/api/admin/approve-doctor/${doctorId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: true })
            });

            if (response.ok) {
                fetchPendingDoctors();
            } else {
                alert('Failed to approve doctor');
            }
        } catch (err) {
            console.error('Error approving doctor:', err);
            alert('Failed to approve doctor');
        }
    };

    const handleReject = async (doctorId) => {
        if (!confirm('Are you sure you want to reject this doctor?')) return;

        try {
            const response = await fetch(`/api/admin/approve-doctor/${doctorId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: false })
            });

            if (response.ok) {
                fetchPendingDoctors();
            } else {
                alert('Failed to reject doctor');
            }
        } catch (err) {
            console.error('Error rejecting doctor:', err);
            alert('Failed to reject doctor');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Pending Doctor Approvals</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Pending Doctor Approvals</h3>
                <Link href="/admin/approve-doctors" className="text-blue-600 text-sm font-medium hover:underline">
                    View All
                </Link>
            </div>
            <div className="space-y-4">
                {pendingDoctors.length > 0 ? (
                    pendingDoctors.map((doctor) => (
                        <div key={doctor._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <UserCheck size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{doctor.name}</p>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                                            <Mail size={12} />
                                            <span>{doctor.email}</span>
                                        </div>
                                        {doctor.specialization && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                Specialization: {doctor.specialization}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleApprove(doctor._id)}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs font-medium flex items-center space-x-1"
                                    >
                                        <CheckCircle size={14} />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(doctor._id)}
                                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs font-medium flex items-center space-x-1"
                                    >
                                        <XCircle size={14} />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">No pending approvals</p>
                )}
            </div>
        </div>
    );
}
