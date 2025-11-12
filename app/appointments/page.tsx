"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"
import dayjs from "dayjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout"
import { Calendar, Clock, User } from "lucide-react"

export function AppointmentsContent() {
  const { data } = useSWR("/api/appointments", (url) => jsonFetch(url))
  const items = (data as any[]) || []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-600 mt-2">View and manage all your appointments</p>
      </div>

      <div className="grid gap-4">
        {items.map((a) => (
          <Card key={a._id} className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="text-blue-600" size={20} />
                  <span>{dayjs(a.start).format("MMMM DD, YYYY")}</span>
                </CardTitle>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(a.status)}`}>
                  {a.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm">{dayjs(a.start).format("h:mm A")} - {dayjs(a.end).format("h:mm A")}</span>
              </div>
              {a.notes && (
                <p className="text-sm text-gray-600 border-l-4 border-blue-200 pl-3 py-1">
                  {a.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No appointments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MyAppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsContent />
    </DashboardLayout>
  )
}
