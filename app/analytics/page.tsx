import DashboardLayout from "@/components/DashboardLayout"
import { BarChart3, TrendingUp, Activity, PieChart } from "lucide-react"

export function AnalyticsPanel() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600 mt-2">View system analytics and trends</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="text-purple-600" size={32} />
            <h3 className="text-xl font-semibold">Appointment Trends</h3>
          </div>
          <p className="text-gray-500">Charts showing appointment booking patterns will be displayed here.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="text-green-600" size={32} />
            <h3 className="text-xl font-semibold">User Growth</h3>
          </div>
          <p className="text-gray-500">Patient and doctor registration trends will be shown here.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="text-blue-600" size={32} />
            <h3 className="text-xl font-semibold">System Activity</h3>
          </div>
          <p className="text-gray-500">Real-time system activity metrics will be displayed here.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <PieChart className="text-orange-600" size={32} />
            <h3 className="text-xl font-semibold">Department Distribution</h3>
          </div>
          <p className="text-gray-500">Distribution of appointments across specializations will be shown here.</p>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsPanel />
    </DashboardLayout>
  )
}
