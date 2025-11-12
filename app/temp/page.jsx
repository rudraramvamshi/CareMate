'use client'

import React, { useState } from 'react';
import { Calendar, FileText, User, Settings, Activity, Droplet, Heart, Weight, Bell, ChevronRight } from 'lucide-react';

export default function HealthCareDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const appointments = [
        { id: 1, doctor: 'Dr. Michael Chen', specialty: 'Cardiologist', date: 'Oct 15, 2024', time: '10:30 AM', avatar: '👨‍⚕️' },
        { id: 2, doctor: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', date: 'Oct 18, 2024', time: '2:15 PM', avatar: '👩‍⚕️' }
    ];

    const predictions = [
        { condition: 'Common Cold', symptoms: 'Based on: symptoms: fever, cough, runny nose', confidence: '92% Confidence', date: 'Oct 10, 2024', color: 'bg-green-100 text-green-700' },
        { condition: 'Migraine', symptoms: 'Based on: symptoms: headache, sensitivity to light', confidence: '78% Confidence', date: 'Oct 8, 2024', color: 'bg-yellow-100 text-yellow-700' }
    ];

    const healthMetrics = [
        { label: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-red-500' },
        { label: 'Heart Rate', value: '72 BPM', icon: Heart, color: 'text-pink-500' },
        { label: 'BMI', value: '22.5', icon: Activity, color: 'text-blue-500' },
        { label: 'Weight', value: '65 kg', icon: Weight, color: 'text-purple-500' }
    ];

    const reminders = [
        { title: 'Take Medication', time: 'Today • 2:00 PM', icon: '💊', color: 'bg-orange-100' },
        { title: 'Blood Test', time: 'Tomorrow • 12:30 AM', icon: '🩸', color: 'bg-blue-100' }
    ];

    const healthTips = [
        { title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water daily for optimal health.', icon: Droplet, color: 'text-blue-500' },
        { title: 'Exercise Regularly', description: '30 minutes of daily exercise can improve your overall health.', icon: Activity, color: 'text-green-500' }
    ];

    const appointmentData = [4, 3, 5, 3, 4, 3];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Activity className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">HealthCare AI</h1>
                            <p className="text-xs text-gray-500">Patient Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-6">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Activity size={20} />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('prediction')}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left ${activeTab === 'prediction' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Activity size={20} />
                        <span className="font-medium">AI Prediction</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Calendar size={20} />
                        <span className="font-medium">Book Appointment</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-600 hover:bg-gray-50">
                        <FileText size={20} />
                        <span className="font-medium">My Appointments</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-600 hover:bg-gray-50">
                        <FileText size={20} />
                        <span className="font-medium">Medical Reports</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-600 hover:bg-gray-50">
                        <User size={20} />
                        <span className="font-medium">Profile Settings</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="px-8 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Good Morning, Sarah!</h2>
                            <p className="text-gray-500">Here's your health overview for today</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 hover:bg-gray-100 rounded-full">
                                <Bell size={24} className="text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                                    <p className="text-xs text-gray-500">Sarah Johnson</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    SJ
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-8">
                    {/* Top Cards */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-blue-700 font-semibold mb-2">AI Disease Prediction</p>
                                    <p className="text-sm text-blue-600">Get instant health insights</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Activity className="text-white" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-green-700 font-semibold mb-2">Book Appointment</p>
                                    <p className="text-sm text-green-600">Schedule with specialists</p>
                                </div>
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <Calendar className="text-white" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-purple-700 font-semibold mb-2">My Reports</p>
                                    <p className="text-sm text-purple-600">View medical history</p>
                                </div>
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <FileText className="text-white" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="col-span-2 space-y-8">
                            {/* Upcoming Appointments */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                                    <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {appointments.map((apt) => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                                    {apt.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{apt.doctor}</p>
                                                    <p className="text-sm text-gray-500">{apt.specialty}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">{apt.date}</p>
                                                <p className="text-sm text-gray-500">{apt.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent AI Predictions */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Recent AI Predictions</h3>
                                <div className="space-y-4">
                                    {predictions.map((pred, idx) => (
                                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-800">{pred.condition}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pred.color}`}>
                                                    {pred.confidence}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{pred.symptoms}</p>
                                            <p className="text-xs text-gray-400">Predicted on {pred.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Health Analytics */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Health Analytics</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Appointments Chart */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-semibold text-gray-600">Appointments per Month</h4>
                                        </div>
                                        <div className="flex items-end justify-between h-40 space-x-2">
                                            {appointmentData.map((value, idx) => (
                                                <div key={idx} className="flex-1 flex flex-col items-center">
                                                    <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height: `${value * 20}%` }}></div>
                                                    <span className="text-xs text-gray-500 mt-2">{months[idx]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Consultations Pie */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-semibold text-gray-600">Consultations by Specialty</h4>
                                        </div>
                                        <div className="flex items-center justify-center h-40">
                                            <div className="relative w-32 h-32">
                                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="75.4 251.2" />
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-75.4" />
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="20" strokeDasharray="50.3 251.2" strokeDashoffset="-138.2" />
                                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-188.5" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                                    <span className="text-gray-600">General</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                                    <span className="text-gray-600">Cardiology</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                                    <span className="text-gray-600">Dermatology</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Health Tips */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Health Tips</h3>
                                <div className="space-y-4">
                                    {healthTips.map((tip, idx) => (
                                        <div key={idx} className="flex space-x-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
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

                            {/* Health Metrics */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Health Metrics</h3>
                                <div className="space-y-4">
                                    {healthMetrics.map((metric, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <metric.icon size={20} className={metric.color} />
                                                <span className="text-sm text-gray-600">{metric.label}</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{metric.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reminders */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Reminders</h3>
                                <div className="space-y-3">
                                    {reminders.map((reminder, idx) => (
                                        <div key={idx} className={`flex items-center space-x-3 p-3 ${reminder.color} rounded-lg`}>
                                            <span className="text-2xl">{reminder.icon}</span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-sm">{reminder.title}</p>
                                                <p className="text-xs text-gray-600">{reminder.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}