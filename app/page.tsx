import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Calendar, Users, Shield, Heart, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience modern healthcare with AI-powered diagnostics, easy appointment booking, and comprehensive health management.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/auth/register">Get Started</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Activity className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">AI Disease Prediction</h3>
            <p className="text-gray-600 mb-4">
              Get instant health insights with our AI-powered disease prediction system. Enter your symptoms and receive preliminary diagnoses.
            </p>
            <Link href="/virtual-doctor" className="text-blue-600 font-medium hover:underline">
              Try Virtual Doctor →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Calendar className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Appointment Booking</h3>
            <p className="text-gray-600 mb-4">
              Browse qualified doctors, check availability, and book appointments instantly. Manage all your appointments in one place.
            </p>
            <Link href="/doctors" className="text-green-600 font-medium hover:underline">
              Find Doctors →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Qualified Healthcare Professionals</h3>
            <p className="text-gray-600 mb-4">
              Connect with experienced doctors across multiple specialties. All our doctors are verified and approved.
            </p>
            <Link href="/doctors" className="text-purple-600 font-medium hover:underline">
              View Doctors →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CareMate?</h2>
            <p className="text-xl text-gray-600">Modern healthcare solutions designed for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your health data is encrypted and secure</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Access virtual consultations anytime</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-purple-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Patient-Centered</h3>
              <p className="text-gray-600">Your health and comfort come first</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-orange-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">AI-Powered</h3>
              <p className="text-gray-600">Advanced technology for better care</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of patients who trust CareMate for their healthcare needs</p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/auth/login?mode=signup">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="/doctors">Browse Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Doctors Section */}
      <section className="bg-gray-50 py-20 border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Are You a Healthcare Professional?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our network of verified doctors and start providing quality care to patients online.
          </p>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
            <Link href="/auth/register-doctor">Register as Doctor</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}