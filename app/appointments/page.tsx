"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"
import dayjs from "dayjs"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout"
import { Calendar, Clock, User } from "lucide-react"
import { Button } from '@/components/ui/button'

export function AppointmentsPanel() {
  const [showHistory, setShowHistory] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const when = showHistory ? 'past' : 'upcoming'
  const fetcher = (url: string) => jsonFetch(url) as Promise<{ items: any[]; total: number }>
  const { data } = useSWR<{ items: any[]; total: number }>(
    `/api/appointments?when=${when}&page=${page}&pageSize=${pageSize}`,
    fetcher
  )
  const items = (data?.items as any[]) || []
  const total = (data?.total as number) || 0

  // fetch totals for both upcoming and past to show accurate counts in toggle buttons
  const { data: upcomingCountData } = useSWR<{ items: any[]; total: number }>(
    `/api/appointments?when=upcoming&page=1&pageSize=1`,
    fetcher
  )
  const { data: pastCountData } = useSWR<{ items: any[]; total: number }>(
    `/api/appointments?when=past&page=1&pageSize=1`,
    fetcher
  )
  const upcomingTotalCount = (upcomingCountData?.total as number) || 0
  const pastTotalCount = (pastCountData?.total as number) || 0

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const now = dayjs()
  const BUFFER_MINUTES = parseInt(process.env.NEXT_PUBLIC_APPT_BUFFER_MINUTES || '5', 10)
  // Use appointment start time to decide upcoming vs past
  const upcoming = items.filter(a => {
    const start = dayjs(a.start)
    // future starts are upcoming
    if (start.isAfter(now)) return true
    // treat appointments that started within the last BUFFER_MINUTES as upcoming (grace window)
    if (start.isBefore(now) && start.isAfter(now.subtract(BUFFER_MINUTES, 'minute'))) return true
    // edge-case: starts exactly now (same minute) treat as upcoming
    if (start.isSame(now, 'minute')) return true
    return false
  })
  const past = items.filter(a => {
    const start = dayjs(a.start)
    // started before the buffer window => past
    if (start.isBefore(now.subtract(BUFFER_MINUTES, 'minute'))) return true
    // include same-day completed appointments in history
    if (a.status === 'completed') return true
    return false
  })

  const listToShow = showHistory ? past : upcoming

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your appointments — upcoming or past</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowHistory(false)} className={`px-3 py-2 rounded ${!showHistory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            Upcoming ({upcomingTotalCount})
          </button>
          <button onClick={() => setShowHistory(true)} className={`px-3 py-2 rounded ${showHistory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            History ({pastTotalCount})
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {listToShow.map((a) => (
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
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}</div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <Button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyAppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsPanel />
    </DashboardLayout>
  )
}
