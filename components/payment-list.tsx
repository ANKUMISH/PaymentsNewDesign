"use client"

import { useState } from "react"
import { Edit2, Trash2, Search, ChevronDown, Download, Plus, Paperclip, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type PaymentStatus = "Paid" | "Denied" | "Applied" | "Unapplied" | "new" | "partial" | "consumed"
type PaymentSource = "Patients" | "Insurance"
type PaymentMethod = "Check" | "Credit Card" | "Cash" | "Bank Transfer"
type LineStatus = "new" | "pending" | "applied"
type InsurancePaymentStatus = "new" | "partial" | "consumed"

interface ServiceLine {
  id: string
  patientName: string
  dos: string
  cpt: string
  visitId: string
  charges: number
  paymentAmount: number
  deductible: number
  coins: number
  copay: number
  allowable: number
  adjustment: number
  appliedAmount: number
  appliedOn?: string
  lineStatus: LineStatus
}

// Sample patient data
const SAMPLE_PATIENTS = [
  { id: "P001", firstName: "Sarah", lastName: "Johnson" },
  { id: "P002", firstName: "Michael", lastName: "Chen" },
  { id: "P003", firstName: "Emily", lastName: "Rodriguez" },
  { id: "P004", firstName: "James", lastName: "Wilson" },
  { id: "P005", firstName: "Lisa", lastName: "Anderson" },
]

// Sample insurance companies
const SAMPLE_INSURANCE = [
  { id: "INS-UH001", name: "United Healthcare" },
  { id: "INS-AE002", name: "Aetna Insurance" },
  { id: "INS-CG003", name: "Cigna Health" },
  { id: "INS-BCBS004", name: "Blue Cross Blue Shield" },
  { id: "INS-HM005", name: "Humana Insurance" },
]

// Sample visits data with cascading structure
const VISITS: Record<string, Record<string, { cpts: string[], visitIds: Record<string, string>, charges: Record<string, number> }>> = {
  "Sarah Johnson": {
    "2024-01-20": { 
      cpts: ["99213", "99214"], 
      visitIds: { "99213": "V001", "99214": "V001B" },
      charges: { "99213": 150, "99214": 200 }
    },
    "2024-01-15": { 
      cpts: ["71046", "71045"], 
      visitIds: { "71046": "V002", "71045": "V002B" },
      charges: { "71046": 250, "71045": 225 }
    },
  },
  "Michael Chen": {
    "2024-01-18": { 
      cpts: ["85025", "85026"], 
      visitIds: { "85025": "V003", "85026": "V003B" },
      charges: { "85025": 180, "85026": 195 }
    },
    "2024-01-10": { 
      cpts: ["99203", "99204"], 
      visitIds: { "99203": "V004", "99204": "V004B" },
      charges: { "99203": 120, "99204": 160 }
    },
  },
  "Emily Rodriguez": {
    "2024-01-22": { 
      cpts: ["99213"], 
      visitIds: { "99213": "V005" },
      charges: { "99213": 150 }
    },
    "2024-01-16": { 
      cpts: ["71020"], 
      visitIds: { "71020": "V006" },
      charges: { "71020": 320 }
    },
  },
  "James Wilson": {
    "2024-01-25": { 
      cpts: ["99215", "99214"], 
      visitIds: { "99215": "V007", "99214": "V007B" },
      charges: { "99215": 250, "99214": 200 }
    },
  },
  "Lisa Anderson": {
    "2024-01-19": { 
      cpts: ["90834", "90837"], 
      visitIds: { "90834": "V008", "90837": "V008B" },
      charges: { "90834": 180, "90837": 210 }
    },
  },
}

interface Payment {
  id: string
  patientName?: string
  patientId?: string
  amount: number
  checkDate: string
  paymentMethod: string
  checkNumber?: string
  status: PaymentStatus
  provider?: string
  description?: string
  source: PaymentSource
  documents?: number
  note?: string
  appliedTo?: Array<{
    appliedOn: string
    paymentDate: string
    dos: string
    visitId: string
    appliedAmount: number
    accountNo: string
  }>
  payerName?: string
  payerId?: string
  sourceCode?: string
  paymentStatus?: InsurancePaymentStatus
  serviceLines?: ServiceLine[]
  totalApplied?: number
  totalRemaining?: number
}

interface PaymentListProps {
  source?: PaymentSource
}

export function PaymentList({ source = "Patients" }: PaymentListProps) {
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [patientSearchTerm, setPatientSearchTerm] = useState("")
  const [payerSearchTerm, setPayerSearchTerm] = useState("")
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [showPayerDropdown, setShowPayerDropdown] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedPaymentForView, setSelectedPaymentForView] = useState<Payment | null>(null)
  const [showAppliedDetailsModal, setShowAppliedDetailsModal] = useState(false)
  const [selectedPaymentForDocuments, setSelectedPaymentForDocuments] = useState<Payment | null>(null)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [selectedPaymentForUpload, setSelectedPaymentForUpload] = useState<Payment | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [editFilesToUpload, setEditFilesToUpload] = useState<File[]>([])
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState<Payment | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLinesDialog, setShowLinesDialog] = useState(false)
  const [selectedPaymentForLines, setSelectedPaymentForLines] = useState<Payment | null>(null)
  const [showAddLineInDialog, setShowAddLineInDialog] = useState(false)
  const [newLineInDialog, setNewLineInDialog] = useState({
    patientName: "",
    dos: "",
    cpt: "",
    charges: 0,
    paymentAmount: 0,
    deductible: 0,
    coins: 0,
    copay: 0,
    allowable: 0,
    adjustment: 0,
  })
  const [selectedPaymentForDelete, setSelectedPaymentForDelete] = useState<Payment | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [existingEditDocuments, setExistingEditDocuments] = useState<string[]>([])
  const [editFormData, setEditFormData] = useState({
    patientName: "",
    patientId: "",
    amount: "",
    checkDate: "",
    paymentMethod: "Check" as PaymentMethod,
    checkNumber: "",
    status: "Applied" as PaymentStatus,
    provider: "",
    note: "",
  })
  const [newPayment, setNewPayment] = useState({
    patientName: "",
    patientId: "",
    amount: "",
    checkDate: "",
    paymentMethod: "Check",
    checkNumber: "",
    status: "Applied" as PaymentStatus,
    provider: "",
    note: "",
  })
  const [newInsurancePayment, setNewInsurancePayment] = useState({
    payerName: "",
    payerId: "",
    amount: "",
    checkDate: "",
    paymentMethod: "Check",
    checkNumber: "",
    sourceCode: "",
    status: "Paid" as PaymentStatus,
    paymentStatus: "new" as InsurancePaymentStatus,
    serviceLines: [
      {
        id: "line-1",
        patientName: "",
        dos: "",
        cpt: "",
        visitId: "",
        charges: 0,
        paymentAmount: 0,
        deductible: 0,
        coins: 0,
        copay: 0,
        allowable: 0,
  adjustment: 0,
  appliedAmount: 0,
  lineStatus: "new" as LineStatus,
      },
    ],
  })

  const filteredPatients = SAMPLE_PATIENTS.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(patientSearchTerm.toLowerCase())
  )

  const filteredInsurance = SAMPLE_INSURANCE.filter((insurer) =>
    insurer.name.toLowerCase().includes(payerSearchTerm.toLowerCase())
  )

  const handlePatientSelect = (patient: typeof SAMPLE_PATIENTS[0]) => {
    setNewPayment({
      ...newPayment,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientId: patient.id,
    })
    setPatientSearchTerm("")
    setShowPatientDropdown(false)
  }

  const handlePayerSelect = (insurer: typeof SAMPLE_INSURANCE[0]) => {
    setNewInsurancePayment({
      ...newInsurancePayment,
      payerName: insurer.name,
      payerId: insurer.id,
    })
    setPayerSearchTerm("")
    setShowPayerDropdown(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }



  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }
  const patientPayments: Payment[] = [
    {
      id: "PM001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      amount: 150.0,
      checkDate: "2024-01-20",
      paymentMethod: "Credit Card",
      status: "Applied",
      provider: "Dr. Smith",
      description: "Office Visit Payment",
      source: "Patients",
      documents: 2,
      note: "Partial payment applied to multiple DOS",
      appliedTo: [
        {
          appliedOn: "01/21/2025",
          paymentDate: "01/20/2025",
          dos: "01/15/2024",
          visitId: "V001",
          appliedAmount: 75.0,
          accountNo: "101 Ins Payment",
        },
        {
          appliedOn: "01/21/2025",
          paymentDate: "01/20/2025",
          dos: "01/10/2024",
          visitId: "V002",
          appliedAmount: 75.0,
          accountNo: "102 Ins Payment",
        },
      ],
    },
    {
      id: "PM002",
      patientName: "Michael Chen",
      patientId: "P002",
      amount: 85.5,
      checkDate: "2024-01-18",
      paymentMethod: "Check",
      checkNumber: "1024",
      status: "Applied",
      provider: "Dr. Johnson",
      description: "Lab Work Payment",
      source: "Patients",
      documents: 1,
      appliedTo: [
        {
          appliedOn: "01/20/2025",
          paymentDate: "01/18/2025",
          dos: "01/08/2024",
          visitId: "V003",
          appliedAmount: 85.5,
          accountNo: "103 Ins Payment",
        },
      ],
    },
    {
      id: "PM003",
      patientName: "Emily Davis",
      patientId: "P003",
      amount: 250.0,
      checkDate: "2024-01-15",
      paymentMethod: "Cash",
      status: "Applied",
      provider: "Dr. Williams",
      description: "X-Ray Payment",
      source: "Patients",
      documents: 3,
    },
    {
      id: "PM004",
      patientName: "James Wilson",
      patientId: "P004",
      amount: 1200.0,
      checkDate: "2024-01-10",
      paymentMethod: "Credit Card",
      status: "Applied",
      provider: "Dr. Brown",
      description: "Procedure Payment",
      source: "Patients",
      documents: 0,
    },
    {
      id: "PM005",
      patientName: "Rebecca Martinez",
      patientId: "P005",
      amount: 120.0,
      checkDate: "2024-01-08",
      paymentMethod: "Check",
      checkNumber: "1018",
      status: "Unapplied",
      provider: "Dr. Smith",
      description: "Consultation Payment",
      source: "Patients",
      documents: 2,
    },
  ]

  const insurancePayments: Payment[] = [
    {
      id: "INS001",
      payerName: "United Healthcare",
      payerId: "INS-UH001",
      amount: 485.50,
      checkDate: "2024-01-19",
      paymentMethod: "Check",
      checkNumber: "5001",
      status: "Paid",
      source: "Insurance",
      documents: 2,
      paymentStatus: "partial",
      totalApplied: 150,
      totalRemaining: 335.50,
      serviceLines: [
        {
          id: "sl-1",
          patientName: "Sarah Johnson",
          dos: "2024-01-20",
          cpt: "99213",
          visitId: "V001",
          charges: 150,
          paymentAmount: 150,
          deductible: 0,
          coins: 0,
          copay: 0,
          allowable: 150,
          adjustment: 0,
          appliedAmount: 150,
          appliedOn: "03/10/2026",
          lineStatus: "applied",
        },
        {
          id: "sl-2",
          patientName: "Michael Chen",
          dos: "2024-01-18",
          cpt: "85025",
          visitId: "V003",
          charges: 180,
          paymentAmount: 180,
          deductible: 0,
          coins: 0,
          copay: 0,
          allowable: 180,
          adjustment: 0,
          appliedAmount: 0,
          lineStatus: "pending",
        },
        {
          id: "sl-3",
          patientName: "Emily Rodriguez",
          dos: "2024-01-22",
          cpt: "99213",
          visitId: "V005",
          charges: 150,
          paymentAmount: 155.50,
          deductible: 0,
          coins: 0,
          copay: 0,
          allowable: 155.50,
          adjustment: 0,
          appliedAmount: 0,
          lineStatus: "new",
        },
      ],
    },
    {
      id: "INS002",
      payerName: "Aetna Insurance",
      payerId: "INS-AE002",
      amount: 650,
      checkDate: "2024-01-17",
      paymentMethod: "EFT",
      status: "Paid",
      source: "Insurance",
      documents: 1,
      paymentStatus: "new",
      totalApplied: 0,
      totalRemaining: 650,
      serviceLines: [
        {
          id: "sl-4",
          patientName: "James Wilson",
          dos: "2024-01-25",
          cpt: "99215",
          visitId: "V007",
          charges: 250,
          paymentAmount: 250,
          deductible: 0,
          coins: 0,
          copay: 0,
          allowable: 250,
          adjustment: 0,
          appliedAmount: 0,
          lineStatus: "new",
        },
        {
          id: "sl-5",
          patientName: "Lisa Anderson",
          dos: "2024-01-19",
          cpt: "90834",
          visitId: "V008",
          charges: 180,
          paymentAmount: 180,
          deductible: 0,
          coins: 0,
          copay: 0,
          allowable: 180,
          adjustment: 0,
          appliedAmount: 0,
          lineStatus: "new",
        },
        {
          id: "sl-5b",
          patientName: "Lisa Anderson",
          dos: "2024-01-19",
          cpt: "90837",
          visitId: "V008B",
          charges: 210,
          paymentAmount: 210,
          deductible: 0,
          coins: 0,
          copay: 0,
          allowable: 210,
          adjustment: 0,
          appliedAmount: 0,
          lineStatus: "new",
        },
      ],
    },
    {
      id: "INS003",
      payerName: "Cigna Health",
      payerId: "INS-CG003",
      amount: 320,
      checkDate: "2024-01-14",
      paymentMethod: "Check",
      checkNumber: "5003",
      status: "Paid",
      source: "Insurance",
      documents: 1,
      paymentStatus: "consumed",
      totalApplied: 320,
      totalRemaining: 0,
      serviceLines: [
        {
          id: "sl-6",
          patientName: "Emily Rodriguez",
          dos: "2024-01-16",
          cpt: "71020",
          visitId: "V006",
          charges: 320,
          paymentAmount: 320,
          deductible: 100,
          coins: 50,
          copay: 20,
          allowable: 320,
          adjustment: 0,
          appliedAmount: 320,
          appliedOn: "03/10/2026",
          lineStatus: "applied",
        },
      ],
    },
  ]

  const [payments, setPayments] = useState<Payment[]>(source === "Insurance" ? insurancePayments : patientPayments)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredPayments = payments.filter((payment) => {
    const searchName = source === "Insurance" 
      ? payment.payerName || ""
      : payment.patientName || ""
    const matchesSearch =
      searchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.id?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-50"
      case "Denied":
        return "text-red-600 bg-red-50"
      case "Applied":
        return "text-green-600 bg-green-50"
      case "Unapplied":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getInsurancePaymentStatusColor = (status: InsurancePaymentStatus | undefined) => {
    switch (status) {
      case "new":
        return "text-yellow-700 bg-yellow-100"
      case "partial":
        return "text-orange-700 bg-orange-100"
      case "consumed":
        return "text-green-700 bg-green-100"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getInsurancePaymentStatusLabel = (status: InsurancePaymentStatus | undefined) => {
    switch (status) {
      case "new":
        return "New"
      case "partial":
        return "Partial"
      case "consumed":
        return "Consumed"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="w-full">
      {/* Main table container */}
      <div className="w-full" style={{ backgroundColor: "#F1F5F9" }}>
        {/* Filters row - no white background */}
        <div className="p-3 flex items-center gap-4 justify-between">
          {/* Filters on left side */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 w-48 h-8 bg-white border-0 rounded px-2 py-1">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              placeholder={source === "Insurance" ? "Search by payer" : "Search by patient"}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 h-6 bg-transparent border-0 focus:ring-0 text-sm outline-none"
            />
            </div>
            <Label className="text-xs font-semibold text-gray-700">Status:</Label>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as PaymentStatus | "All")
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-32 h-8 bg-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Payment Button - on the right */}
          <Button 
            onClick={() => setShowAddPaymentDialog(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white ml-4"
          >
            <Plus className="h-4 w-4" />
            Add Payment
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow" style={{ border: "1px solid #CBD5E1", marginTop: "0.5px" }}>
          <table className="w-full text-sm bg-white">
          <thead style={{ backgroundColor: "#F1F5F9", borderBottom: "0.5px solid #CBD5E1" }}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700" style={{ borderRight: "0.5px solid #CBD5E1" }}>Payment ID</th>
              <th className={`text-left text-xs font-semibold text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>
                {source === "Insurance" ? "Payer Name" : "Patient Name"}
              </th>
              <th className={`text-left text-xs font-semibold text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>
                {source === "Patients" ? "Payment Date" : "Check/ERA Date"}
              </th>
              <th className={`text-left text-xs font-semibold text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>Payment Method</th>
              <th className={`text-left text-xs font-semibold text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>Check Number</th>
              <th className={`text-left text-xs font-semibold text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>Payment Amount</th>
              <th className={`text-left text-xs font-semibold text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>Applied Amount</th>
              {source === "Patients" && (
                <>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700" style={{ borderRight: "0.5px solid #CBD5E1" }}>Where Applied</th>
                  <th className={`text-left text-xs font-semibold text-gray-700 px-4 py-2`} style={{ borderRight: "0.5px solid #CBD5E1" }}>Note</th>
                </>
              )}
              {source === "Insurance" && (
                <th className={`text-left text-xs font-semibold text-gray-700 px-4 py-2`} style={{ borderRight: "0.5px solid #CBD5E1" }}>Apply Lines</th>
              )}
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Documents</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((payment) => (
              <tr key={payment.id} style={{ borderBottom: "0.5px solid #CBD5E1" }} className="hover:bg-gray-50">
                <td className={`text-xs text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>{payment.id}</td>
                <td className={`text-xs text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>{source === "Insurance" ? payment.payerName : payment.patientName}</td>
                <td className={`text-xs text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>{payment.checkDate}</td>
                <td className={`text-xs text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>{payment.paymentMethod}</td>
                <td className={`text-xs text-gray-700 ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>{payment.checkNumber || "-"}</td>
                <td className={`text-xs text-gray-700 font-semibold ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} style={{ borderRight: "0.5px solid #CBD5E1" }}>${payment.amount.toFixed(2)}</td>
                <td 
                  className={`text-xs font-semibold ${source === "Insurance" ? "px-3 py-2" : "px-4 py-2"}`} 
                  style={{ borderRight: "0.5px solid #CBD5E1", color: source === "Insurance" && (payment.serviceLines?.filter(l => l.lineStatus === "applied").reduce((s, l) => s + l.appliedAmount, 0) ?? 0) < payment.amount ? "rgb(220, 38, 38)" : "rgb(55, 65, 81)" }}
                >
                  ${source === "Insurance" ? (payment.serviceLines?.filter(l => l.lineStatus === "applied").reduce((s, l) => s + l.appliedAmount, 0) ?? 0).toFixed(2) : payment.amount.toFixed(2)}
                </td>
                {source === "Patients" && (
                  <>
                    <td className="px-2 py-2 text-xs text-gray-700 text-center w-20" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                      <button 
                        onClick={() => {
                          setSelectedPaymentForView(payment)
                          setShowAppliedDetailsModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                      >
                        View
                      </button>
                    </td>
                    <td className={`text-xs text-gray-700 px-4 py-2`} style={{ borderRight: "0.5px solid #CBD5E1" }}>
                      {payment.note || "-"}
                    </td>
                  </>
                )}
                {source === "Insurance" && (
                  <td className={`text-xs text-gray-700 px-4 py-2 text-center`} style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <button 
                      onClick={() => {
                        setSelectedPaymentForLines(payment)
                        setShowLinesDialog(true)
                      }}
                      className="hover:opacity-70 transition-opacity"
                      title="View payment lines"
                    >
                      {payment.paymentStatus === "consumed" ? (
                        <Lock className="w-5 h-5 mx-auto text-gray-400" />
                      ) : payment.paymentStatus === "partial" ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                          {payment.serviceLines?.filter(l => l.lineStatus === "applied").length ?? 0}/{payment.serviceLines?.length ?? 0} Applied
                        </span>
                      ) : (
                        <svg className="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </td>
                )}
                <td className="px-4 py-2 text-center" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  {payment.documents && payment.documents > 0 ? (
                    <button 
                      onClick={() => {
                        setSelectedPaymentForDocuments(payment)
                        setShowDocumentsModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium text-xs"
                      title={`View ${payment.documents} document(s)`}
                    >
                      {payment.documents}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                  <div className="flex justify-center gap-1">
                    {source === "Patients" && (
                      <>
                        {payment.documents && payment.documents > 0 && (
                          <button 
                            onClick={() => {
                              setSelectedPaymentForUpload(payment)
                              setShowUploadModal(true)
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title={`Upload documents for ${source === "Insurance" ? payment.payerName : payment.patientName}`}
                          >
                            <Paperclip className="w-4 h-4" style={{ color: "rgb(4, 53, 95)" }} />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedPaymentForEdit(payment)
                            setEditFormData({
                              patientName: payment.patientName || "",
                              patientId: payment.patientId || "",
                              amount: payment.amount.toString(),
                              checkDate: payment.checkDate,
                              paymentMethod: payment.paymentMethod as PaymentMethod,
                              checkNumber: payment.checkNumber || "",
                              status: payment.status,
                              note: payment.note || "",
                            })
                            setShowEditModal(true)
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Edit payment"
                        >
                          <Edit2 className="w-4 h-4" style={{ color: "rgb(4, 53, 95)" }} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedPaymentForDelete(payment)
                            setShowDeleteConfirmation(true)
                          }}
                          className="p-1 rounded transition-opacity hover:opacity-80"
                          title="Delete payment"
                        >
                          <Trash2 className="w-4 h-4" style={{ color: "rgb(4, 53, 95)" }} />
                        </button>
                      </>
                    )}
                    {source === "Insurance" && (
                      <>
                        {payment.documents && payment.documents > 0 && (
                          <button 
                            onClick={() => {
                              setSelectedPaymentForUpload(payment)
                              setShowUploadModal(true)
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title={`Upload documents for ${payment.payerName}`}
                          >
                            <Paperclip className="w-4 h-4" style={{ color: "rgb(4, 53, 95)" }} />
                          </button>
                        )}
                        {(payment.paymentStatus === "new" || !payment.paymentStatus) && (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedPaymentForEdit(payment)
                                setEditFormData({
                                  patientName: payment.patientName || "",
                                  patientId: payment.patientId || "",
                                  amount: payment.amount.toString(),
                                  checkDate: payment.checkDate,
                                  paymentMethod: payment.paymentMethod as PaymentMethod,
                                  checkNumber: payment.checkNumber || "",
                                  status: payment.status,
                                  provider: payment.provider || "",
                                  note: payment.note || "",
                                })
                                // Initialize existing documents if available
                                if (payment.documents && payment.documents > 0) {
                                  setExistingEditDocuments([`document_${payment.id}_1`, `document_${payment.id}_2`])
                                } else {
                                  setExistingEditDocuments([])
                                }
                                setEditFilesToUpload([])
                                setShowEditModal(true)
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedPaymentForDelete(payment)
                                setShowDeleteConfirmation(true)
                              }}
                              className="p-1 rounded transition-opacity hover:opacity-80"
                              title="Delete payment"
                            >
                              <Trash2 className="w-4 h-4" style={{ color: "rgb(4, 53, 95)" }} />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 flex items-center justify-between text-xs" style={{ borderTop: "0.5px solid #CBD5E1" }}>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Payment Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="!w-5/6 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>Add New {source === "Patients" ? "Patient" : "Insurance"} Payment</DialogTitle>
            </DialogHeader>
          
          <div className="space-y-2">
            {source === "Patients" ? (
              <>
            {/* Patient Name and ID in one row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Patient Name - Searchable */}
              <div>
                <Label className="text-xs font-semibold">Patient Name</Label>
                <div className="relative mt-1">
                  <Input
                    value={patientSearchTerm || newPayment.patientName}
                    onChange={(e) => {
                      setPatientSearchTerm(e.target.value)
                      setShowPatientDropdown(true)
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="Search or select patient"
                    className="mt-0"
                  />
                  {showPatientDropdown && patientSearchTerm && (
                    <div className="absolute z-50 w-full bg-white border border-gray-200 rounded mt-1 shadow-lg max-h-48 overflow-y-auto">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {patient.firstName} {patient.lastName}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">No patients found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient ID - Auto-generated */}
              <div>
                <Label className="text-xs font-semibold">Patient ID</Label>
                <Input
                  value={newPayment.patientId}
                  readOnly
                  placeholder="Auto-generated"
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Paid Amount and Payment Date in one row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Paid Amount */}
              <div>
                <Label className="text-xs font-semibold">Paid Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              {/* Payment Date */}
              <div>
                <Label className="text-xs font-semibold">Payment Date</Label>
                <Input
                  type="date"
                  value={newPayment.checkDate}
                  onChange={(e) => setNewPayment({...newPayment, checkDate: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Payment Method and Check Number in one row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Payment Method */}
              <div>
                <Label className="text-xs font-semibold">Method</Label>
                <Select value={newPayment.paymentMethod} onValueChange={(value) => setNewPayment({...newPayment, paymentMethod: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Check Number */}
              <div>
                <Label className="text-xs font-semibold">Check Number (Optional)</Label>
                <Input
                  value={newPayment.checkNumber}
                  onChange={(e) => setNewPayment({...newPayment, checkNumber: e.target.value})}
                  placeholder="Enter check number"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Provider */}
            <div>
              <Label className="text-xs font-semibold">Provider</Label>
              <Input
                value={newPayment.provider}
                onChange={(e) => setNewPayment({...newPayment, provider: e.target.value})}
                placeholder="Enter provider name"
                className="mt-1"
              />
            </div>

            {/* Note */}
            <div>
              <Label className="text-xs font-semibold">Note</Label>
              <Input
                value={newPayment.description}
                onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                placeholder="Enter payment note"
                className="mt-1"
              />
            </div>

            {/* Document Upload */}
            <div>
              <Label className="text-xs font-semibold">Upload Documents (Optional)</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">Click to upload or drag and drop</span>
                  </div>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                        title="Remove file"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            </>
            ) : (
              <>
              {/* SECTION 1: HEADER FIELDS */}
              <div className="border-b pb-6 mb-6">
                <h3 className="text-sm font-semibold mb-4 text-gray-800">Insurance Payment Details</h3>
                
                {/* Payer Name and ID in one row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Payer Name - Searchable */}
                  <div>
                    <Label className="text-xs font-semibold">Payer Name</Label>
                    <div className="relative mt-1">
                      <Input
                        value={payerSearchTerm || newInsurancePayment.payerName}
                        onChange={(e) => {
                          setPayerSearchTerm(e.target.value)
                          setShowPayerDropdown(true)
                        }}
                        onFocus={() => setShowPayerDropdown(true)}
                        placeholder="Search or select payer"
                        className="mt-0"
                      />
                      {showPayerDropdown && payerSearchTerm && (
                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded mt-1 shadow-lg max-h-48 overflow-y-auto">
                          {filteredInsurance.length > 0 ? (
                            filteredInsurance.map((insurer) => (
                              <button
                                key={insurer.id}
                                onClick={() => handlePayerSelect(insurer)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                              >
                                {insurer.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No insurers found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payer ID - Auto-generated */}
                  <div>
                    <Label className="text-xs font-semibold">Payer ID</Label>
                    <Input
                      value={newInsurancePayment.payerId}
                      readOnly
                      placeholder="Auto-generated"
                      className="mt-1 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Total Amount and Check Date in one row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <Label className="text-xs font-semibold">Total Payment Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newInsurancePayment.amount}
                      onChange={(e) => setNewInsurancePayment({...newInsurancePayment, amount: e.target.value})}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Check Date</Label>
                    <Input
                      type="date"
                      value={newInsurancePayment.checkDate}
                      onChange={(e) => setNewInsurancePayment({...newInsurancePayment, checkDate: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Method and Check Number in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold">Payment Method</Label>
                    <Select value={newInsurancePayment.paymentMethod} onValueChange={(value) => setNewInsurancePayment({...newInsurancePayment, paymentMethod: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="EFT">EFT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Check/Reference Number (Optional)</Label>
                    <Input
                      value={newInsurancePayment.checkNumber}
                      onChange={(e) => setNewInsurancePayment({...newInsurancePayment, checkNumber: e.target.value})}
                      placeholder="Enter check or reference number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SERVICE LINE BREAKDOWN */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-4 text-gray-800">Service Line Breakdown</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead style={{ backgroundColor: "#F1F5F9" }}>
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Patient Name <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">DOS <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">CPT <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Charges</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Payment Amt <span className="text-red-500">*</span></th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Deductible</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Coins</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Copay</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Allowable</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Adjustment</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {newInsurancePayment.serviceLines?.map((line, index) => (
                        <tr key={line.id}>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <Select value={line.patientName} onValueChange={(value) => {
                              const updated = [...(newInsurancePayment.serviceLines || [])];
                              updated[index].patientName = value;
                              setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                            }}>
                              <SelectTrigger className="h-6 text-xs border-0 px-1 focus:ring-0">
                                <SelectValue placeholder="Select patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {SAMPLE_PATIENTS.map((p) => (
                                  <SelectItem key={p.id} value={p.firstName + " " + p.lastName}>{p.firstName} {p.lastName}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <Select value={line.dos} onValueChange={(value) => {
                              const updated = [...(newInsurancePayment.serviceLines || [])];
                              updated[index].dos = value;
                              updated[index].cpt = "";
                              updated[index].visitId = "";
                              updated[index].charges = 0;
                              setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                            }}>
                              <SelectTrigger className="h-6 text-xs border-0 px-1 focus:ring-0">
                                <SelectValue placeholder="Select DOS" />
                              </SelectTrigger>
                              <SelectContent>
                                {line.patientName && VISITS[line.patientName] ? 
                                  Object.keys(VISITS[line.patientName]).map(dos => (
                                    <SelectItem key={dos} value={dos}>{dos}</SelectItem>
                                  ))
                                : (
                                  <>
                                    <SelectItem value="2024-01-20">01/20/2024</SelectItem>
                                    <SelectItem value="2024-01-18">01/18/2024</SelectItem>
                                    <SelectItem value="2024-01-15">01/15/2024</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <Select value={line.cpt} onValueChange={(value) => {
                              const updated = [...(newInsurancePayment.serviceLines || [])];
                              updated[index].cpt = value;
                              if (line.patientName && VISITS[line.patientName]?.[line.dos]) {
                                updated[index].charges = VISITS[line.patientName][line.dos].charges[value] || 0;
                              }
                              setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                            }}>
                              <SelectTrigger className="h-6 text-xs border-0 px-1 focus:ring-0">
                                <SelectValue placeholder="Select CPT" />
                              </SelectTrigger>
                              <SelectContent>
                                {line.patientName && line.dos && VISITS[line.patientName]?.[line.dos] ? 
                                  VISITS[line.patientName][line.dos].cpts.map(cpt => (
                                    <SelectItem key={cpt} value={cpt}>{cpt}</SelectItem>
                                  ))
                                : (
                                  <>
                                    <SelectItem value="99213">99213</SelectItem>
                                    <SelectItem value="85025">85025</SelectItem>
                                    <SelectItem value="71046">71046</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <div className="text-xs px-1 py-1 bg-gray-100 rounded">
                              {line.charges || 0}
                            </div>
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <div className="text-xs px-1 py-1 bg-gray-100 rounded">
                              ${line.charges.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <input 
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={line.paymentAmount}
                              onChange={(e) => {
                                const updated = [...(newInsurancePayment.serviceLines || [])];
                                updated[index].paymentAmount = parseFloat(e.target.value) || 0;
                                setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <input 
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={line.deductible}
                              onChange={(e) => {
                                const updated = [...(newInsurancePayment.serviceLines || [])];
                                updated[index].deductible = parseFloat(e.target.value) || 0;
                                setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <input 
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={line.coins}
                              onChange={(e) => {
                                const updated = [...(newInsurancePayment.serviceLines || [])];
                                updated[index].coins = parseFloat(e.target.value) || 0;
                                setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <input 
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={line.copay}
                              onChange={(e) => {
                                const updated = [...(newInsurancePayment.serviceLines || [])];
                                updated[index].copay = parseFloat(e.target.value) || 0;
                                setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <input 
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={line.allowable}
                              onChange={(e) => {
                                const updated = [...(newInsurancePayment.serviceLines || [])];
                                updated[index].allowable = parseFloat(e.target.value) || 0;
                                setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                          </td>
                          <td className="px-2 py-2 border-r border-gray-200">
                            <div className="text-xs px-1 py-1 bg-gray-100 rounded">
                              ${(line.charges - line.paymentAmount).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <button 
                              onClick={() => {
                                const updated = newInsurancePayment.serviceLines?.filter((_, i) => i !== index) || [];
                                setNewInsurancePayment({...newInsurancePayment, serviceLines: updated});
                              }}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete line item"
                              disabled={(newInsurancePayment.serviceLines?.length || 0) <= 1}
                            >
                              <Trash2 
                                className="h-4 w-4 hover:opacity-80 transition-opacity" 
                                style={{ color: "rgb(4, 53, 95)" }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Line Item Button */}
                <button
                  onClick={() => {
                    const newLine: ServiceLine = {
                      id: `line-${Date.now()}`,
                      patientName: "",
                      dos: "",
                      cpt: "",
                      visitId: "",
                      charges: 0,
                      paymentAmount: 0,
                      deductible: 0,
                      coins: 0,
                      copay: 0,
                      allowable: 0,
                      adjustment: 0,
                      appliedAmount: 0,
                      lineStatus: "Pending",
                    };
                    setNewInsurancePayment({
                      ...newInsurancePayment,
                      serviceLines: [...(newInsurancePayment.serviceLines || []), newLine]
                    });
                  }}
                  className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Service Line
                </button>
              </div>

              {/* Document Upload */}
              <div className="mb-6">
                <Label className="text-xs font-semibold">Upload Documents (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">Click to upload or drag and drop</span>
                    </div>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                          title="Remove file"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>
            )}
            </div>

          {/* Dialog Actions */}
          <div className="flex gap-2 justify-end mt-6 border-t pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setShowAddPaymentDialog(false)
                setUploadedFiles([])
                setPatientSearchTerm("")
                setPayerSearchTerm("")
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (source === "Patients") {
                  alert(`Payment added for ${newPayment.patientName} with ${uploadedFiles.length} document(s)`)
                  setNewPayment({
                    patientName: "",
                    patientId: "",
                    amount: "",
                    checkDate: "",
                    paymentMethod: "Check",
                    checkNumber: "",
                    status: "Applied",
                    provider: "",
                    description: "",
                  })
                  setPatientSearchTerm("")
                } else {
                  alert(`Payment added for ${newInsurancePayment.payerName} with ${uploadedFiles.length} document(s)`)
                  setNewInsurancePayment({
                    payerName: "",
                    payerId: "",
                    amount: "",
                    checkDate: "",
                    paymentMethod: "Check",
                    checkNumber: "",
                    sourceCode: "",
                    status: "Paid",
                    paymentStatus: "new",
                    serviceLines: [
                      {
                        id: "line-1",
                        patientName: "",
                        dos: "",
                        cpt: "",
                        visitId: "",
                        charges: 0,
                        paymentAmount: 0,
                        deductible: 0,
                        coins: 0,
                        copay: 0,
                        allowable: 0,
                        adjustment: 0,
                        appliedAmount: 0,
                        lineStatus: "Pending",
                      },
                    ],
                  })
                  setPayerSearchTerm("")
                }
                setShowAddPaymentDialog(false)
                setUploadedFiles([])
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Save
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      {/* Applied Details Modal */}
      <Dialog open={showAppliedDetailsModal} onOpenChange={setShowAppliedDetailsModal}>
        <DialogContent className="!w-1/2 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>Payment Applied Details</DialogTitle>
            </DialogHeader>

            {selectedPaymentForView && (
              <div className="space-y-4">
                {/* Payment Summary */}
                <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">{source === "Insurance" ? "Payer ID" : "Patient ID"}</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForView.patientId}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">{source === "Insurance" ? "Payer" : "Patient"}</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForView.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Payment Date</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForView.checkDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Amount</Label>
                    <p className="text-sm font-medium text-gray-900">${selectedPaymentForView.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Applied To Details Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-xs">
                      <thead style={{ backgroundColor: "#F1F5F9" }}>
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Payment ID</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Applied On</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">DOS</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Visit ID</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Applied Amount</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Account No</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPaymentForView.appliedTo && selectedPaymentForView.appliedTo.length > 0 ? (
                          selectedPaymentForView.appliedTo.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-700">{selectedPaymentForView.id}</td>
                              <td className="px-3 py-2 text-gray-700">{item.appliedOn}</td>
                              <td className="px-3 py-2 text-gray-700">{item.dos}</td>
                              <td className="px-3 py-2 text-gray-700">{item.visitId}</td>
                              <td className="px-3 py-2 text-gray-700 font-medium">${item.appliedAmount.toFixed(2)}</td>
                              <td className="px-3 py-2 text-gray-700">{item.accountNo}</td>
                              <td className="px-3 py-2 text-center">
                                <button 
                                  onClick={() => alert(`Removed applied amount for DOS ${item.dos}`)}
                                  className="p-1 rounded transition-opacity hover:opacity-80"
                                  title="Remove this applied amount"
                                >
                                  <Trash2 className="w-4 h-4" style={{ color: "rgb(4, 53, 95)" }} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-gray-200">
                            <td colSpan={7} className="px-3 py-2 text-gray-500 text-center">No applied details available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                {/* Close Button */}
                <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                  <Button 
                    onClick={() => setShowAppliedDetailsModal(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Modal */}
      <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
        <DialogContent className="!w-1/2 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>Payment Documents</DialogTitle>
            </DialogHeader>

            {selectedPaymentForDocuments && (
              <div className="space-y-4">
                {/* Payment Summary */}
                <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Payment ID</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForDocuments.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Patient</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForDocuments.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Amount</Label>
                    <p className="text-sm font-medium text-gray-900">${selectedPaymentForDocuments.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-gray-700">Attached Documents ({selectedPaymentForDocuments.documents || 0}):</Label>
                  <div className="space-y-2">
                    {selectedPaymentForDocuments.documents && selectedPaymentForDocuments.documents > 0 ? (
                      Array.from({ length: selectedPaymentForDocuments.documents }, (_, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">payment_document_{i + 1}.pdf</p>
                              <p className="text-xs text-gray-500">1.2 MB • PDF</p>
                            </div>
                          </div>
                          <button className="p-1 hover:bg-gray-200 rounded transition">
                            <Download className="h-4 w-4 text-blue-600" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No documents attached</p>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                  <Button 
                    onClick={() => setShowDocumentsModal(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Documents Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="!w-1/2 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>Upload Documents</DialogTitle>
            </DialogHeader>

            {selectedPaymentForUpload && (
              <div className="space-y-4">
                {/* Payment Info */}
                <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Payment ID</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForUpload.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Patient</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForUpload.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Amount</Label>
                    <p className="text-sm font-medium text-gray-900">${selectedPaymentForUpload.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Upload Area */}
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Add Documents</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setFilesToUpload([...filesToUpload, ...Array.from(e.target.files)])
                        }
                      }}
                      className="hidden"
                      id="file-upload-payment"
                    />
                    <label htmlFor="file-upload-payment" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-3 text-gray-600 hover:text-gray-800">
                        <Paperclip className="h-6 w-6" />
                        <div className="text-center">
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOC, or IMAGE files</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {filesToUpload.length > 0 && (
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2">Files to Upload ({filesToUpload.length})</Label>
                    <div className="space-y-2">
                      {filesToUpload.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            onClick={() => setFilesToUpload(filesToUpload.filter((_, i) => i !== index))}
                            className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                            title="Remove file"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dialog Actions */}
                <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowUploadModal(false)
                      setFilesToUpload([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      alert(`Uploaded ${filesToUpload.length} document(s) to payment ${selectedPaymentForUpload.id}`)
                      setShowUploadModal(false)
                      setFilesToUpload([])
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Upload Documents
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="!w-1/2 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>Edit Payment</DialogTitle>
            </DialogHeader>

            {selectedPaymentForEdit && (
              <div className="space-y-4">
                {/* Patient Name and Patient ID in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold">Patient Name</Label>
                    <Input
                      value={editFormData.patientName}
                      onChange={(e) => setEditFormData({ ...editFormData, patientName: e.target.value })}
                      placeholder="Select patient"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Patient ID</Label>
                    <Input
                      value={editFormData.patientId}
                      readOnly
                      placeholder="Auto-generated"
                      className="mt-1 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Paid Amount and Payment Date in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold">Paid Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Payment Date</Label>
                    <Input
                      type="date"
                      value={editFormData.checkDate}
                      onChange={(e) => setEditFormData({ ...editFormData, checkDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Payment Method and Check Number in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold">Method</Label>
                    <Select value={editFormData.paymentMethod} onValueChange={(value) => setEditFormData({ ...editFormData, paymentMethod: value as PaymentMethod })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Check Number (Optional)</Label>
                    <Input
                      value={editFormData.checkNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, checkNumber: e.target.value })}
                      placeholder="Enter check number"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <Label className="text-xs font-semibold">Provider</Label>
                  <Input
                    value={editFormData.provider}
                    onChange={(e) => setEditFormData({ ...editFormData, provider: e.target.value })}
                    placeholder="Enter provider name"
                    className="mt-1"
                  />
                </div>

                {/* Note */}
                <div>
                  <Label className="text-xs font-semibold">Note</Label>
                  <Input
                    value={editFormData.note}
                    onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                    placeholder="Enter payment note"
                    className="mt-1"
                  />
                </div>

                {/* File Upload Section - Only for Patient Payments */}
                {source === "Patients" && (
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Documents</Label>
                    
                    {/* Existing Documents */}
                    {existingEditDocuments.length > 0 && (
                      <div className="mt-2 mb-4">
                        <p className="text-xs text-gray-600 mb-2">Attached Documents ({existingEditDocuments.length})</p>
                        <div className="space-y-2">
                          {existingEditDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Paperclip className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span className="text-xs text-gray-700 truncate">Attachment_{index + 1}.pdf</span>
                              </div>
                              <button
                                onClick={() => setExistingEditDocuments(existingEditDocuments.filter((_, i) => i !== index))}
                                className="ml-2 p-1 hover:bg-blue-200 rounded flex-shrink-0"
                                title="Remove document"
                              >
                                <X className="h-4 w-4 text-blue-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload New Documents */}
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setEditFilesToUpload([...editFilesToUpload, ...Array.from(e.target.files)])
                          }
                        }}
                        className="hidden"
                        id="file-upload-edit-payment"
                      />
                      <label htmlFor="file-upload-edit-payment" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800">
                          <Paperclip className="h-5 w-5" />
                          <div className="text-center">
                            <p className="text-xs font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, DOC, or IMAGE files</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Files to Upload List - Only for Patient Payments */}
                {source === "Patients" && editFilesToUpload.length > 0 && (
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2">New Files to Upload ({editFilesToUpload.length})</Label>
                    <div className="space-y-2">
                      {editFilesToUpload.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            onClick={() => setEditFilesToUpload(editFilesToUpload.filter((_, i) => i !== index))}
                            className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                            title="Remove file"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dialog Actions */}
                <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditFilesToUpload([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      alert(`Payment ${selectedPaymentForEdit.id} updated successfully${editFilesToUpload.length > 0 ? ` with ${editFilesToUpload.length} file(s)` : ""}`)
                      setShowEditModal(false)
                      setEditFilesToUpload([])
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="!w-1/3 !max-w-none">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>Delete Payment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the payment for <strong>{selectedPaymentForDelete?.patientName}</strong> (ID: <strong>{selectedPaymentForDelete?.id}</strong>)?
              </p>
              <p className="text-sm text-gray-600">
                Amount: <strong>${selectedPaymentForDelete?.amount.toFixed(2)}</strong>
              </p>
              <p className="text-xs text-red-600">
                This action cannot be undone.
              </p>

              {/* Dialog Actions */}
              <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    alert(`Payment ${selectedPaymentForDelete?.id} has been deleted successfully`)
                    setShowDeleteConfirmation(false)
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lines Dialog - Payment Application Workflow */}
      <Dialog open={showLinesDialog} onOpenChange={setShowLinesDialog}>
        <DialogContent className="!w-5/6 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
  <DialogHeader className="mb-6">
  <DialogTitle>Payment Breakdown</DialogTitle>
  </DialogHeader>

            {selectedPaymentForLines && selectedPaymentForLines.serviceLines && (
              <div className="space-y-6">
                {/* Status Banner */}
                {selectedPaymentForLines.paymentStatus === "consumed" && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-900">This payment is fully applied and locked. All service lines have been processed.</p>
                  </div>
                )}

                {/* Payment Summary Header */}
                <div className="grid grid-cols-5 gap-4 pb-4 border-b">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Payer</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForLines.payerName}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Check #</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForLines.checkNumber || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Check Date</Label>
                    <p className="text-sm font-medium text-gray-900">{selectedPaymentForLines.checkDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Total Amount</Label>
                    <p className="text-sm font-medium text-gray-900">${selectedPaymentForLines.amount.toFixed(2)}</p>
                  </div>
                  <div>
                  <Label className="text-xs font-semibold text-gray-600">Applied / Remaining</Label>
                  <p className="text-sm font-medium text-gray-900">
                    ${(selectedPaymentForLines.serviceLines?.filter(l => l.lineStatus === "applied").reduce((s, l) => s + l.appliedAmount, 0) ?? 0).toFixed(2)} / ${(selectedPaymentForLines.amount - (selectedPaymentForLines.serviceLines?.filter(l => l.lineStatus === "applied").reduce((s, l) => s + l.appliedAmount, 0) ?? 0)).toFixed(2)}
                  </p>
                  </div>
                </div>

                {/* Service Lines Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead style={{ backgroundColor: "#F1F5F9" }}>
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Patient</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">DOS</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">CPT</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Charges</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Payment Amt</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Visit ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Applied Amt</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Applied On</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Status</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedPaymentForLines.serviceLines || []).map((line, index) => {
                        const isNew = line.lineStatus === "new";
                        const isPending = line.lineStatus === "pending";
                        const isApplied = line.lineStatus === "applied";
                        const isLocked = selectedPaymentForLines.paymentStatus === "consumed";
                        const charges = line.charges;
                        
                        return (
                          <tr key={line.id} className={isApplied ? "bg-gray-50" : "bg-white"}>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700">{line.patientName}</td>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700">{line.dos}</td>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700">{line.cpt || "-"}</td>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700 font-medium">${charges.toFixed(2)}</td>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700 font-medium">${line.paymentAmount.toFixed(2)}</td>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700">{isApplied ? (line.visitId || "-") : "-"}</td>
                            <td className={`px-3 py-2 border-r border-gray-200 font-medium ${
                              isApplied && line.appliedAmount < line.paymentAmount ? 'text-red-600' : 'text-gray-700'
                            }`}>
                              ${line.appliedAmount.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200 text-gray-700 text-xs">{line.appliedOn || "-"}</td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {isNew ? (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">New</span>
                              ) : isPending ? (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Pending</span>
                              ) : (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Applied</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isNew ? (
                                <button
                                  onClick={() => {
                                    const updated = [...(selectedPaymentForLines.serviceLines || [])];
                                    updated[index].lineStatus = "pending";
                                    const updatedPayment = {
                                      ...selectedPaymentForLines,
                                      serviceLines: updated,
                                      paymentStatus: "partial" as InsurancePaymentStatus,
                                      totalApplied: updated.reduce((sum, l) => sum + (l.lineStatus === "applied" ? l.appliedAmount : 0), 0),
                                      totalRemaining: selectedPaymentForLines.amount - updated.reduce((sum, l) => sum + (l.lineStatus === "applied" ? l.appliedAmount : 0), 0)
                                    };
                                    setSelectedPaymentForLines(updatedPayment);
                                    setPayments(prev =>
                                      prev.map(p => p.id === updatedPayment.id ? updatedPayment : p)
                                    );
                                  }}
                                  className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                                >
                                  Apply
                                </button>
                              ) : isPending ? (
                                <button
                                  onClick={() => {
                                    const updated = [...(selectedPaymentForLines.serviceLines || [])];
                                    updated[index].lineStatus = "new";
                                    const updatedPayment = {
                                      ...selectedPaymentForLines,
                                      serviceLines: updated,
                                      paymentStatus: updated.some(l => l.lineStatus === "applied") ? "partial" as InsurancePaymentStatus : "new" as InsurancePaymentStatus,
                                      totalApplied: updated.reduce((sum, l) => sum + (l.lineStatus === "applied" ? l.appliedAmount : 0), 0),
                                      totalRemaining: selectedPaymentForLines.amount - updated.reduce((sum, l) => sum + (l.lineStatus === "applied" ? l.appliedAmount : 0), 0)
                                    };
                                    setSelectedPaymentForLines(updatedPayment);
                                    setPayments(prev =>
                                      prev.map(p => p.id === updatedPayment.id ? updatedPayment : p)
                                    );
                                  }}
                                  className="px-2 py-1 text-xs border border-gray-300 hover:bg-gray-50 text-gray-600 rounded transition-colors"
                                >
                                  Cancel
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Warning for Partial Coverage */}
                {selectedPaymentForLines.serviceLines.some(l => l.appliedAmount > 0 && l.appliedAmount < l.paymentAmount) && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs font-semibold text-orange-900">
                      ⚠️ Partial Coverage Detected: Some lines have applied amounts less than the payment amount. This may indicate prior coverage applied to the visit.
                    </p>
                  </div>
                )}

                {/* Add Line Item Form */}
                {showAddLineInDialog && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-4">Add New Service Line</h4>
                      <div className="space-y-3">
                        {/* Patient Name and DOS in one row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-semibold">Patient Name</Label>
                            <Select value={newLineInDialog.patientName} onValueChange={(value) => {
                              setNewLineInDialog({...newLineInDialog, patientName: value, dos: "", cpt: "", charges: 0});
                            }}>
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue placeholder="Select patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {SAMPLE_PATIENTS.map((p) => (
                                  <SelectItem key={p.id} value={p.firstName + " " + p.lastName}>{p.firstName} {p.lastName}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">DOS</Label>
                            <Select value={newLineInDialog.dos} onValueChange={(value) => {
                              setNewLineInDialog({...newLineInDialog, dos: value, cpt: "", charges: 0});
                            }}>
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue placeholder="Select DOS" />
                              </SelectTrigger>
                              <SelectContent>
                                {newLineInDialog.patientName && VISITS[newLineInDialog.patientName] ? 
                                  Object.keys(VISITS[newLineInDialog.patientName]).map(dos => (
                                    <SelectItem key={dos} value={dos}>{dos}</SelectItem>
                                  ))
                                : null}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* CPT and Charges in one row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-semibold">CPT</Label>
                            <Select value={newLineInDialog.cpt} onValueChange={(value) => {
                              if (newLineInDialog.patientName && VISITS[newLineInDialog.patientName]?.[newLineInDialog.dos]) {
                                const charges = VISITS[newLineInDialog.patientName][newLineInDialog.dos].charges[value] || 0;
                                setNewLineInDialog({...newLineInDialog, cpt: value, charges: charges, paymentAmount: charges});
                              } else {
                                setNewLineInDialog({...newLineInDialog, cpt: value});
                              }
                            }}>
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue placeholder="Select CPT" />
                              </SelectTrigger>
                              <SelectContent>
                                {newLineInDialog.patientName && newLineInDialog.dos && VISITS[newLineInDialog.patientName]?.[newLineInDialog.dos] ? 
                                  VISITS[newLineInDialog.patientName][newLineInDialog.dos].cpts.map(cpt => (
                                    <SelectItem key={cpt} value={cpt}>{cpt}</SelectItem>
                                  ))
                                : null}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">Charges</Label>
                            <div className="mt-1 px-2 py-2 bg-gray-100 rounded text-xs text-gray-700">
                              ${newLineInDialog.charges.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Payment Amount, Deductible, Coins, Copay */}
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label className="text-xs font-semibold">Payment Amt</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newLineInDialog.paymentAmount}
                              onChange={(e) => setNewLineInDialog({...newLineInDialog, paymentAmount: parseFloat(e.target.value) || 0})}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">Deductible</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newLineInDialog.deductible}
                              onChange={(e) => setNewLineInDialog({...newLineInDialog, deductible: parseFloat(e.target.value) || 0})}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">Coins</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newLineInDialog.coins}
                              onChange={(e) => setNewLineInDialog({...newLineInDialog, coins: parseFloat(e.target.value) || 0})}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">Copay</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newLineInDialog.copay}
                              onChange={(e) => setNewLineInDialog({...newLineInDialog, copay: parseFloat(e.target.value) || 0})}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                        </div>

                        {/* Allowable and Adjustment */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-semibold">Allowable</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newLineInDialog.allowable}
                              onChange={(e) => setNewLineInDialog({...newLineInDialog, allowable: parseFloat(e.target.value) || 0})}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">Adjustment</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newLineInDialog.adjustment}
                              onChange={(e) => setNewLineInDialog({...newLineInDialog, adjustment: parseFloat(e.target.value) || 0})}
                              className="mt-1 h-8 text-xs"
                            />
                          </div>
                        </div>

                        {/* Add and Cancel buttons */}
                        <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-blue-200">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddLineInDialog(false);
                              setNewLineInDialog({
                                patientName: "",
                                dos: "",
                                cpt: "",
                                charges: 0,
                                paymentAmount: 0,
                                deductible: 0,
                                coins: 0,
                                copay: 0,
                                allowable: 0,
                                adjustment: 0,
                              });
                            }}
                            className="h-7 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (!newLineInDialog.patientName || !newLineInDialog.dos || !newLineInDialog.cpt) {
                                alert("Please fill in all required fields");
                                return;
                              }
                              if (selectedPaymentForLines) {
                                const newLine: ServiceLine = {
                                  id: `line-${Date.now()}`,
                                  patientName: newLineInDialog.patientName,
                                  dos: newLineInDialog.dos,
                                  cpt: newLineInDialog.cpt,
                                  visitId: "", // visitId is NOT populated when adding new line
                                  charges: newLineInDialog.charges,
                                  paymentAmount: newLineInDialog.paymentAmount,
                                  deductible: newLineInDialog.deductible,
                                  coins: newLineInDialog.coins,
                                  copay: newLineInDialog.copay,
                                  allowable: newLineInDialog.allowable,
                                  adjustment: newLineInDialog.adjustment,
                                  appliedAmount: 0,
                                  lineStatus: "new" as LineStatus,
                                };
                                const updatedPayment = {
                                  ...selectedPaymentForLines,
                                  serviceLines: [...(selectedPaymentForLines.serviceLines || []), newLine],
                                };
                                setSelectedPaymentForLines(updatedPayment);
                                setPayments(prev =>
                                  prev.map(p => p.id === updatedPayment.id ? updatedPayment : p)
                                );
                                setShowAddLineInDialog(false);
                                setNewLineInDialog({
                                  patientName: "",
                                  dos: "",
                                  cpt: "",
                                  charges: 0,
                                  paymentAmount: 0,
                                  deductible: 0,
                                  coins: 0,
                                  copay: 0,
                                  allowable: 0,
                                  adjustment: 0,
                                });
                              }
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white h-7 text-xs"
                          >
                            Add Line Item
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dialog Actions */}
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                  <div className="flex gap-2">
                    {selectedPaymentForLines.paymentStatus !== "consumed" && (
                      <Button
                        onClick={() => setShowAddLineInDialog(!showAddLineInDialog)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Line Item
                      </Button>
                    )}
                    {selectedPaymentForLines.paymentStatus !== "consumed" && selectedPaymentForLines.serviceLines.some(l => l.lineStatus === "new") && (
                      <Button
                        onClick={() => {
                          const updated = selectedPaymentForLines.serviceLines.map(line => ({
                            ...line,
                            lineStatus: line.lineStatus === "new" ? "pending" as LineStatus : line.lineStatus
                          }));
                          const totalApplied = updated.reduce((sum, l) => sum + (l.lineStatus === "applied" ? l.appliedAmount : 0), 0);
                          const updatedPayment = {
                            ...selectedPaymentForLines,
                            serviceLines: updated,
                            paymentStatus: totalApplied >= selectedPaymentForLines.amount ? "consumed" as InsurancePaymentStatus : "partial" as InsurancePaymentStatus,
                            totalApplied: totalApplied,
                            totalRemaining: selectedPaymentForLines.amount - totalApplied
                          };
                          setSelectedPaymentForLines(updatedPayment);
                          setPayments(prev =>
                            prev.map(p => p.id === updatedPayment.id ? updatedPayment : p)
                          );
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                      >
                        Submit All for Posting
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (selectedPaymentForLines) {
                          setPayments(prev =>
                            prev.map(p => p.id === selectedPaymentForLines.id ? selectedPaymentForLines : p)
                          );
                        }
                        setShowLinesDialog(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
