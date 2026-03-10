"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, TrendingUp, Calendar } from "lucide-react"

export function PatientAnalytics() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      change: "+12% from last month",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Cases",
      value: "856",
      change: "+8% from last month",
      icon: Activity,
      color: "from-green-500 to-green-600",
    },
    {
      title: "New Admissions",
      value: "45",
      change: "+23% from last month",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Appointments Today",
      value: "28",
      change: "5 pending confirmation",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const conditionStats = [
    { condition: "Hypertension", count: 245, percentage: 19.8 },
    { condition: "Diabetes Type 2", count: 198, percentage: 16.0 },
    { condition: "Heart Disease", count: 156, percentage: 12.6 },
    { condition: "Asthma", count: 134, percentage: 10.9 },
    { condition: "Migraine", count: 98, percentage: 7.9 },
    { condition: "Other", count: 403, percentage: 32.8 },
  ]

  const ageDistribution = [
    { range: "0-18", count: 124, percentage: 10.0 },
    { range: "19-35", count: 298, percentage: 24.1 },
    { range: "36-50", count: 412, percentage: 33.4 },
    { range: "51-65", count: 289, percentage: 23.4 },
    { range: "65+", count: 111, percentage: 9.0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: "rgb(4, 53, 95)" }}>
          Patient Analytics
        </h2>
        <p className="text-sm text-gray-600 mt-1">Overview of patient statistics and trends</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "rgb(4, 53, 95)" }}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conditions Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle style={{ color: "rgb(4, 53, 95)" }}>Top Conditions</CardTitle>
            <CardDescription>Distribution of patient conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conditionStats.map((item) => (
                <div key={item.condition} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.condition}</span>
                    <span className="text-gray-500">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FF8F5C] to-[#FFD166] h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle style={{ color: "rgb(4, 53, 95)" }}>Age Distribution</CardTitle>
            <CardDescription>Patient count by age range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ageDistribution.map((item) => (
                <div key={item.range} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.range} years</span>
                    <span className="text-gray-500">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle style={{ color: "rgb(4, 53, 95)" }}>Recent Activity</CardTitle>
          <CardDescription>Latest patient-related activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "New patient registered",
                patient: "Emily Rodriguez",
                time: "2 hours ago",
                type: "success",
              },
              {
                action: "Appointment scheduled",
                patient: "Michael Chen",
                time: "3 hours ago",
                type: "info",
              },
              {
                action: "Patient marked inactive",
                patient: "James Wilson",
                time: "5 hours ago",
                type: "neutral",
              },
              {
                action: "Medical record updated",
                patient: "Sarah Johnson",
                time: "6 hours ago",
                type: "info",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "info"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.patient} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
