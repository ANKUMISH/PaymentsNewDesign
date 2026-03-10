"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit2, Trash2, Search, ChevronDown, Download, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Helper function to format date to MM/DD/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A"
  try {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  } catch {
    return dateString
  }
}

interface Patient {
  id: string
  lastName: string
  firstName: string
  mi: string
  dob: string
  age: number
  gender: string
  email: string
  phone: string
  insurance: string
  lastVisit: string
  status: "Active" | "Inactive" | "Self-Pay"
  dxCode?: string
  insuranceCardFront?: string
  insuranceCardBack?: string
}

export function PatientList() {
  const router = useRouter()

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P001",
      lastName: "Johnson",
      firstName: "Sarah",
      mi: "M",
      dob: "1979-03-15",
      age: 45,
      gender: "F",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      insurance: "Blue Cross",
      lastVisit: "2024-01-20",
      status: "Active",
    },
    {
      id: "P002",
      lastName: "Chen",
      firstName: "Michael",
      mi: "K",
      dob: "1992-07-22",
      age: 32,
      gender: "M",
      email: "michael.chen@email.com",
      phone: "(555) 234-5678",
      insurance: "Aetna",
      lastVisit: "2024-01-18",
      status: "Active",
    },
    {
      id: "P003",
      lastName: "Rodriguez",
      firstName: "Emily",
      mi: "A",
      dob: "1996-11-08",
      age: 28,
      gender: "F",
      email: "emily.rodriguez@email.com",
      phone: "(555) 345-6789",
      insurance: "UnitedHealth",
      lastVisit: "2024-01-15",
      status: "Active",
    },
    {
      id: "P004",
      lastName: "Wilson",
      firstName: "James",
      mi: "R",
      dob: "1968-05-12",
      age: 56,
      gender: "M",
      email: "james.wilson@email.com",
      phone: "(555) 456-7890",
      insurance: "Medicare",
      lastVisit: "2024-01-10",
      status: "Inactive",
    },
    {
      id: "P005",
      lastName: "Anderson",
      firstName: "Lisa",
      mi: "J",
      dob: "1983-09-25",
      age: 41,
      gender: "F",
      dxCode: "G43.909",
      insurance: "Cigna",
      lastVisit: "2024-01-22",
      status: "Active",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set())
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [bulkActionsDialogOpen, setBulkActionsDialogOpen] = useState(false)
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false)
  const [filterLastName, setFilterLastName] = useState("")
  const [filterFirstName, setFilterFirstName] = useState("")
  const [filterGender, setFilterGender] = useState<string>("all")
  const [filterEmail, setFilterEmail] = useState("")
  const [filterInsurance, setFilterInsurance] = useState<string>("all")

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName)
  }

  const filteredPatients = patients.filter((patient) => {
    const searchMatch =
      (patient.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (patient.phone?.includes(searchTerm) || false) ||
      (patient.insurance || "").toLowerCase().includes(searchTerm.toLowerCase())

    const lastNameMatch = (patient.lastName || "").toLowerCase().includes(filterLastName.toLowerCase())
    const firstNameMatch = (patient.firstName || "").toLowerCase().includes(filterFirstName.toLowerCase())
    const genderMatch = filterGender === "all" || patient.gender === filterGender
    const emailMatch = (patient.email?.toLowerCase().includes(filterEmail.toLowerCase()) || false)
    const insuranceMatch = filterInsurance === "all" || patient.insurance === filterInsurance
    const statusMatch = filterStatus === "all" || patient.status === filterStatus

    return searchMatch && lastNameMatch && firstNameMatch && genderMatch && emailMatch && insuranceMatch && statusMatch
  })

  const togglePatientSelection = (patientId: string) => {
    const newSelected = new Set(selectedPatients)
    if (newSelected.has(patientId)) {
      newSelected.delete(patientId)
    } else {
      newSelected.add(patientId)
    }
    setSelectedPatients(newSelected)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Self-Pay":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const uniqueInsurances = Array.from(new Set(patients.map((p) => p.insurance)))

  const handleDeletePatient = () => {
    if (deletingPatientId) {
      setPatients(patients.filter((p) => p.id !== deletingPatientId))
      setDeletingPatientId(null)
    }
  }

  const handleBulkDelete = () => {
    setPatients(patients.filter((p) => !selectedPatients.has(p.id)))
    setSelectedPatients(new Set())
    setBulkActionsDialogOpen(false)
  }

  const handleConfirmBulkDelete = () => {
    setPatients(patients.filter((p) => !selectedPatients.has(p.id)))
    setSelectedPatients(new Set())
    setDeleteConfirmDialogOpen(false)
  }

  const downloadCSV = () => {
    const headers = [
      "Patient ID",
      "Last Name",
      "First Name",
      "MI",
      "DOB",
      "Age",
      "Gender",
      "Email",
      "Phone",
      "Insurance",
      "Status",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredPatients.map((p) =>
        [
          p.id,
          p.lastName,
          p.firstName,
          p.mi,
          p.dob,
          p.age,
          p.gender,
          p.email,
          p.phone,
          p.insurance,
          p.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `patients-list-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    setShowDownloadDialog(false)
  }

  const downloadExcel = () => {
    // For Excel format, we'll use CSV with .xls extension which Excel can open
    const headers = [
      "Patient ID",
      "Last Name",
      "First Name",
      "MI",
      "DOB",
      "Age",
      "Gender",
      "Email",
      "Phone",
      "Insurance",
      "Status",
    ]
    const csvContent = [
      headers.join("\t"),
      ...filteredPatients.map((p) =>
        [
          p.id,
          p.lastName,
          p.firstName,
          p.mi,
          p.dob,
          p.age,
          p.gender,
          p.email,
          p.phone,
          p.insurance,
          p.status,
        ].join("\t"),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `patients-list-${new Date().toISOString().split("T")[0]}.xls`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    setShowDownloadDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Patients List</h2>
        {/* Controls */}
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            className="h-10 px-4 bg-transparent flex items-center gap-2"
            style={{ backgroundColor: "#F1F5F9" }}
            title="Download Patients List"
            onClick={() => setShowDownloadDialog(true)}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Patients Table */}
      {selectedPatients.size > 0 && (
        <div className="bg-gray-50 border border-gray-300 rounded-t-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              className="h-5 w-5 border-2 border-gray-400 rounded cursor-pointer"
              checked={selectedPatients.size === filteredPatients.length && filteredPatients.length > 0}
              onCheckedChange={() => {
                if (selectedPatients.size === filteredPatients.length && selectedPatients.size > 0) {
                  setSelectedPatients(new Set())
                } else {
                  const newSelected = new Set<string>()
                  filteredPatients.forEach((p) => newSelected.add(p.id))
                  setSelectedPatients(newSelected)
                }
              }}
            />
            <span className="text-xs text-gray-700 font-medium">{selectedPatients.size} items selected</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedPatients(new Set())}
              className="text-xs text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear selection
            </button>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDialogOpen(true)}
              className="h-7 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ border: "1px solid #CBD5E1", borderTopLeftRadius: selectedPatients.size > 0 ? 0 : "0.5rem", borderTopRightRadius: selectedPatients.size > 0 ? 0 : "0.5rem" }}>
        <table className="w-full table-auto">
          <thead style={{ backgroundColor: "#F1F5F9", borderBottom: "0.5px solid #CBD5E1" }}>
            <tr>
              <th className="px-4 py-3 w-12" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <Checkbox 
                  className="h-5 w-5 border-2 border-gray-400 rounded cursor-pointer"
                  checked={selectedPatients.size === filteredPatients.length && filteredPatients.length > 0}
                  onCheckedChange={() => {
                    if (selectedPatients.size === filteredPatients.length && selectedPatients.size > 0) {
                      setSelectedPatients(new Set())
                    } else {
                      const newSelected = new Set<string>()
                      filteredPatients.forEach((p) => newSelected.add(p.id))
                      setSelectedPatients(newSelected)
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">PATIENT ID</span>
              </th>
              <th className="px-2 py-3 text-left text-xs" style={{ borderRight: "0.5px solid #CBD5E1", width: "100px" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="font-semibold text-gray-700">LAST NAME</span>
                  <button
                    onClick={() => toggleFilter("lastName")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "lastName" && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                      <Input
                        placeholder="Filter by last name..."
                        value={filterLastName}
                        onChange={(e) => setFilterLastName(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs" style={{ borderRight: "0.5px solid #CBD5E1", width: "100px" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="font-semibold text-gray-700">FIRST NAME</span>
                  <button
                    onClick={() => toggleFilter("firstName")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "firstName" && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                      <Input
                        placeholder="Filter by first name..."
                        value={filterFirstName}
                        onChange={(e) => setFilterFirstName(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">MI</span>
              </th>
              <th className="px-2 py-3 text-left text-xs" style={{ borderRight: "0.5px solid #CBD5E1", width: "90px" }}>
                <span className="font-semibold text-gray-700">DOB</span>
              </th>
              <th className="px-4 py-3 text-left" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">AGE</span>
              </th>
              <th className="px-4 py-3 text-left" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">GENDER</span>
                  <button
                    onClick={() => toggleFilter("gender")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "gender" && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10 flex flex-col">
                      {["all", "M", "F"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterGender(option)
                            setOpenFilter(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded-md capitalize"
                        >
                          {option === "all" ? "All" : option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs" style={{ borderRight: "0.5px solid #CBD5E1", width: "130px" }}>
                <span className="font-semibold text-gray-700">EMAIL</span>
              </th>
              <th className="px-4 py-3 text-left" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">PHONE</span>
              </th>
              <th className="px-2 py-3 text-left text-xs" style={{ borderRight: "0.5px solid #CBD5E1", width: "120px" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="font-semibold text-gray-700">INSURANCE</span>
                  <button
                    onClick={() => toggleFilter("insurance")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "insurance" && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10 flex flex-col">
                      <button
                        onClick={() => {
                          setFilterInsurance("all")
                          setOpenFilter(null)
                        }}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded-md"
                      >
                        All
                      </button>
                      {uniqueInsurances.map((insurance) => (
                        <button
                          key={insurance}
                          onClick={() => {
                            setFilterInsurance(insurance)
                            setOpenFilter(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded-md"
                        >
                          {insurance}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-2 py-3 text-left text-xs" style={{ borderRight: "0.5px solid #CBD5E1", width: "100px" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="font-semibold text-gray-700">STATUS</span>
                  <button
                    onClick={() => toggleFilter("status")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "status" && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10 flex flex-col">
                      {["all", "Active", "Inactive", "Self-Pay"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterStatus(option)
                            setOpenFilter(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded-md"
                        >
                          {option === "all" ? "All" : option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-gray-700">ACTIONS</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: "0.5px solid #CBD5E1", backgroundColor: selectedPatients.has(patient.id) ? "#DBEAFE" : "transparent" }} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <Checkbox
                    checked={selectedPatients.has(patient.id)}
                    onCheckedChange={() => togglePatientSelection(patient.id)}
                    className="h-5 w-5 opacity-60 rounded border-2 border-gray-400"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <span className="text-xs font-semibold text-gray-700">{patient.id}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1", width: "100px" }}>
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {patient.lastName}
                  </Link>
                </td>
                <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1", width: "100px" }}>
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {patient.firstName}
                  </Link>
                </td>
                <td className="px-4 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <span className="text-xs text-gray-600">{patient.mi}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1", width: "90px" }}>
                  <span className="text-xs text-gray-600">{formatDate(patient.dob)}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <span className="text-xs text-gray-600">{patient.age}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <span className="text-xs text-gray-600">{patient.gender}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1", width: "130px" }}>
                  <span className="text-xs text-gray-600">{patient.email}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <span className="text-xs text-gray-600">{patient.phone}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1", width: "120px" }}>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">{patient.insurance}</span>
                    <span className="text-xs text-gray-400 font-light">[sys]</span>
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1", width: "100px" }}>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                      <Edit2 className="h-4 w-4" style={{ color: "rgb(4, 53, 95)" }} />
                    </button>
                    <button
                      onClick={() => setDeletingPatientId(patient.id)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Trash2
                        className="h-4 w-4 hover:opacity-80 transition-opacity"
                        style={{ color: "rgb(4, 53, 95)" }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPatientId} onOpenChange={() => setDeletingPatientId(null)}>
        <DialogContent className="bg-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPatientId(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeletePatient}
              style={{ backgroundColor: "#FF8F5C" }}
              className="text-white hover:opacity-90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent className="bg-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Selected Patients</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedPatients.size} selected patient record(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBulkDelete}
              style={{ backgroundColor: "rgb(4, 53, 95)" }}
              className="text-white hover:opacity-90"
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Format Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Download Patients List</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={downloadCSV} className="w-full h-9 justify-start bg-transparent" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download as CSV
            </Button>
            <Button onClick={downloadExcel} className="w-full h-9 justify-start bg-transparent" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download as Excel (.xls)
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* More Actions Dialog */}
    </div>
  )
}
