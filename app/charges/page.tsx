"use client"

import { useState } from "react"
import { User, Home, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChargesList } from "@/components/charge-list"

export default function ChargesPage() {
  const router = useRouter()
  const [activeNavTab, setActiveNavTab] = useState<string>("Charges")
  const [selectedClient, setSelectedClient] = useState<string>("Dr. Smith Medical Group")
  const [showClientMenu, setShowClientMenu] = useState(false)

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
            onClick={() => router.push("/dashboard")}
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
            onClick={() => router.push("/dashboard")}
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
              onClick={() => router.push("/dashboard")}
              className="text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 hover:shadow-sm"
            >
              Patients Visits
            </button>
            <button
              onClick={() => router.push("/task-center")}
              className="text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 hover:shadow-sm"
            >
              Payments
            </button>
            <button
              onClick={() => router.push("/task-center")}
              className="text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 hover:shadow-sm"
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

      {/* Main Content Area with Tabs */}
      <div className="flex-1 p-8" style={{ backgroundColor: "rgb(237, 245, 250)" }}>
        <div className="w-full max-w-7xl mx-auto">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="inline-flex gap-1 mb-6 bg-transparent">
              <TabsTrigger
                value="list"
                className="w-[180px] py-2 text-sm bg-gray-200 text-gray-700 data-[state=active]:bg-[#FF8F5C] data-[state=active]:text-white rounded-t-lg border-0"
              >
                Charges List
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="w-[180px] py-2 text-sm bg-gray-200 text-gray-700 data-[state=active]:bg-[#FF8F5C] data-[state=active]:text-white rounded-t-lg border-0"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="billed"
                className="w-[180px] py-2 text-sm bg-gray-200 text-gray-700 data-[state=active]:bg-[#FF8F5C] data-[state=active]:text-white rounded-t-lg border-0"
              >
                Billed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-0">
              <ChargesList />
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <ChargesList />
            </TabsContent>

            <TabsContent value="billed" className="mt-0">
              <ChargesList />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="w-full bg-white" style={{ height: "0.3382in" }}></div>
    </div>
  )
}
