"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout"
import { FileText, Pill, Calendar } from "lucide-react"
import dayjs from "dayjs"

export function PrescriptionsPanel() {
  const { user } = useUser()
  const userId = (user as any)?.id || (user as any)?._id
  const { data } = useSWR(userId ? `/api/prescriptions/${userId}` : null, (url) => jsonFetch(url))
  const items = (data as any[]) || []

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
        <p className="text-gray-600 mt-2">View all your medical prescriptions and treatments</p>
      </div>

      <div className="grid gap-4">
        {items.map((p) => (
          <Card key={p._id} className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="text-blue-600" size={20} />
                <span>Prescription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Diagnosed Diseases:</h4>
                <div className="flex flex-wrap gap-2">
                  {(p.diagnosedDiseases || []).length > 0 ? (
                    p.diagnosedDiseases.map((d: any, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        {d.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No diagnoses recorded</span>
                  )}
                </div>
              </div>

              {p.medications && p.medications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <Pill size={16} />
                    <span>Medications:</span>
                  </h4>
                  <div className="space-y-2">
                    {p.medications.map((med: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.createdAt && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 pt-2 border-t">
                  <Calendar size={14} />
                  <span>Prescribed on {dayjs(p.createdAt).format("MMMM DD, YYYY")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No prescriptions yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MyPrescriptionsPage() {
  return (
    <DashboardLayout>
      <PrescriptionsPanel />
    </DashboardLayout>
  )
}
