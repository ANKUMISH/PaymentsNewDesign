"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit2, Trash2, Search, ChevronDown, Download, Plus } from "lucide-react"
import Link from "next/link"

type ChargeStatus = "Pending" | "Billed" | "Paid" | "Denied"

interface Charge {
  id: string
  patientName: string
  patientId: string
  serviceDate: string
  description: string
  amount: number
  status: ChargeStatus
  provider: string
  cptCode: string
  dos: string
}

export function ChargesList() {
  const [charges, setCharges] = useState<Charge[]>([
    {
      id: "C001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      serviceDate: "2024-01-20",
      description: "Office Visit - Established Patient",
      amount: 150.0,
      status: "Pending",
      provider: "Dr. Smith",
      cptCode: "99213",
      dos: "2024-01-20",
    },
    {
      id: "C002",
      patientName: "Michael Chen",
      patientId: "P002",
      serviceDate: "2024-01-18",
      description: "Lab Work - Complete Blood Count",
      amount: 85.5,
      status: "Billed",
      provider: "Dr. Johnson",
      cptCode: "85025",
      dos: "2024-01-18",
    },
    {
      id: "C003",
      patientName: "Emily Davis",
      patientId: "P003",
      serviceDate: "2024-01-15",
      description: "X-Ray - Chest",
      amount: 250.0,
      status: "Paid",
      provider: "Dr. Williams",
      cptCode: "71046",
      dos: "2024-01-15",
    },
    {
      id: "C004",
      patientName: "James Wilson",
      patientId: "P004",
      serviceDate: "2024-01-10",
      description: "Procedure - Minor Surgery",
      amount: 1200.0,
      status: "Pending",
      provider: "Dr. Brown",
      cptCode: "47562",
      dos: "2024-01-10",
    },
    {
      id: "C005",
      patientName: "Rebecca Martinez",
      patientId: "P005",
      serviceDate: "2024-01-08",
      description: "Consultation - Follow-up",
      amount: 120.0,
      status: "Denied",
      provider: "Dr. Smith",
      cptCode: "99214",
      dos: "2024-01-08",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ChargeStatus | "All">("All")
  const [selectedCharges, setSelectedCharges] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null)
  const [newCharge, setNewCharge] = useState<Partial<Charge>>({
    status: "Pending",
  })

  const filteredCharges = charges.filter((charge) => {
    const matchesSearch =
      charge.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.cptCode.includes(searchTerm)
    const matchesStatus = statusFilter === "All" || charge.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: ChargeStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case "Billed":
        return "bg-blue-100 text-blue-800 border border-blue-300"
      case "Paid":
        return "bg-green-100 text-green-800 border border-green-300"
      case "Denied":
        return "bg-red-100 text-red-800 border border-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddCharge = () => {
    if (editingCharge) {
      setCharges(charges.map((c) => (c.id === editingCharge.id ? { ...editingCharge, ...newCharge } : c)))
      setEditingCharge(null)
    } else {
      const charge: Charge = {
        id: `C${Date.now()}`,
        patientName: (newCharge.patientName || "") as string,
        patientId: (newCharge.patientId || "") as string,
        serviceDate: (newCharge.serviceDate || "") as string,
        description: (newCharge.description || "") as string,
        amount: newCharge.amount || 0,
        status: (newCharge.status as ChargeStatus) || "Pending",
        provider: (newCharge.provider || "") as string,
        cptCode: (newCharge.cptCode || "") as string,
        dos: (newCharge.dos || "") as string,
      }
      setCharges([...charges, charge])
    }
    setNewCharge({ status: "Pending" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteCharge = (id: string) => {
    setCharges(charges.filter((c) => c.id !== id))
    setSelectedCharges(selectedCharges.filter((cId) => cId !== id))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedCharges(checked ? charges.map((c) => c.id) : [])
  }

  const handleSelectCharge = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCharges([...selectedCharges, id])
    } else {
      setSelectedCharges(selectedCharges.filter((cId) => cId !== id))
    }
  }

  const totalAmount = filteredCharges.reduce((sum, charge) => sum + charge.amount, 0)
  const pendingAmount = filteredCharges.filter((c) => c.status === "Pending").reduce((sum, c) => sum + c.amount, 0)
  const paidAmount = filteredCharges.filter((c) => c.status === "Paid").reduce((sum, c) => sum + c.amount, 0)

  const onAddDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open)
  }

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-2">Total Charges</p>
          <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium mb-2">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">${pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium mb-2">Paid</p>
          <p className="text-2xl font-bold text-green-900">${paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-2">Total Records</p>
          <p className="text-2xl font-bold text-gray-900">{filteredCharges.length}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by patient name, description, or CPT code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ChargeStatus | "All")}>
            <SelectTrigger className="w-full md:w-48 bg-gray-100 border-gray-300 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-100 border-gray-300">
              <SelectItem value="All" className="text-gray-900">
                All Status
              </SelectItem>
              <SelectItem value="Pending" className="text-gray-900">
                Pending
              </SelectItem>
              <SelectItem value="Billed" className="text-gray-900">
                Billed
              </SelectItem>
              <SelectItem value="Paid" className="text-gray-900">
                Paid
              </SelectItem>
              <SelectItem value="Denied" className="text-gray-900">
                Denied
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingCharge(null)
              setNewCharge({ status: "Pending" })
              setIsAddDialogOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Charge
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4 bg-transparent"
            style={{ backgroundColor: "#F1F5F9" }}
            title="Export Charges List"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Charges Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto" style={{ border: "1px solid #CBD5E1" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#F1F5F9", borderBottom: "0.5px solid #CBD5E1" }}>
            <tr>
              <th className="px-4 py-3 w-12" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <Checkbox className="h-5 w-5 border-2 border-gray-400/60 rounded opacity-60" />
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">PATIENT</span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">CPT CODE</span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">DESCRIPTION</span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">AMOUNT</span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">STATUS</span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">PROVIDER</span>
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                <span className="text-xs font-semibold text-gray-700">ACTIONS</span>
              </th>
            </tr>
          </thead>
          <tbody style={{ borderBottom: "0.5px solid #CBD5E1" }}>
            {filteredCharges.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No charges found
                </td>
              </tr>
            ) : (
              filteredCharges.map((charge) => (
                <tr
                  key={charge.id}
                  style={{
                    borderBottom: "0.5px solid #CBD5E1",
                    backgroundColor: selectedCharges.includes(charge.id) ? "#F0F4FF" : "white",
                  }}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 w-12" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <Checkbox
                      checked={selectedCharges.includes(charge.id)}
                      onCheckedChange={(checked) => handleSelectCharge(charge.id, !!checked)}
                      className="h-5 w-5 border-2 border-gray-400/60 rounded"
                    />
                  </td>
                  <td className="px-4 py-3" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <Link
                      href={`/patients/${charge.patientId}`}
                      className="font-medium"
                      style={{ color: "rgb(4, 53, 95)" }}
                    >
                      {charge.patientName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-sm" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    {charge.cptCode}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm max-w-xs truncate" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    {charge.description}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-semibold" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    ${charge.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    {charge.status}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    {charge.provider}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCharge(charge)
                          setNewCharge(charge)
                          onAddDialogOpenChange(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-gray-800"
                        aria-label="Edit charge"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCharge(charge.id)}
                        className="p-2 hover:bg-red-100 rounded transition-colors text-red-600 hover:text-red-800"
                        aria-label="Delete charge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const chargeData = `Charge ID: ${charge.id}\nPatient: ${charge.patientName}\nCPT Code: ${charge.cptCode}\nAmount: $${charge.amount.toFixed(2)}\nStatus: ${charge.status}`
                          const element = document.createElement("a")
                          element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(chargeData))
                          element.setAttribute("download", `charge_${charge.id}.txt`)
                          element.style.display = "none"
                          document.body.appendChild(element)
                          element.click()
                          document.body.removeChild(element)
                        }}
                        className="flex items-center gap-1 px-3 py-2 hover:bg-blue-100 rounded transition-colors text-blue-600 hover:text-blue-800"
                        aria-label="Download charge"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Charge Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingCharge ? "Edit Charge" : "Add New Charge"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingCharge ? "Update the charge information" : "Enter the details for the new charge"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-slate-300">
                  Patient Name
                </Label>
                <Input
                  id="patientName"
                  value={(newCharge.patientName as string) || ""}
                  onChange={(e) => setNewCharge({ ...newCharge, patientName: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-slate-300">
                  Patient ID
                </Label>
                <Input
                  id="patientId"
                  value={(newCharge.patientId as string) || ""}
                  onChange={(e) => setNewCharge({ ...newCharge, patientId: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cptCode" className="text-slate-300">
                  CPT Code
                </Label>
                <Input
                  id="cptCode"
                  value={(newCharge.cptCode as string) || ""}
                  onChange={(e) => setNewCharge({ ...newCharge, cptCode: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDate" className="text-slate-300">
                  Service Date
                </Label>
                <Input
                  id="serviceDate"
                  type="date"
                  value={(newCharge.serviceDate as string) || ""}
                  onChange={(e) => setNewCharge({ ...newCharge, serviceDate: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">
                Description
              </Label>
              <Input
                id="description"
                value={(newCharge.description as string) || ""}
                onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-300">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newCharge.amount || ""}
                  onChange={(e) => setNewCharge({ ...newCharge, amount: parseFloat(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-300">
                  Status
                </Label>
                <Select
                  value={(newCharge.status as string) || "Pending"}
                  onValueChange={(value) => setNewCharge({ ...newCharge, status: value as ChargeStatus })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Pending" className="text-white">
                      Pending
                    </SelectItem>
                    <SelectItem value="Billed" className="text-white">
                      Billed
                    </SelectItem>
                    <SelectItem value="Paid" className="text-white">
                      Paid
                    </SelectItem>
                    <SelectItem value="Denied" className="text-white">
                      Denied
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider" className="text-slate-300">
                Provider
              </Label>
              <Input
                id="provider"
                value={(newCharge.provider as string) || ""}
                onChange={(e) => setNewCharge({ ...newCharge, provider: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button onClick={handleAddCharge} className="bg-blue-600 hover:bg-blue-700">
              {editingCharge ? "Update" : "Add"} Charge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
