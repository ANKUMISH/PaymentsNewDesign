"use client";

import { useEffect } from "react";

import { useRef } from "react";

import { DialogFooter } from "@/components/ui/dialog";

import { useState } from "react";
import {
  Plus,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to format date to MM/DD/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return dateString;
  }
};
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type VisitStatus = "Completed" | "Scheduled" | "Cancelled" | "No-show";

interface Visit {
  id: string;
  patientName: string;
  patientId: string;
  patientDOB: string;
  visitType: string;
  provider: string;
  status: VisitStatus;
  charges: number;
  balance: number;
  primaryInsurance: string;
  placeOfService?: string;
  notes?: string;
  dos?: string;
  dxCodes?: string[];
  referringProvider?: string;
  renderingProvider?: string;
  lineItems?: any[];
}

export function VisitsList() {
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
    {
      id: "V001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      patientDOB: "1985-05-15",
      visitType: "Consultation",
      provider: "Dr. Smith",
      status: "Completed",
      charges: 150.0,
      balance: 0.0,
      primaryInsurance: "Blue Cross",
      placeOfService: "Office",
    },
    {
      id: "V002",
      patientName: "John Doe",
      patientId: "P002",
      patientDOB: "1990-08-22",
      visitType: "Consultation",
      provider: "Dr. Johnson",
      status: "Scheduled",
      charges: 200.0,
      balance: 50.0,
      primaryInsurance: "Aetna",
      placeOfService: "Telehealth",
    },
    {
      id: "V003",
      patientName: "Emily Martinez",
      patientId: "P003",
      patientDOB: "1988-03-10",
      visitType: "Initial Eval",
      provider: "Dr. Williams",
      status: "Completed",
      charges: 100.0,
      balance: 0.0,
      primaryInsurance: "UnitedHealth",
      placeOfService: "Telehealth",
    },
    {
      id: "V004",
      patientName: "Michael Brown",
      patientId: "P004",
      patientDOB: "1992-11-30",
      visitType: "Initial Eval",
      provider: "Dr. Smith",
      status: "Cancelled",
      charges: 0.0,
      balance: 0.0,
      primaryInsurance: "Cigna",
      placeOfService: "Telehealth",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitStatus | "All">("All");
  const [visitTypeFilter, setVisitTypeFilter] = useState("");
  const [patientNameFilter, setPatientNameFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedVisits, setSelectedVisits] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [newVisit, setNewVisit] = useState<Partial<Visit>>({});
  const [providerSearchTerm, setProviderSearchTerm] = useState("");
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [chargeEntry, setChargeEntry] = useState({
    patientName: "",
    dos: "",
    pos: "",
    insuranceName: "",
    dxCode: "",
    dxCodes: [""],
    referringProvider: "",
    renderingProvider: "",
    lineItems: [
      {
        cpt: "",
        modifiers: [] as string[],
        units: "1",
        unitCharge: "",
        totalCharge: "",
      },
    ],
  });
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredVisits = visits.filter((visit) => {
    const matchesPatientName = (visit.patientName || "")
      .toLowerCase()
      .includes(patientNameFilter.toLowerCase());
    const matchesVisitType = (visit.visitType || "")
      .toLowerCase()
      .includes(visitTypeFilter.toLowerCase());
    const matchesProvider = (visit.provider || "")
      .toLowerCase()
      .includes(providerFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || visit.status === statusFilter;
    return (
      matchesPatientName && matchesVisitType && matchesProvider && matchesStatus
    );
  });

  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVisits = filteredVisits.slice(startIndex, endIndex);

  // Get unique providers from visits
  const uniqueProviders = Array.from(
    new Set(visits.map((v) => v.provider)),
  ).sort();

  // Filter providers based on search term
  const filteredProviders = uniqueProviders.filter((provider) =>
    (provider || "").toLowerCase().includes(providerSearchTerm.toLowerCase()),
  );

  const handleSelectVisit = (visitId: string, checked: boolean) => {
    if (checked) {
      setSelectedVisits([...selectedVisits, visitId]);
    } else {
      setSelectedVisits(selectedVisits.filter((id) => id !== visitId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVisits(filteredVisits.map((v) => v.id));
    } else {
      setSelectedVisits([]);
    }
  };

  const handleDeleteVisit = (visitId: string) => {
    setVisits(visits.filter((v) => v.id !== visitId));
    setSelectedVisits(selectedVisits.filter((id) => id !== visitId));
  };

  const handleSaveVisit = () => {
    if (editingVisit) {
      setVisits(
        visits.map((v) =>
          v.id === editingVisit.id ? { ...editingVisit, ...newVisit } : v,
        ),
      );
    } else {
      const visit: Visit = {
        id: `V${Math.floor(Math.random() * 10000)}`,
        patientName: newVisit.patientName || "",
        patientId: `P${Math.floor(Math.random() * 1000)}`,
        patientDOB: newVisit.patientDOB || "",
        visitType: newVisit.visitType || "",
        provider: newVisit.provider || "",
        status: (newVisit.status as VisitStatus) || "Scheduled",
        charges: newVisit.charges || 0,
        balance: newVisit.balance || 0,
        primaryInsurance: newVisit.primaryInsurance || "",
        notes: newVisit.notes,
        dos: newVisit.dos,
      };
      setVisits([...visits, visit]);
    }
    setIsAddDialogOpen(false);
    setNewVisit({});
    setEditingVisit(null);
  };

  return (
    <div className="space-y-6">
      {/* Title and Controls */}
      <div className="flex items-center justify-between gap-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
          Visits List
        </h2>
        {/* Controls */}
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            className="h-10 px-4 bg-transparent flex items-center gap-2"
            style={{ backgroundColor: "#F1F5F9" }}
            title="Export Visits List"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>

          <Button
            onClick={() => {
              setIsChargeDialogOpen(true);
            }}
            className="h-10 shadow-lg hover:shadow-xl transition-all text-white font-semibold px-6 hover:opacity-90"
            style={{ backgroundColor: "#FF8F5C" }}
          >
            <Plus className="w-4 h-4 mr-2" />
            ChargeEntry
          </Button>
        </div>
      </div>

      {/* Visits Table */}
      <div
        className="bg-white rounded-lg shadow-md overflow-x-auto"
        style={{ border: "1px solid #CBD5E1" }}
      >
        <table className="w-full">
          <thead
            style={{
              backgroundColor: "#F1F5F9",
              borderBottom: "0.5px solid #CBD5E1",
            }}
          >
            <tr>
              <th
                className="px-4 py-3 w-12"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <Checkbox className="h-5 w-5 border-2 border-gray-400/60 rounded opacity-60" />
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <span className="text-xs font-semibold text-gray-700">
                  VISIT ID
                </span>
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">
                    PATIENT NAME
                  </span>
                  <button
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "patientName" ? null : "patientName",
                      )
                    }
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "patientName" && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                      <Input
                        placeholder="Search patient name..."
                        value={patientNameFilter}
                        onChange={(e) => {
                          setPatientNameFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <span className="text-xs font-semibold text-gray-700">DOS</span>
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">
                    PROVIDER
                  </span>
                  <button
                    onClick={() =>
                      setOpenFilter(
                        openFilter === "provider" ? null : "provider",
                      )
                    }
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "provider" && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                      <Input
                        placeholder="Search provider..."
                        value={providerFilter}
                        onChange={(e) => {
                          setProviderFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">
                    STATUS
                  </span>
                  <button
                    onClick={() =>
                      setOpenFilter(openFilter === "status" ? null : "status")
                    }
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "status" && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {[
                        "All",
                        "Completed",
                        "Scheduled",
                        "Cancelled",
                        "No-show",
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setStatusFilter(option as VisitStatus | "All");
                            setOpenFilter(null);
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <span className="text-xs font-semibold text-gray-700">
                  CHARGES
                </span>
              </th>
              <th
                className="px-4 py-3 text-left whitespace-nowrap"
                style={{ borderRight: "0.5px solid #CBD5E1" }}
              >
                <span className="text-xs font-semibold text-gray-700">
                  PRIMARY INSURANCE
                </span>
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                <span className="text-xs font-semibold text-gray-700">
                  ACTIONS
                </span>
              </th>
            </tr>
          </thead>
          <tbody style={{ borderBottom: "0.5px solid #CBD5E1" }}>
            {paginatedVisits.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No visits found
                </td>
              </tr>
            ) : (
              paginatedVisits.map((visit) => (
                <tr
                  key={visit.id}
                  style={{
                    borderBottom: "0.5px solid #CBD5E1",
                    backgroundColor: selectedVisits.includes(visit.id)
                      ? "#F0F4FF"
                      : "white",
                  }}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td
                    className="px-4 py-1 w-12"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    <Checkbox
                      checked={selectedVisits.includes(visit.id)}
                      onCheckedChange={(checked) =>
                        handleSelectVisit(visit.id, !!checked)
                      }
                      className="h-5 w-5 border-2 border-gray-400/60 rounded"
                    />
                  </td>
                  <td
                    className="px-4 py-1 text-gray-700 font-semibold text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    {visit.id}
                  </td>
                  <td
                    className="px-4 py-1 text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    <Link
                      href={`/patients/${visit.patientId}`}
                      className="font-semibold"
                      style={{ color: "rgb(4, 53, 95)" }}
                    >
                      {visit.patientName}
                    </Link>
                  </td>
                  <td
                    className="px-4 py-1 text-gray-600 text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    {formatDate(visit.dos || "")}
                  </td>
                  <td
                    className="px-4 py-1 text-gray-600 text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    {visit.provider}
                  </td>
                  <td
                    className="px-4 py-1 text-gray-600 text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    {visit.status}
                  </td>
                  <td
                    className="px-4 py-1 text-gray-700 font-semibold text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    ${visit.charges.toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-1 text-gray-600 text-xs"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    {visit.primaryInsurance}
                  </td>
                  <td className="px-4 py-1 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditingVisit(visit);
                          setNewVisit({
                            ...visit,
                            dxCodes: visit.dxCodes || [],
                            lineItems: (visit.lineItems as any) || [],
                          });
                          setIsAddDialogOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-gray-800"
                        aria-label="Edit visit"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVisit(visit.id)}
                        className="p-1 rounded transition-colors hover:opacity-80"
                        style={{ color: "rgb(4, 53, 95)" }}
                        aria-label="Delete visit"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <label
            htmlFor="itemsPerPage"
            className="text-xs font-medium text-gray-600"
          >
            Visits per page:
          </label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-24 h-8 text-xs bg-gray-100 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-100 border-gray-300">
              <SelectItem value="20" className="text-xs">
                20
              </SelectItem>
              <SelectItem value="50" className="text-xs">
                50
              </SelectItem>
              <SelectItem value="100" className="text-xs">
                100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredVisits.length)} of {filteredVisits.length}{" "}
          visits
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 px-3"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="h-8 w-8 p-0"
                style={
                  currentPage === page
                    ? { backgroundColor: "#FF8F5C", borderColor: "#FF8F5C" }
                    : {}
                }
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="h-8 px-3"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add/Edit Visit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVisit ? `Visit ID: ${editingVisit.id}` : "Add New Visit"}
            </DialogTitle>
            {!editingVisit && (
              <DialogDescription>
                Fill in the visit details below to add a new visit.
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Patient Information Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Patient name"
                    value={newVisit.patientName || ""}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, patientName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientDOB">Patient DOB</Label>
                  <Input
                    id="patientDOB"
                    type="date"
                    value={newVisit.patientDOB || ""}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, patientDOB: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Visit Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newVisit.status || "Scheduled"}
                    onValueChange={(value) =>
                      setNewVisit({ ...newVisit, status: value as VisitStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="No-show">No-show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeOfService">Place of Service</Label>
                  <Select
                    value={newVisit.placeOfService || ""}
                    onValueChange={(value) => {
                      setNewVisit({ ...newVisit, placeOfService: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select place of service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Urgent Care">Urgent Care</SelectItem>
                      <SelectItem value="Telehealth">Telehealth</SelectItem>
                      <SelectItem value="Patient Home">Patient Home</SelectItem>
                      <SelectItem value="Ambulatory Surgery Center">
                        Ambulatory Surgery Center
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Provider Information Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referringProvider">Referring Provider</Label>
                  <Input
                    id="referringProvider"
                    placeholder="Provider name"
                    value={newVisit.referringProvider || ""}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        referringProvider: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="renderingProvider">Rendering Provider</Label>
                  <Input
                    id="renderingProvider"
                    placeholder=""
                    value={newVisit.renderingProvider || ""}
                    onChange={(e) => {
                      setNewVisit({
                        ...newVisit,
                        renderingProvider: e.target.value,
                      });
                      setProviderSearchTerm(e.target.value);
                      setShowProviderDropdown(true);
                    }}
                    onFocus={() => setShowProviderDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowProviderDropdown(false), 200)
                    }
                  />
                  {showProviderDropdown && filteredProviders.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredProviders.map((provider) => (
                        <div
                          key={provider}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setNewVisit({
                              ...newVisit,
                              renderingProvider: provider,
                            });
                            setProviderSearchTerm(provider);
                            setShowProviderDropdown(false);
                          }}
                        >
                          {provider}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Billing & Diagnoses Section */}
            <div className="space-y-4">
              {/* Billing fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dos">Date of Service</Label>
                  <Input
                    id="dos"
                    type="date"
                    value={newVisit.dos || ""}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, dos: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeOfService">Place of Service</Label>
                  <Select
                    value={newVisit.placeOfService || ""}
                    onValueChange={(value) =>
                      setNewVisit({ ...newVisit, placeOfService: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select place of service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Urgent Care">Urgent Care</SelectItem>
                      <SelectItem value="Telehealth">Telehealth</SelectItem>
                      <SelectItem value="Patient Home">Patient Home</SelectItem>
                      <SelectItem value="Ambulatory Surgery Center">
                        Ambulatory Surgery Center
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DX Codes */}
              <div className="mt-4">
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                  DX Codes
                </Label>
                {!newVisit.dxCodes || newVisit.dxCodes.length === 0 ? (
                  <div className="text-xs text-gray-500 mb-2">
                    No DX codes added yet
                  </div>
                ) : null}
                <div className="flex flex-row gap-0.5 flex-wrap w-fit">
                  {(newVisit.dxCodes || []).map((code, idx) => (
                    <div key={idx} className="p-1 flex items-center gap-1">
                      <Select
                        value={code || "none"}
                        onValueChange={(value) => {
                          const newDxCodes = [...(newVisit.dxCodes || [])];
                          newDxCodes[idx] = value === "none" ? "" : value;
                          setNewVisit({ ...newVisit, dxCodes: newDxCodes });
                        }}
                      >
                        <SelectTrigger id={`dxCode-${idx}`} className="h-10">
                          <SelectValue placeholder={`DX ${idx + 1}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="E11">
                            E11 - Type 2 Diabetes
                          </SelectItem>
                          <SelectItem value="I10">
                            I10 - Essential Hypertension
                          </SelectItem>
                          <SelectItem value="J45">J45 - Asthma</SelectItem>
                          <SelectItem value="M79.3">
                            M79.3 - Panniculitis
                          </SelectItem>
                          <SelectItem value="Z00.00">
                            Z00.00 - Encounter for General Adult Medical Exam
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {(newVisit.dxCodes?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newDxCodes = (newVisit.dxCodes || []).filter(
                              (_, i) => i !== idx,
                            );
                            setNewVisit({ ...newVisit, dxCodes: newDxCodes });
                          }}
                          className="text-red-500 hover:text-red-700 text-lg leading-none flex-shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewVisit({
                      ...newVisit,
                      dxCodes: [...(newVisit.dxCodes || []), ""],
                    });
                  }}
                  className="text-xs mt-2 px-2 py-1 text-white rounded hover:opacity-90"
                  style={{ backgroundColor: "#FF8F5C" }}
                >
                  + Add DX
                </button>
              </div>

              {/* Line Items Table */}
              <div className="mt-4 overflow-x-auto">
                {!newVisit.lineItems ||
                (newVisit.lineItems as any).length === 0 ? (
                  <div className="text-xs text-gray-500 mb-2">
                    No line items added yet. Click "+ Add Line Item" to get
                    started.
                  </div>
                ) : null}
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        CPT
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Mod 1
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Mod 2
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Units
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Unit Charge
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Total Charges
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {((newVisit.lineItems as any) || []).map(
                      (item: any, idx: number) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2">
                            <Select
                              value={item?.cpt || ""}
                              onValueChange={(value) => {
                                const newItems = [
                                  ...((newVisit.lineItems as any) || []),
                                ];
                                if (!newItems[idx]) newItems[idx] = {};
                                newItems[idx].cpt = value;
                                setNewVisit({
                                  ...newVisit,
                                  lineItems: newItems,
                                });
                              }}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select CPT" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="99213">99213</SelectItem>
                                <SelectItem value="99214">99214</SelectItem>
                                <SelectItem value="99215">99215</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-1 py-2 w-16">
                            <Input
                              type="text"
                              placeholder="-"
                              value={item?.modifier1 || ""}
                              onChange={(e) => {
                                const newItems = [
                                  ...((newVisit.lineItems as any) || []),
                                ];
                                if (!newItems[idx]) newItems[idx] = {};
                                newItems[idx].modifier1 = e.target.value;
                                setNewVisit({
                                  ...newVisit,
                                  lineItems: newItems,
                                });
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-1 py-2 w-16">
                            <Input
                              type="text"
                              placeholder="-"
                              value={item?.modifier2 || ""}
                              onChange={(e) => {
                                const newItems = [
                                  ...((newVisit.lineItems as any) || []),
                                ];
                                if (!newItems[idx]) newItems[idx] = {};
                                newItems[idx].modifier2 = e.target.value;
                                setNewVisit({
                                  ...newVisit,
                                  lineItems: newItems,
                                });
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              placeholder="0"
                              value={item?.units || ""}
                              onChange={(e) => {
                                const newItems = [
                                  ...((newVisit.lineItems as any) || []),
                                ];
                                if (!newItems[idx]) newItems[idx] = {};
                                newItems[idx].units = parseFloat(
                                  e.target.value,
                                );
                                setNewVisit({
                                  ...newVisit,
                                  lineItems: newItems,
                                });
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={item?.unitCharge || ""}
                              onChange={(e) => {
                                const newItems = [
                                  ...((newVisit.lineItems as any) || []),
                                ];
                                if (!newItems[idx]) newItems[idx] = {};
                                newItems[idx].unitCharge = parseFloat(
                                  e.target.value,
                                );
                                setNewVisit({
                                  ...newVisit,
                                  lineItems: newItems,
                                });
                              }}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 font-semibold text-sm">
                            $
                            {(
                              (item?.units || 0) * (item?.unitCharge || 0)
                            ).toFixed(2)}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (
                                  (newVisit.lineItems as any) || []
                                ).filter((_: any, i: number) => i !== idx);
                                setNewVisit({
                                  ...newVisit,
                                  lineItems: newItems,
                                });
                              }}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={() => {
                    setNewVisit({
                      ...newVisit,
                      lineItems: [...((newVisit.lineItems as any) || []), {}],
                    });
                  }}
                  className="text-xs mt-2 px-2 py-1 text-white rounded hover:opacity-90"
                  style={{ backgroundColor: "#FF8F5C" }}
                >
                  + Add Line Item
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVisit}
              style={{ backgroundColor: "#FF8F5C" }}
              className="text-white"
            >
              {editingVisit ? "Update Visit" : "Add Visit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Charge Entry Dialog */}
      <Dialog open={isChargeDialogOpen} onOpenChange={setIsChargeDialogOpen}>
        <DialogContent className="!w-1/2 !max-w-none max-h-[90vh] overflow-y-auto">
          <div className="py-6 px-8">
            <DialogHeader className="mb-6">
              <DialogTitle>ChargeEntry</DialogTitle>
              <DialogDescription>
                Enter complete charge details for medical billing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              {/* Patient Information Card */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="space-y-2">
                  {/* Row 1: Patient Name and Insurance Name */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Patient Name with Search */}
                    <div className="space-y-1 relative">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <div className="relative">
                        <Input
                          id="patientName"
                          placeholder="Search patient..."
                          value={patientSearchTerm}
                          onChange={(e) => {
                            setPatientSearchTerm(e.target.value);
                            setShowPatientDropdown(true);
                          }}
                          onFocus={() => setShowPatientDropdown(true)}
                          className="pl-10 h-8"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {showPatientDropdown && patientSearchTerm && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            {visits
                              .filter((v) =>
                                (v.patientName || "")
                                  .toLowerCase()
                                  .includes(patientSearchTerm.toLowerCase()),
                              )
                              .slice(0, 5)
                              .map((visit) => (
                                <div
                                  key={visit.patientId}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setChargeEntry({
                                      ...chargeEntry,
                                      patientName: visit.patientName,
                                      insuranceName: "Blue Cross",
                                    });
                                    setPatientSearchTerm(visit.patientName);
                                    setShowPatientDropdown(false);
                                  }}
                                >
                                  <div className="font-medium">
                                    {visit.patientName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    DOB: {formatDate(visit.patientDOB)}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Insurance Name - Auto-generated */}
                    <div className="space-y-1">
                      <Label htmlFor="insuranceName">Insurance Name *</Label>
                      <Input
                        id="insuranceName"
                        value={chargeEntry.insuranceName}
                        readOnly
                        className="bg-white text-gray-700 cursor-not-allowed h-8 border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Provider Information Card */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Provider Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-0.5 col-span-1">
                    <Label htmlFor="referringProvider">
                      Referring Provider
                    </Label>
                    <Input
                      id="referringProvider"
                      placeholder=""
                      value={chargeEntry.referringProvider}
                      onChange={(e) =>
                        setChargeEntry({
                          ...chargeEntry,
                          referringProvider: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* Rendering Provider */}
                  <div className="space-y-0.5 col-span-1 relative">
                    <Label htmlFor="renderingProvider">
                      Rendering Provider *
                    </Label>
                    <Input
                      id="renderingProvider"
                      placeholder=""
                      value={chargeEntry.renderingProvider}
                      onChange={(e) => {
                        setChargeEntry({
                          ...chargeEntry,
                          renderingProvider: e.target.value,
                        });
                        setProviderSearchTerm(e.target.value);
                        setShowProviderDropdown(true);
                      }}
                      onFocus={() => setShowProviderDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowProviderDropdown(false), 200)
                      }
                    />
                    {showProviderDropdown && filteredProviders.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredProviders.map((provider) => (
                          <div
                            key={provider}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setChargeEntry({
                                ...chargeEntry,
                                renderingProvider: provider,
                              });
                              setProviderSearchTerm(provider);
                              setShowProviderDropdown(false);
                            }}
                          >
                            {provider}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Service & Billing Information Card */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Service & Billing Information
                </h3>
                {/* Date of Service, Place of Service, and Diagnosis Code Fields */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="dos">Date of Service *</Label>
                    <Input
                      id="dos"
                      type="date"
                      value={chargeEntry.dos}
                      onChange={(e) =>
                        setChargeEntry({ ...chargeEntry, dos: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pos">Place of Service *</Label>
                    <Select
                      value={chargeEntry.pos}
                      onValueChange={(value) =>
                        setChargeEntry({ ...chargeEntry, pos: value })
                      }
                    >
                      <SelectTrigger id="pos">
                        <SelectValue placeholder="Select Place of Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11">Office</SelectItem>
                        <SelectItem value="12">Patient's Home</SelectItem>
                        <SelectItem value="21">Inpatient Hospital</SelectItem>
                        <SelectItem value="22">Outpatient Hospital</SelectItem>
                        <SelectItem value="24">
                          Ambulatory Surgical Center
                        </SelectItem>
                        <SelectItem value="25">Birthing Center</SelectItem>
                        <SelectItem value="26">Military Facility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Diagnosis Codes (DX) Table - Dynamic with Add Button */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                    DX Codes *
                  </Label>
                  <div className="flex flex-row gap-0.5 flex-wrap w-fit">
                    {chargeEntry.dxCodes.map((_, idx) => (
                      <div key={idx} className="p-1 flex items-center gap-1">
                        <Select
                          value={chargeEntry.dxCodes[idx] || ""}
                          onValueChange={(value) => {
                            const newDxCodes = [...chargeEntry.dxCodes];
                            newDxCodes[idx] = value;
                            setChargeEntry({
                              ...chargeEntry,
                              dxCodes: newDxCodes,
                            });
                          }}
                        >
                          <SelectTrigger id={`dxCode-${idx}`} className="h-10">
                            <SelectValue placeholder={`DX ${idx + 1}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E11">
                              E11 - Type 2 Diabetes
                            </SelectItem>
                            <SelectItem value="I10">
                              I10 - Essential Hypertension
                            </SelectItem>
                            <SelectItem value="J45">J45 - Asthma</SelectItem>
                            <SelectItem value="M79.3">
                              M79.3 - Panniculitis
                            </SelectItem>
                            <SelectItem value="Z00.00">
                              Z00.00 - Encounter for General Adult Medical Exam
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {chargeEntry.dxCodes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newDxCodes = chargeEntry.dxCodes.filter(
                                (_, i) => i !== idx,
                              );
                              setChargeEntry({
                                ...chargeEntry,
                                dxCodes: newDxCodes,
                              });
                            }}
                            className="text-red-500 hover:text-red-700 text-lg leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setChargeEntry({
                        ...chargeEntry,
                        dxCodes: [...chargeEntry.dxCodes, ""],
                      });
                    }}
                    className="text-xs mt-2 px-2 py-1 text-white rounded hover:opacity-90"
                    style={{ backgroundColor: "#FF8F5C" }}
                  >
                    + Add DX
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          CPT *
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          Mod 1
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          Mod 2
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          Mod 3
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          Mod 4
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          Units *
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          Unit Charge *
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          Total Charges *
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {chargeEntry.lineItems.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 hover:bg-white transition-colors"
                        >
                          <td className="px-3 py-3">
                            <Select
                              value={item.cpt || "99213"}
                              onValueChange={(value) => {
                                const newItems = [...chargeEntry.lineItems];
                                newItems[idx].cpt = value;
                                setChargeEntry({
                                  ...chargeEntry,
                                  lineItems: newItems,
                                });
                              }}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select CPT" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="99213">99213</SelectItem>
                                <SelectItem value="99214">99214</SelectItem>
                                <SelectItem value="99215">99215</SelectItem>
                                <SelectItem value="99203">99203</SelectItem>
                                <SelectItem value="99204">99204</SelectItem>
                                <SelectItem value="99205">99205</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          {[0, 1, 2, 3].map((modIdx) => (
                            <td key={modIdx} className="px-1 py-2 w-16">
                              <Select
                                value={item.modifiers[modIdx] || "none"}
                                onValueChange={(value) => {
                                  const newItems = [...chargeEntry.lineItems];
                                  const newModifiers = [...item.modifiers];
                                  if (value !== "none") {
                                    newModifiers[modIdx] = value;
                                  } else {
                                    newModifiers.splice(modIdx, 1);
                                  }
                                  newItems[idx].modifiers = newModifiers;
                                  setChargeEntry({
                                    ...chargeEntry,
                                    lineItems: newItems,
                                  });
                                }}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="25">25</SelectItem>
                                  <SelectItem value="59">59</SelectItem>
                                  <SelectItem value="76">76</SelectItem>
                                  <SelectItem value="77">77</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          ))}
                          <td className="px-3 py-3 min-w-24">
                            <Input
                              type="number"
                              min="1"
                              placeholder="1"
                              value={item.units}
                              onChange={(e) => {
                                const newItems = [...chargeEntry.lineItems];
                                newItems[idx].units = e.target.value;
                                // Auto-calculate total charge when units change
                                const units = parseFloat(e.target.value) || 0;
                                const unitCharge =
                                  parseFloat(newItems[idx].unitCharge) || 0;
                                newItems[idx].totalCharge = (
                                  units * unitCharge
                                ).toFixed(2);
                                setChargeEntry({
                                  ...chargeEntry,
                                  lineItems: newItems,
                                });
                              }}
                              className="h-8 text-xs w-full bg-white border border-gray-300 [&::placeholder]:text-gray-500 text-sm"
                              style={{ color: "#000", fontSize: "0.75rem" }}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={item.unitCharge}
                              onChange={(e) => {
                                const newItems = [...chargeEntry.lineItems];
                                newItems[idx].unitCharge = e.target.value;
                                // Auto-calculate total charge
                                const units =
                                  parseFloat(newItems[idx].units) || 0;
                                const unitCharge =
                                  parseFloat(e.target.value) || 0;
                                newItems[idx].totalCharge = (
                                  units * unitCharge
                                ).toFixed(2);
                                setChargeEntry({
                                  ...chargeEntry,
                                  lineItems: newItems,
                                });
                              }}
                              className="h-8 text-xs w-full bg-white border border-gray-300 [&::placeholder]:text-gray-500"
                              style={{ color: "#000", fontSize: "0.75rem" }}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={item.totalCharge}
                              readOnly
                              className="h-8 text-xs w-full bg-white border border-gray-300 [&::placeholder]:text-gray-500"
                              style={{ color: "#000", fontSize: "0.75rem" }}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => {
                                const newItems = chargeEntry.lineItems.filter(
                                  (_, i) => i !== idx,
                                );
                                setChargeEntry({
                                  ...chargeEntry,
                                  lineItems: newItems,
                                });
                              }}
                              className="text-center flex justify-center items-center w-full h-full hover:opacity-80 transition-opacity"
                              title="Delete line item"
                            >
                              <TrashIcon
                                className="h-4 w-4"
                                style={{ color: "rgb(4, 53, 95)" }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button
                  onClick={() => {
                    setChargeEntry({
                      ...chargeEntry,
                      lineItems: [
                        ...chargeEntry.lineItems,
                        {
                          cpt: "99213",
                          modifiers: [],
                          units: "1",
                          unitCharge: "",
                          totalCharge: "",
                        },
                      ],
                    });
                  }}
                  className="mt-4 text-xs h-8 px-3"
                  style={{ backgroundColor: "#FF8F5C", color: "white" }}
                >
                  + Add Line Item
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="justify-center gap-2 ml-32">
            <Button
              variant="outline"
              onClick={() => {
                setIsChargeDialogOpen(false);
                setPatientSearchTerm("");
                setShowPatientDropdown(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("[v0] Charge entry submitted:", chargeEntry);
                setIsChargeDialogOpen(false);
                setChargeEntry({
                  patientName: "",
                  dos: "",
                  pos: "",
                  insuranceName: "Blue Cross",
                  dxCode: "E11",
                  referringProvider: "",
                  renderingProvider: "",
                  lineItems: [{ cpt: "99213", modifiers: [], units: "1" }],
                });
                setPatientSearchTerm("");
                setShowPatientDropdown(false);
              }}
              style={{ backgroundColor: "#FF8F5C" }}
              className="text-white"
            >
              Add Charge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
