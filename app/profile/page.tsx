"use client"
import useSWR from "swr"
import { useUser } from "@/hooks/use-user"
import { jsonFetch } from "@/lib/fetcher"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"

export default function ProfilePage() {
  const { user } = useUser()
  const { data, mutate } = useSWR(user?._id ? `/api/users/${user._id}` : null, (url) => jsonFetch(url))
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) {
      setAddress((data as any)?.profile?.address || "")
      setPhone((data as any)?.phone || "")
    }
  }, [data])

  async function save() {
    setSaving(true)
    try {
      await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone,
          profile: { ...((data as any)?.profile || {}), address }
        }),
      })
      await mutate()
      alert("Profile updated successfully!")
    } catch (err) {
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (!user) return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-500">Loading...</p>
      </div>
    </DashboardLayout>
  )

  const getUserName = () => {
    if (typeof user.name === 'string') return user.name;
    return `${user.name?.first || ''} ${user.name?.last || ''}`.trim() || 'User';
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
          {/* User Info Display */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {getUserName().split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{getUserName()}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                }`}>
                {user.role === 'doctor' ? 'Doctor' : user.role === 'admin' ? 'Admin' : 'Patient'}
              </span>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} />
                <span>Email</span>
              </label>
              <Input value={user.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} />
                <span>Phone Number</span>
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} />
                <span>Address</span>
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={save}
              disabled={saving}
              className="w-full sm:w-auto flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
