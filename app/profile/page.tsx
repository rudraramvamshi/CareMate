"use client"
import useSWR from "swr"
import { useUser } from "@/hooks/use-user"
import { jsonFetch } from "@/lib/fetcher"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"

export function ProfilePanel() {
  const { user } = useUser()
  const userId = (user as any)?.id || (user as any)?._id
  const { data, mutate } = useSWR(userId ? `/api/users/${userId}` : null, (url) => jsonFetch(url))
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [weight, setWeight] = useState<string>("") // kg
  const [height, setHeight] = useState<string>("") // cm or meters
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false })

  useEffect(() => {
    if (data) {
      setAddress((data as any)?.profile?.address || "")
      setPhone((data as any)?.phone || "")
      const hs = (data as any)?.healthStats || {}
      if (hs.weight !== undefined && hs.weight !== null) setWeight(String(hs.weight))
      if (hs.height !== undefined && hs.height !== null) setHeight(String(hs.height))
    }
  }, [data])

  async function save() {
    setSaving(true)
    try {
      if (!userId) throw new Error('Not authenticated')
      // compute BMI from weight (kg) and height (cm or meters)
      const w = weight ? Number(String(weight).replace(',', '.')) : undefined
      const hRaw = height ? Number(String(height).replace(',', '.')) : undefined
      let hMeters: number | undefined = undefined
      if (hRaw !== undefined && !Number.isNaN(hRaw)) {
        if (hRaw > 3) {
          // likely cm
          hMeters = hRaw / 100
        } else {
          // meters
          hMeters = hRaw
        }
      }
      let bmi: number | undefined = undefined
      if (w && hMeters && hMeters > 0) {
        bmi = +(w / (hMeters * hMeters)).toFixed(1)
      }

      const payload: any = {
        phone,
        profile: { ...((data as any)?.profile || {}), address },
        healthStats: {
          weight: w,
          height: hRaw,
          bmi
        }
      }
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      await mutate()
      setToast({ message: 'Profile updated successfully!', type: 'success', visible: true })
      setTimeout(() => setToast({ message: '', type: 'success', visible: false }), 3000)
    } catch (err) {
      setToast({ message: 'Failed to update profile', type: 'error', visible: true })
      setTimeout(() => setToast({ message: '', type: 'error', visible: false }), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (!user) return (
    <div className="max-w-2xl mx-auto">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  const getUserName = () => {
    if (typeof user.name === 'string') return user.name;
    return `${user.name?.first || ''} ${user.name?.last || ''}`.trim() || 'User';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <span>Weight (kg)</span>
              </label>
              <Input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <span>Height (cm or m)</span>
              </label>
              <Input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 170 or 1.7"
                inputMode="decimal"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 inline-block">Body Mass Index (BMI)</label>
            <div className="text-gray-700">{(() => {
              const w = weight ? Number(String(weight).replace(',', '.')) : undefined
              const hRaw = height ? Number(String(height).replace(',', '.')) : undefined
              let hMeters: number | undefined
              if (hRaw !== undefined && !Number.isNaN(hRaw)) {
                hMeters = hRaw > 3 ? hRaw / 100 : hRaw
              }
              if (w && hMeters && hMeters > 0) {
                return (w / (hMeters * hMeters)).toFixed(1)
              }
              return '—'
            })()}</div>
            <p className="text-xs text-gray-500 mt-1">We calculate BMI from weight and height. Units are kg and cm (or meters). BMI is not stored as an editable field.</p>
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
  )
}

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfilePanel />
    </DashboardLayout>
  )
}
