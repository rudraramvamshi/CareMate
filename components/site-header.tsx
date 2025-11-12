import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import LogoutButton from "./site-logout-button"
import { Bell } from 'lucide-react'

export default async function SiteHeader() {
  const user = await getCurrentUser()

  const getUserName = (u: any) => {
    if (!u) return 'User'
    if (typeof u.name === 'string') return u.name
    const first = u.name?.first || ''
    const last = u.name?.last || ''
    const combined = `${first} ${last}`.trim()
    return combined || u.email || 'User'
  }

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="px-8 py-4 flex justify-between items-center">
        {/* Left side - Logo/Brand */}
        <Link href="/" className="font-bold text-xl text-gray-800">
          Hospital Management System
        </Link>

        {/* Right side - Navigation and user info */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="flex items-center gap-4 mr-4">
            <Link href="/doctors" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Doctors
            </Link>
            <Link href="/virtual-doctor" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Virtual Doctor
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <>
                    <Link href="/dashboard/admin" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      Admin Dashboard
                    </Link>
                    <Link href="/admin/approve-doctors" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      Approvals
                    </Link>
                  </>
                )}
                {user.role === "doctor" && (
                  <Link href="/dashboard/doctor" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    Doctor Dashboard
                  </Link>
                )}
                {user.role === "user" && (
                  <>
                    <Link href="/dashboard/user" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      My Dashboard
                    </Link>
                    <Link href="/appointments" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      My Appointments
                    </Link>
                  </>
                )}
              </>
            ) : null}
          </nav>

          {/* User section */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.role === 'admin' ? `Admin: ${getUserName(user)}` :
                      user.role === 'doctor' ? `Doctor: ${getUserName(user)}` :
                        `${getUserName(user)}`}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="secondary" asChild size="sm">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}