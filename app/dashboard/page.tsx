"use client"

import { TaskCenter } from "@/components/task-center"
import { VisitsList } from "@/components/visits-list"
import { useState } from "react"
import { User, Home, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("")
  const [selectedClient, setSelectedClient] = useState<string>("Dr. Smith Medical Group")
  const [showClientMenu, setShowClientMenu] = useState(false)
  const router = useRouter()

  const clients = [
    "Dr. Smith Medical Group",
    "Dr. Johnson Cardiology",
    "Wellness Clinic Associates",
    "City Hospital Network",
    "Dr. Williams Family Practice",
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full py-4 px-6 flex items-center justify-between" style={{ backgroundColor: "rgb(4, 53, 95)" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("")}
            className="relative hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <Home className="w-10 h-10 text-white fill-white" />
            <img
              src="/images/home-logo.png"
              alt="MedVertex"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 object-contain"
            />
          </button>
          <button
            onClick={() => setActiveTab("")}
            className="text-xl font-semibold text-white hover:opacity-80 transition-opacity cursor-pointer"
          >
            Home Page
          </button>
        </div>
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <button
              onClick={() => router.push("/patients")}
              className="text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 hover:shadow-sm"
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab("Patients Visits")}
              className={`text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full ${
                activeTab === "Patients Visits"
                  ? "shadow-md bg-white/20 ring-2 ring-white/30"
                  : "hover:bg-white/10 hover:shadow-sm"
              }`}
            >
              Patients Visits
            </button>
            <button
              onClick={() => setActiveTab("Payments")}
              className={`text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full ${
                activeTab === "Payments"
                  ? "shadow-md bg-white/20 ring-2 ring-white/30"
                  : "hover:bg-white/10 hover:shadow-sm"
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab("Client")}
              className={`text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full ${
                activeTab === "Client"
                  ? "shadow-md bg-white/20 ring-2 ring-white/30"
                  : "hover:bg-white/10 hover:shadow-sm"
              }`}
            >
              Client
            </button>
          </nav>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowClientMenu(!showClientMenu)}
              className="text-white hover:bg-white/10 p-2 rounded transition-colors"
              aria-label="Client menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <User className="w-6 h-6 text-white" />
            <span className="text-white text-sm">{selectedClient}</span>

            {/* Client Selection Dropdown */}
            {showClientMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[250px] z-50">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">Select Client</div>
                {clients.map((client) => (
                  <button
                    key={client}
                    onClick={() => {
                      setSelectedClient(client)
                      setShowClientMenu(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      selectedClient === client ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    {client}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-white" style={{ height: "0.3382in" }}></div>

      {/* Main Content Area */}
      <div className="flex-1 p-8" style={{ backgroundColor: "rgb(237, 245, 250)" }}>
        {!activeTab && <TaskCenter />}
        {activeTab === "Patients Visits" && <VisitsList />}
        {activeTab === "Payments" && <TaskCenter />}
        {activeTab === "Client" && <TaskCenter />}
      </div>

      <div className="w-full bg-white" style={{ height: "0.3382in" }}></div>
    </div>
  )
}
