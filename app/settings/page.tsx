"use client"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Bell, Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  const { user } = useUser()
  const userId = (user as any)?.id || (user as any)?._id
  const [when, setWhen] = useState<string>("")
  const [saving, setSaving] = useState(false)

  async function addReminder() {
    if (!when) return
    setSaving(true)
    try {
      await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
          medicineName: "Vitamin D",
          schedule: [new Date(when).toISOString()],
          active: true,
        }),
      })
      // minimal success UX
      console.log('Reminder saved')
      setWhen("")
    } catch (err) {
      console.error('Failed to save reminder', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your application settings and preferences</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b">
            <SettingsIcon className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Bell size={16} />
                <span>Test Reminder</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Add a test reminder to verify the notification system</p>
              <input
                className="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
              />
            </div>

            <Button
              onClick={addReminder}
              disabled={!when || saving}
              className="w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Reminder'}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              <strong>Note:</strong> Use POST /api/webhook/send-reminders to simulate sending reminders.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
