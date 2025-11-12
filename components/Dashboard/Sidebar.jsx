import React, { useState, useEffect } from 'react';
import { jsonFetch } from '@/lib/fetcher';
import { Activity, Calendar, FileText, User, LogOut, ChevronDown, Settings, Brain } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
    const [user, setUser] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        jsonFetch('/api/auth/me')
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching user:', err);
                setLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'prediction', label: 'AI Prediction', icon: Brain },
        { id: 'appointments', label: 'Book Appointment', icon: Calendar },
        { id: 'my-appointments', label: 'My Appointments', icon: FileText },
        { id: 'reports', label: 'Medical Reports', icon: FileText },
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
            doctor: { label: 'Doctor', color: 'bg-blue-100 text-blue-700' },
            user: { label: 'Patient', color: 'bg-green-100 text-green-700' }
        };
        return badges[role] || badges.user;
    };

    if (loading) {
        return (
            <div className="w-64 bg-white shadow-lg flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white shadow-lg flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">CareMate</h1>
                        <p className="text-xs text-gray-500">Patient Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all ${activeTab === item.id
                            ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="border-t border-gray-100">
                {user && (
                    <div className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="relative">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {getInitials(user.name)}
                                        </span>
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className="mb-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role).color}`}>
                                {getRoleBadge(user.role).label}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <Settings size={16} />
                                <span>Profile Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}