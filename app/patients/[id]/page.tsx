"use client"

import { useRouter, useParams } from "next/navigation"
import { Home, Menu, Edit, Save, X, Download, Printer, ArrowLeft, User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import Image from "next/image"

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  const [activeTab, setActiveTab] = useState<string>("Patients")
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<string>("Dr. Sarah Johnson")
  const [showClientMenu, setShowClientMenu] = useState(false)

  const clients = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Emily Rodriguez",
    "Dr. Robert Williams",
    "Dr. Lisa Anderson",
  ]

  const [isEditing, setIsEditing] = useState(false)
  const [patientData, setPatientData] = useState({
    firstName: "John",
    lastName: "Smith",
    middleInitial: "A",
    dob: "1985-03-15",
    gender: "M",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    accountStatus: "Active",
  })

  const [originalData, setOriginalData] = useState(patientData)

  const [isEditingInsurance, setIsEditingInsurance] = useState(false)
  const [insuranceData, setInsuranceData] = useState({
    primaryName: "Blue Cross Blue Shield",
    primaryPolicyNumber: "BC123456789",
    primaryGroupNumber: "GRP001",
    primarySubscriberId: "SUB001",
    secondaryName: "Aetna",
    secondaryPolicyNumber: "AET987654321",
    secondaryGroupNumber: "GRP002",
    secondarySubscriberId: "SUB002",
    tertiaryName: "",
    tertiaryPolicyNumber: "",
    tertiaryGroupNumber: "",
    tertiarySubscriberId: "",
  })

  const [originalInsuranceData, setOriginalInsuranceData] = useState(insuranceData)

  const handleEdit = () => {
    setOriginalData(patientData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("[v0] Saving patient data:", patientData)
  }

  const handleCancel = () => {
    setPatientData(originalData)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditInsurance = () => {
    setOriginalInsuranceData(insuranceData)
    setIsEditingInsurance(true)
  }

  const handleSaveInsurance = () => {
    setIsEditingInsurance(false)
    console.log("[v0] Saving insurance data:", insuranceData)
  }

  const handleCancelInsurance = () => {
    setInsuranceData(originalInsuranceData)
    setIsEditingInsurance(false)
  }

  const handleInsuranceChange = (field: string, value: string) => {
    setInsuranceData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDownload = (format: "pdf" | "csv" | "excel") => {
    console.log(`[v0] Downloading patient data as ${format}`)
    setShowDownloadDialog(false)
  }

  const handlePrint = () => {
    window.print()
  }

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
              src="/images/image.png"
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
              onClick={() => {
                setActiveTab("Patients")
                router.push("/patients")
              }}
              className={`text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full ${
                activeTab === "Patients"
                  ? "shadow-md bg-white/20 ring-2 ring-white/30"
                  : "hover:bg-white/10 hover:shadow-sm"
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => router.push("/task-center")}
              className="text-white transition-all text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 hover:shadow-sm"
            >
              Charges
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

      {/* Main Content Area */}
      <div className="flex-1 p-8" style={{ backgroundColor: "rgb(237, 245, 250)" }}>
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "rgb(4, 53, 95)" }}>
              Patient Details - {patientData.firstName} {patientData.lastName}
            </h1>
            <Button
              onClick={() => router.push("/patients")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Patient List
            </Button>
          </div>

          <Tabs defaultValue="patient-data" className="w-full">
            <TabsList className="inline-flex gap-2 bg-transparent p-0 mb-6">
              <TabsTrigger
                value="patient-data"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm bg-gray-200 text-gray-700 px-8 py-2 rounded-t-lg"
                style={{ width: "180px" }}
              >
                Patient Data
              </TabsTrigger>
              <TabsTrigger
                value="insurance"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm bg-gray-200 text-gray-700 px-8 py-2 rounded-t-lg"
                style={{ width: "180px" }}
              >
                Insurance
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm bg-gray-200 text-gray-700 px-8 py-2 rounded-t-lg"
                style={{ width: "180px" }}
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm bg-gray-200 text-gray-700 px-8 py-2 rounded-t-lg"
                style={{ width: "180px" }}
              >
                Payments
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm bg-gray-200 text-gray-700 px-8 py-2 rounded-t-lg"
                style={{ width: "180px" }}
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="visit-history"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm bg-gray-200 text-gray-700 px-8 py-2 rounded-t-lg"
                style={{ width: "180px" }}
              >
                Visit History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient-data" className="mt-0">
              <div className="p-6 border rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">Patient Information</h3>
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: patientData.accountStatus === "Active" ? "#10B981" : "#6B7280",
                        color: "white",
                      }}
                    >
                      {patientData.accountStatus}
                    </div>
                  </div>
                  {!isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={handlePrint} variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button onClick={() => setShowDownloadDialog(true)} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={handleEdit} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" style={{ backgroundColor: "#FF8F5C" }}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-5xl">
                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">First Name</Label>
                      {isEditing ? (
                        <Input
                          value={patientData.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          className="h-9 mt-1"
                        />
                      ) : (
                        <p className="text-xs text-gray-600 py-2 border-b">{patientData.firstName}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Last Name</Label>
                      {isEditing ? (
                        <Input
                          value={patientData.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          className="h-9 mt-1"
                        />
                      ) : (
                        <p className="text-xs text-gray-600 py-2 border-b">{patientData.lastName}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700">MI</Label>
                      {isEditing ? (
                        <Input
                          value={patientData.middleInitial}
                          onChange={(e) => handleChange("middleInitial", e.target.value)}
                          maxLength={1}
                          className="h-9 mt-1"
                        />
                      ) : (
                        <p className="text-xs text-gray-600 py-2 border-b">{patientData.middleInitial}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={patientData.dob}
                        onChange={(e) => handleChange("dob", e.target.value)}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{new Date(patientData.dob).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Gender</Label>
                    {isEditing ? (
                      <Select value={patientData.gender} onValueChange={(value) => handleChange("gender", value)}>
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.gender}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={patientData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.email}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={patientData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Address Line 1
                    </Label>
                    {isEditing ? (
                      <Input
                        value={patientData.addressLine1}
                        onChange={(e) => handleChange("addressLine1", e.target.value)}
                        className="h-9 mt-1"
                        required
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.addressLine1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Address Line 2</Label>
                    {isEditing ? (
                      <Input
                        value={patientData.addressLine2}
                        onChange={(e) => handleChange("addressLine2", e.target.value)}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.addressLine2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">City</Label>
                    {isEditing ? (
                      <Input
                        value={patientData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.city}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">State</Label>
                    {isEditing ? (
                      <Input
                        value={patientData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        maxLength={2}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.state}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">ZIP Code</Label>
                    {isEditing ? (
                      <Input
                        value={patientData.zipCode}
                        onChange={(e) => handleChange("zipCode", e.target.value)}
                        className="h-9 mt-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Account Status</Label>
                    {isEditing ? (
                      <Select
                        value={patientData.accountStatus}
                        onValueChange={(value) => handleChange("accountStatus", value)}
                      >
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Self-Pay">Self-Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-xs text-gray-600 py-2 border-b">{patientData.accountStatus}</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insurance" className="mt-0">
              <div className="p-6 border rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Insurance Information</h3>
                  {!isEditingInsurance ? (
                    <div className="flex gap-2">
                      <Button onClick={handlePrint} variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button onClick={() => setShowDownloadDialog(true)} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={handleEditInsurance} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveInsurance} size="sm" style={{ backgroundColor: "#FF8F5C" }}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelInsurance} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Primary Insurance */}
                  <div>
                    <h4 className="text-md font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                      Primary Insurance
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-3xl">
                        <div>
                          <Label className="text-xs font-semibold text-gray-700">Insurance Name</Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.primaryName}
                              onChange={(e) => handleInsuranceChange("primaryName", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.primaryName}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-gray-700">
                            Subscriber ID
                          </Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.primarySubscriberId}
                              onChange={(e) => handleInsuranceChange("primarySubscriberId", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.primarySubscriberId || "N/A"}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-gray-700">Policy Number</Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.primaryPolicyNumber}
                              onChange={(e) => handleInsuranceChange("primaryPolicyNumber", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.primaryPolicyNumber}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-gray-700">Group Number</Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.primaryGroupNumber}
                              onChange={(e) => handleInsuranceChange("primaryGroupNumber", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.primaryGroupNumber || "N/A"}</p>
                          )}
                        </div>
                      </div>

                      {/* Insurance Cards Side by Side */}
                      <div className="flex gap-4 pt-4">
                        <div className="flex-1 max-w-xs space-y-2">
                          <Label className="text-xs font-semibold text-gray-700">Card Front</Label>
                          <div className="border-2 border-gray-300 rounded p-2 bg-gray-50 h-24 flex items-center justify-center mt-1">
                            {insuranceData.primaryCardFrontImage ? (
                              <img src={insuranceData.primaryCardFrontImage || "/placeholder.svg"} alt="Primary card front" className="h-full object-contain" />
                            ) : (
                              <p className="text-gray-400 text-xs text-center">No image</p>
                            )}
                          </div>
                          {isEditingInsurance && (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="primaryCardFront"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                      setInsuranceData({
                                        ...insuranceData,
                                        primaryCardFrontImage: event.target?.result as string,
                                      })
                                    }
                                    reader.readAsDataURL(e.target.files[0])
                                  }
                                }}
                              />
                              <label htmlFor="primaryCardFront">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full h-8 text-xs cursor-pointer bg-transparent"
                                  onClick={() => document.getElementById("primaryCardFront")?.click()}
                                >
                                  Upload Card Front
                                </Button>
                              </label>
                            </>
                          )}
                        </div>
                        <div className="flex-1 max-w-xs space-y-2">
                          <Label className="text-xs font-semibold text-gray-700">Card Back</Label>
                          <div className="border-2 border-gray-300 rounded p-2 bg-gray-50 h-24 flex items-center justify-center mt-1">
                            {insuranceData.primaryCardBackImage ? (
                              <img src={insuranceData.primaryCardBackImage || "/placeholder.svg"} alt="Primary card back" className="h-full object-contain" />
                            ) : (
                              <p className="text-gray-400 text-xs text-center">No image</p>
                            )}
                          </div>
                          {isEditingInsurance && (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="primaryCardBack"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                      setInsuranceData({
                                        ...insuranceData,
                                        primaryCardBackImage: event.target?.result as string,
                                      })
                                    }
                                    reader.readAsDataURL(e.target.files[0])
                                  }
                                }}
                              />
                              <label htmlFor="primaryCardBack">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full h-8 text-xs cursor-pointer bg-transparent"
                                  onClick={() => document.getElementById("primaryCardBack")?.click()}
                                >
                                  Upload Card Back
                                </Button>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Insurance */}
                  <div>
                    <h4 className="text-md font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                      Secondary Insurance
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-3xl">
                        <div>
                          <Label className="text-xs font-semibold text-gray-700">Insurance Name</Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.secondaryName}
                              onChange={(e) => handleInsuranceChange("secondaryName", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.secondaryName || "N/A"}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-gray-700">
                            Subscriber ID
                          </Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.secondarySubscriberId}
                              onChange={(e) => handleInsuranceChange("secondarySubscriberId", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.secondarySubscriberId || "N/A"}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-gray-700">Policy Number</Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.secondaryPolicyNumber}
                              onChange={(e) => handleInsuranceChange("secondaryPolicyNumber", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.secondaryPolicyNumber || "N/A"}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs font-semibold text-gray-700">Group Number</Label>
                          {isEditingInsurance ? (
                            <Input
                              value={insuranceData.secondaryGroupNumber}
                              onChange={(e) => handleInsuranceChange("secondaryGroupNumber", e.target.value)}
                              className="h-9 mt-1"
                            />
                          ) : (
                            <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.secondaryGroupNumber || "N/A"}</p>
                          )}
                        </div>
                      </div>

                      {/* Insurance Cards Side by Side */}
                      <div className="flex gap-4 pt-4">
                        <div className="flex-1 max-w-xs space-y-2">
                          <Label className="text-xs font-semibold text-gray-700">Card Front</Label>
                          <div className="border-2 border-gray-300 rounded p-2 bg-gray-50 h-24 flex items-center justify-center mt-1">
                            {insuranceData.secondaryCardFrontImage ? (
                              <img src={insuranceData.secondaryCardFrontImage || "/placeholder.svg"} alt="Secondary card front" className="h-full object-contain" />
                            ) : (
                              <p className="text-gray-400 text-xs text-center">No image</p>
                            )}
                          </div>
                          {isEditingInsurance && (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="secondaryCardFront"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                      setInsuranceData({
                                        ...insuranceData,
                                        secondaryCardFrontImage: event.target?.result as string,
                                      })
                                    }
                                    reader.readAsDataURL(e.target.files[0])
                                  }
                                }}
                              />
                              <label htmlFor="secondaryCardFront">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full h-8 text-xs cursor-pointer bg-transparent"
                                  onClick={() => document.getElementById("secondaryCardFront")?.click()}
                                >
                                  Upload Card Front
                                </Button>
                              </label>
                            </>
                          )}
                        </div>
                        <div className="flex-1 max-w-xs space-y-2">
                          <Label className="text-xs font-semibold text-gray-700">Card Back</Label>
                          <div className="border-2 border-gray-300 rounded p-2 bg-gray-50 h-24 flex items-center justify-center mt-1">
                            {insuranceData.secondaryCardBackImage ? (
                              <img src={insuranceData.secondaryCardBackImage || "/placeholder.svg"} alt="Secondary card back" className="h-full object-contain" />
                            ) : (
                              <p className="text-gray-400 text-xs text-center">No image</p>
                            )}
                          </div>
                          {isEditingInsurance && (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="secondaryCardBack"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                      setInsuranceData({
                                        ...insuranceData,
                                        secondaryCardBackImage: event.target?.result as string,
                                      })
                                    }
                                    reader.readAsDataURL(e.target.files[0])
                                  }
                                }}
                              />
                              <label htmlFor="secondaryCardBack">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full h-8 text-xs cursor-pointer bg-transparent"
                                  onClick={() => document.getElementById("secondaryCardBack")?.click()}
                                >
                                  Upload Card Back
                                </Button>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tertiary Insurance */}
                  <div>
                    <h4 className="text-md font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                      Tertiary Insurance
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-5xl">
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Insurance Name</Label>
                        {isEditingInsurance ? (
                          <Input
                            value={insuranceData.tertiaryName}
                            onChange={(e) => handleInsuranceChange("tertiaryName", e.target.value)}
                            className="h-9 mt-1"
                            placeholder="Optional"
                          />
                        ) : (
                          <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.tertiaryName || "N/A"}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Policy Number</Label>
                        {isEditingInsurance ? (
                          <Input
                            value={insuranceData.tertiaryPolicyNumber}
                            onChange={(e) => handleInsuranceChange("tertiaryPolicyNumber", e.target.value)}
                            className="h-9 mt-1"
                            placeholder="Optional"
                          />
                        ) : (
                          <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.tertiaryPolicyNumber || "N/A"}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Group Number</Label>
                        {isEditingInsurance ? (
                          <Input
                            value={insuranceData.tertiaryGroupNumber}
                            onChange={(e) => handleInsuranceChange("tertiaryGroupNumber", e.target.value)}
                            className="h-9 mt-1"
                            placeholder="Optional"
                          />
                        ) : (
                          <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.tertiaryGroupNumber || "N/A"}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Subscriber ID</Label>
                        {isEditingInsurance ? (
                          <Input
                            value={insuranceData.tertiarySubscriberId}
                            onChange={(e) => handleInsuranceChange("tertiarySubscriberId", e.target.value)}
                            className="h-9 mt-1"
                            placeholder="Optional"
                          />
                        ) : (
                          <p className="text-xs text-gray-600 py-2 border-b">{insuranceData.tertiarySubscriberId || "N/A"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-6">Insurance Card Documents</h3>
                <div className="grid grid-cols-2 gap-8">
                  {/* Primary Insurance Card */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Primary Insurance - Front</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">No document uploaded</p>
                          <p className="text-gray-400 text-xs mt-1">Insurance card front side would appear here</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Primary Insurance - Back</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">No document uploaded</p>
                          <p className="text-gray-400 text-xs mt-1">Insurance card back side would appear here</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Insurance Card */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Secondary Insurance - Front</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">No document uploaded</p>
                          <p className="text-gray-400 text-xs mt-1">Insurance card front side would appear here</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Secondary Insurance - Back</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">No document uploaded</p>
                          <p className="text-gray-400 text-xs mt-1">Insurance card back side would appear here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                <p className="text-gray-600">Payment records will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="mt-0">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Appointments</h3>
                <p className="text-gray-600">Appointment schedule will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="visit-history" className="mt-0">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Visit History</h3>
                <p className="text-gray-600">Past visits will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Download Patient Data</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4 items-center">
            <Button onClick={() => handleDownload("pdf")} className="px-6 h-9" style={{ backgroundColor: "#FF8F5C" }}>
              Download as PDF
            </Button>
            <Button onClick={() => handleDownload("csv")} className="px-6 h-9" style={{ backgroundColor: "#FF8F5C" }}>
              Download as CSV
            </Button>
            <Button onClick={() => handleDownload("excel")} className="px-6 h-9" style={{ backgroundColor: "#FF8F5C" }}>
              Download as Excel
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
