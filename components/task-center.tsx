"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

import { DialogFooter } from "@/components/ui/dialog"
import { DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  Paperclip,
  Trash2,
  Download,
  Printer,
  ChevronsUpDown,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

type Priority = "high" | "medium" | "low"
type Status = "todo" | "in-progress" | "review" | "completed"

interface Remark {
  id: number
  sender: string
  content: string
  timestamp: string
  attachment?: string
  isNew?: boolean
}

interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  assignedTo: string[]
  startDate: string
  remarks: Remark[] // Renamed messages to remarks
  attachments: string[]
}

const CustomMessageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Rectangle bubble */}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="8" cy="10" r="0.8" fill="currentColor" />
    <circle cx="12" cy="10" r="0.8" fill="currentColor" />
    <circle cx="16" cy="10" r="0.8" fill="currentColor" />
  </svg>
)

export function TaskCenter() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review Patient Files",
      description: "Complete review of patient files for Q1",
      priority: "high",
      status: "in-progress",
      assignedTo: ["John", "Sarah"],
      startDate: "2024-01-15",
      remarks: [
        {
          id: 1,
          sender: "John Doe",
          content: "Please prioritize this task",
          timestamp: "2024-01-20 10:30 AM",
          isNew: true,
        },
        {
          id: 2,
          sender: "Sarah Miller",
          content: "Working on it now",
          timestamp: "2024-01-20 11:00 AM",
        },
      ],
      attachments: ["patient_report.pdf", "medical_history.xlsx", "lab_results.docx"],
    },
    {
      id: "2",
      title: "Update Medical Records",
      description: "Update patient medical records in the system",
      priority: "medium",
      status: "todo",
      assignedTo: ["Sarah"],
      startDate: "2024-01-18",
      remarks: [
        {
          id: 1,
          sender: "Admin",
          content: "Please complete by end of week",
          timestamp: "2024-01-19 09:00 AM",
        },
      ],
      attachments: [],
    },
    {
      id: "3",
      title: "Schedule Appointments",
      description: "Schedule follow-up appointments for patients",
      priority: "low",
      status: "completed",
      assignedTo: ["Lisa"],
      startDate: "2024-01-10",
      remarks: [], // Renamed messages to remarks
      attachments: [],
    },
    {
      id: "4",
      title: "Prepare Reports",
      description: "Prepare monthly reports for administration",
      priority: "high",
      status: "review",
      assignedTo: ["John", "Lisa"],
      startDate: "2024-01-20",
      remarks: [
        {
          id: 1,
          sender: "Lisa Martinez",
          content: "Reports are ready for review",
          timestamp: "2024-01-21 02:00 PM",
        },
      ],
      attachments: [],
    },
  ])

  const [filterTitle, setFilterTitle] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [sortStartDate, setSortStartDate] = useState<"asc" | "desc" | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false)
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false)
  const [selectedTaskRemarks, setSelectedTaskRemarks] = useState<Remark[]>([])
  const [selectedTaskIdForRemarks, setSelectedTaskIdForRemarks] = useState<string>("")
  const [replyText, setReplyText] = useState("")
  const [replyAttachment, setReplyAttachment] = useState<File | null>(null)
  // Renamed newMessage to newRemark
  const [newRemark, setNewRemark] = useState("")
  // Renamed messageAttachment to remarkAttachment
  const [remarkAttachment, setRemarkAttachment] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedTaskAttachments, setSelectedTaskAttachments] = useState<{
    taskId: string
    attachments: string[]
  } | null>(null)

  const [viewingTask, setViewingTask] = useState<Task | null>(null)
  const [addingAttachmentTaskId, setAddingAttachmentTaskId] = useState<string | null>(null)
  const [bulkActionsDialogOpen, setBulkActionsDialogOpen] = useState(false)

  useEffect(() => {
    if (viewingTask) {
      const updatedTask = tasks.find((t) => t.id === viewingTask.id)
      if (updatedTask) {
        setViewingTask(updatedTask)
      }
    }
  }, [tasks])

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    setDeletingTaskId(null)
  }

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedTasks.size === sortedTasks.length && selectedTasks.size > 0) {
      // All selected, so deselect all
      setSelectedTasks(new Set())
    } else {
      // Select all (works whether none, some, or all are currently selected)
      const newSelected = new Set<string>()
      sortedTasks.forEach((task) => newSelected.add(task.id))
      setSelectedTasks(newSelected)
    }
  }

  const handleBulkDelete = () => {
    setTasks(tasks.filter((task) => !selectedTasks.has(task.id)))
    setSelectedTasks(new Set())
    setBulkActionsDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    setTasks(tasks.filter((task) => !selectedTasks.has(task.id)))
    setSelectedTasks(new Set())
    setDeleteConfirmDialogOpen(false)
  }

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName)
  }

  const filteredTasks = tasks.filter((task) => {
    const titleMatch = (task.title || "").toLowerCase().includes(filterTitle.toLowerCase())
    const statusMatch = filterStatus === "all" || task.status === filterStatus
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority
    const assigneeMatch = filterAssignee === "all" || (task.assignedTo || "").includes(filterAssignee)
    return titleMatch && statusMatch && priorityMatch && assigneeMatch
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortStartDate === "asc") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    } else if (sortStartDate === "desc") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }
    return 0
  })

  const handleCreateTask = (newTask: Task) => {
    setTasks([...tasks, newTask])
    setIsCreateDialogOpen(false)
  }

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  // Renamed handleSendMessage to handleSendRemark
  const handleSendRemark = () => {
    if (newRemark.trim() || remarkAttachment) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskIdForRemarks) {
          const newRemarkObj: Remark = {
            // Use task.remarks.length + 1 as a simple way to generate unique IDs for new remarks.
            // In a real-world application, a more robust ID generation strategy (like UUIDs) might be preferred.
            id: task.remarks.length > 0 ? Math.max(...task.remarks.map((r) => r.id)) + 1 : 1,
            sender: "Current User",
            content: newRemark,
            timestamp: new Date().toLocaleString(),
            attachment: remarkAttachment?.name,
            isNew: true, // Mark new remarks as true
          }
          return { ...task, remarks: [...task.remarks, newRemarkObj] }
        }
        return task
      })
      setTasks(updatedTasks)
      setNewRemark("")
      setRemarkAttachment(null)
    }
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReplyAttachment(e.target.files[0])
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "rgb(4, 53, 95)" }}>
            Task Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="h-8 shadow-lg hover:shadow-xl transition-all text-white font-semibold px-6 hover:opacity-90"
            style={{
              backgroundColor: "#FF8F5C",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Task
          </Button>
        </div>
      </div>

      {/* Tasks Table */}
      {selectedTasks.size > 0 && (
        <div className="bg-gray-50 border border-gray-300 rounded-t-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              className="h-5 w-5 border-2 border-gray-400 rounded"
              checked={selectedTasks.size === sortedTasks.length && sortedTasks.length > 0}
              ref={(element) => {
                if (element) {
                  element.indeterminate = selectedTasks.size > 0 && selectedTasks.size < sortedTasks.length
                }
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-xs text-gray-700 font-medium">{selectedTasks.size} items selected</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedTasks(new Set())}
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ border: "1px solid #CBD5E1", borderTopLeftRadius: selectedTasks.size > 0 ? 0 : "0.5rem", borderTopRightRadius: selectedTasks.size > 0 ? 0 : "0.5rem" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#F1F5F9", borderBottom: "0.5px solid #CBD5E1" }}>
            <tr>
              <th className="px-4 py-3 w-12" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <Checkbox
                  className="h-5 w-5 border-2 border-gray-400/60 rounded opacity-60"
                  checked={selectedTasks.size === sortedTasks.length && sortedTasks.length > 0}
                  ref={(element) => {
                    if (element) {
                      element.indeterminate = selectedTasks.size > 0 && selectedTasks.size < sortedTasks.length
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left w-96" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">TASK TITLE</span>
                  <button
                    onClick={() => toggleFilter("title")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "title" && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                      <Input
                        placeholder="Search tasks..."
                        value={filterTitle}
                        onChange={(e) => setFilterTitle(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left w-24" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">PRIORITY</span>
                  <button
                    onClick={() => toggleFilter("priority")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "priority" && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {["all", "high", "medium", "low"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterPriority(option)
                            setOpenFilter(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 first:rounded-t-md last:rounded-b-md capitalize"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left w-28" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">STATUS</span>
                  <button
                    onClick={() => toggleFilter("status")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "status" && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {[
                        { value: "all", label: "All" },
                        { value: "todo", label: "To-Do" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "review", label: "Review" },
                        { value: "completed", label: "Completed" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilterStatus(option.value)
                            setOpenFilter(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 first:rounded-t-md last:rounded-b-md capitalize"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left w-32" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-semibold text-gray-700">ASSIGNED TO</span>
                  <button
                    onClick={() => toggleFilter("assignee")}
                    className="h-5 w-5 rounded-md bg-white/50 border border-gray-300/50 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  {openFilter === "assignee" && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {["all", "John", "Sarah", "Lisa"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterAssignee(option)
                            setOpenFilter(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                        >
                          {option === "all" ? "All" : option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left w-20" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">REMARKS</span>
              </th>
              <th className="px-4 py-3 text-left w-16" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <span className="text-xs font-semibold text-gray-700">ATTACHMENT</span>
              </th>
              <th className="px-4 py-3 text-left w-20" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-700">START DATE</span>
                  <button
                    onClick={() => {
                      if (sortStartDate === null) setSortStartDate("asc")
                      else if (sortStartDate === "asc") setSortStartDate("desc")
                      else setSortStartDate(null)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {sortStartDate === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : sortStartDate === "desc" ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronsUpDown className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </th>
              <th className="px-4 py-3 text-left w-20">
                <span className="text-xs font-semibold text-gray-700 flex justify-center">ACTIONS</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => {
              // Updated to remarks
              const hasNewMessages = task.remarks.some((r) => r.isNew)
              return (
                <tr
                  key={task.id}
                  style={{
                    borderBottom: "0.5px solid #CBD5E1",
                    backgroundColor: selectedTasks.has(task.id) ? "#DBEAFE" : "transparent",
                  }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    // Don't open if clicking on interactive elements
                    if (!(e.target as HTMLElement).closest("button, input, a")) {
                      setViewingTask(task)
                    }
                  }}
                >
                  <td className="px-4 py-2" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <Checkbox
                      checked={selectedTasks.has(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                      className="h-5 w-5 opacity-60 rounded border-2 border-gray-400 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#FF8F5C] data-[state=checked]:to-[#FFD166] data-[state=checked]:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-2" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <span className="text-xs font-semibold text-gray-700">{task.title}</span>
                  </td>
                  <td className="px-4 py-2" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          task.priority === "high" ? "#FEE2E2" : task.priority === "medium" ? "#FEF3C7" : "#DBEAFE",
                        color:
                          task.priority === "high" ? "#991B1B" : task.priority === "medium" ? "#92400E" : "#1E40AF",
                      }}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <span className="text-xs font-semibold text-gray-700">
                      {task.status === "todo"
                        ? "To-Do"
                        : task.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-4 py-2" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    <div className="flex items-center gap-1">
                      {task.assignedTo.map((assignee, index) => (
                        <span key={index} className="text-xs text-gray-700">
                          {assignee}
                          {index < task.assignedTo.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* Updated to remarks and references */}
                  <td
                    className="px-4 py-2 text-sm text-gray-700 text-center"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    <Popover
                      open={remarksDialogOpen && selectedTaskIdForRemarks === task.id}
                      onOpenChange={(open) => {
                        /* Updated state name */
                        setRemarksDialogOpen(open)
                        if (open) {
                          setSelectedTaskRemarks(task.remarks) /* Updated to remarks */
                          setSelectedTaskIdForRemarks(task.id)
                        } else {
                          // Optionally clear selected remarks and task ID when dialog closes
                          setSelectedTaskRemarks([])
                          setSelectedTaskIdForRemarks("")
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button
                          className="relative hover:opacity-80 transition-opacity"
                          onClick={() => {
                            const updatedTasks = tasks.map((t) =>
                              t.id === task.id
                                ? {
                                    ...t,
                                    remarks: t.remarks.map((r) => ({ ...r, isNew: false })),
                                  }
                                : t,
                            )
                            setTasks(updatedTasks)
                          }}
                        >
                          <CustomMessageIcon className="h-4 w-4 text-gray-600" />
                          {task.remarks.some((r) => r.isNew) && (
                            <span
                              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#FF8F5C" }}
                            ></span>
                          )}
                        </button>
                      </PopoverTrigger>
                      {/* <PopoverContent> component is for the content inside the dialog */}
                      <PopoverContent className="w-80 p-0">
                        <div className="bg-white rounded-lg shadow-lg">
                          <div className="p-4 border-b">
                            <h3 className="font-semibold text-gray-900">
                              Remarks{" "}
                              <span className="text-sm text-gray-500">
                                (Total: {task.remarks.length} | New: {task.remarks.filter((r) => r.isNew).length})
                              </span>
                            </h3>
                          </div>
                          {/* Updated variable names and logic */}
                          <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                            {selectedTaskRemarks.map((remark) => (
                              <div
                                key={remark.id}
                                className={`p-3 rounded-lg ${remark.isNew ? "bg-orange-50 border-l-4 border-orange-500" : "bg-gray-50"}`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-sm text-gray-900">{remark.sender}</span>
                                  {remark.isNew && (
                                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">NEW</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{remark.content}</p>
                                {remark.attachment && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                    <Paperclip className="h-3 w-3" />
                                    <span>{remark.attachment}</span>
                                  </div>
                                )}
                                <span className="text-xs text-gray-500">{remark.timestamp}</span>
                              </div>
                            ))}
                            {selectedTaskRemarks.length === 0 && (
                              <p className="text-sm text-gray-500 text-center py-4">No remarks yet.</p>
                            )}
                          </div>
                          <div className="p-4 border-t bg-gray-50">
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Type your remark..."
                                value={newRemark}
                                onChange={(e) => setNewRemark(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  id="remark-attachment"
                                  className="hidden"
                                  onChange={(e) => setRemarkAttachment(e.target.files?.[0] || null)}
                                />
                                <label
                                  htmlFor="remark-attachment"
                                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                  <Paperclip className="h-4 w-4" />
                                  <span>Attach</span>
                                </label>
                                {remarkAttachment && (
                                  <span className="text-xs text-gray-600">{remarkAttachment.name}</span>
                                )}
                                <button
                                  onClick={handleSendRemark}
                                  className="ml-auto px-4 py-2 text-sm text-white rounded-lg hover:opacity-90"
                                  style={{ backgroundColor: "#FF8F5C" }}
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="px-4 py-2 text-center" style={{ borderRight: "0.5px solid #CBD5E1" }}>
                    {task.attachments && task.attachments.length > 0 ? (
                      <button
                        onClick={() => setSelectedTaskAttachments({ taskId: task.id, attachments: task.attachments })}
                        className="flex items-center justify-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                      >
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{task.attachments.length}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-gray-700 text-center"
                    style={{ borderRight: "0.5px solid #CBD5E1" }}
                  >
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(task.startDate)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setViewingTask(task)
                        }}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </button>
                      <button
                        onClick={() => setAddingAttachmentTaskId(task.id)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Paperclip className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </button>
                      <button
                        onClick={() => setDeletingTaskId(task.id)}
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
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Create New Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your task center</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-title">Task Title</Label>
              <Input id="create-title" placeholder="Enter task title" className="bg-white shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea id="create-description" placeholder="Enter task description" className="bg-white shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-status">Status</Label>
                <Select defaultValue="todo">
                  <SelectTrigger id="create-status" className="bg-white shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="todo">To-Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-priority">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="create-priority" className="bg-white shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-assignedTo">Assigned To</Label>
              <Input
                id="create-assignedTo"
                placeholder="Enter first names separated by commas (e.g., John, Sarah)"
                className="bg-white shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-startDate">Start Date</Label>
              <Input id="create-startDate" type="date" className="bg-white shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-attachments">Attachments</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white shadow-sm hover:bg-gray-50"
                  onClick={() => document.getElementById("create-fileInput")?.click()}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Files
                </Button>
                <input
                  id="create-fileInput"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files
                    if (files) {
                      console.log(
                        "[v0] Files selected:",
                        Array.from(files).map((f) => f.name),
                      )
                    }
                  }}
                />
                <span className="text-sm text-gray-500">No files selected</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="shadow-md text-white font-semibold hover:opacity-90"
              style={{
                backgroundColor: "#FF8F5C",
              }}
              onClick={() => {
                const title = (document.getElementById("create-title") as HTMLInputElement)?.value
                const description = (document.getElementById("create-description") as HTMLTextAreaElement)?.value
                const statusSelect = document.getElementById("create-status") as HTMLButtonElement
                const prioritySelect = document.getElementById("create-priority") as HTMLButtonElement
                const assignedToInput = (document.getElementById("create-assignedTo") as HTMLInputElement)?.value
                const startDate = (document.getElementById("create-startDate") as HTMLInputElement)?.value

                // Basic validation
                if (!title || !description || !startDate) {
                  alert("Please fill in title, description, and start date.")
                  return
                }

                // Get values from select elements more reliably
                const status =
                  (
                    statusSelect?.nextElementSibling?.querySelector('[role="combobox"]') as HTMLButtonElement
                  )?.getAttribute("aria-expanded") === "true"
                    ? (statusSelect?.nextElementSibling?.querySelector('[aria-selected="true"]') as HTMLDivElement)
                        ?.textContent
                    : (statusSelect?.querySelector("span") as HTMLSpanElement)?.textContent || "todo"

                const priority =
                  (
                    prioritySelect?.nextElementSibling?.querySelector('[role="combobox"]') as HTMLButtonElement
                  )?.getAttribute("aria-expanded") === "true"
                    ? (prioritySelect?.nextElementSibling?.querySelector('[aria-selected="true"]') as HTMLDivElement)
                        ?.textContent
                    : (prioritySelect?.querySelector("span") as HTMLSpanElement)?.textContent || "medium"

                const newTask: Task = {
                  id: `${Date.now()}`,
                  title,
                  description,
                  status: status as Status, // Cast to Status type
                  priority: priority as Priority, // Cast to Priority type
                  assignedTo: assignedToInput ? assignedToInput.split(",").map((s) => s.trim()) : ["John"],
                  startDate,
                  remarks: [], // Initialize with empty remarks
                }
                handleCreateTask(newTask)
              }}
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Edit Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="bg-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update task details and status</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input id="edit-title" defaultValue={editingTask.title} className="bg-white shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={editingTask.description} className="bg-white shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={editingTask.status}>
                    <SelectTrigger className="bg-white shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="todo">To-Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select defaultValue={editingTask.priority}>
                    <SelectTrigger className="bg-white shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  defaultValue={editingTask.startDate}
                  className="bg-white shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-attachments">Attachments</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white shadow-sm hover:bg-gray-50"
                    onClick={() => document.getElementById("edit-fileInput")?.click()}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>
                  <input
                    id="edit-fileInput"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        console.log(
                          "[v0] Files selected:",
                          Array.from(files).map((f) => f.name),
                        )
                      }
                    }}
                  />
                  <span className="text-sm text-gray-500">No files selected</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shadow-md text-white font-semibold hover:opacity-90"
                style={{
                  backgroundColor: "#FF8F5C",
                }}
                onClick={() => {
                  const title = (document.getElementById("edit-title") as HTMLInputElement)?.value
                  const description = (document.getElementById("edit-description") as HTMLTextAreaElement)?.value
                  const status = (document.getElementById("edit-status") as HTMLSelectElement)?.value as Status
                  const priority = (document.getElementById("edit-priority") as HTMLSelectElement)?.value as Priority
                  const startDate = (document.getElementById("edit-startDate") as HTMLInputElement)?.value

                  if (title && description && status && priority && startDate) {
                    const updatedTask: Task = {
                      ...editingTask,
                      title,
                      description,
                      status,
                      priority,
                      startDate,
                    }
                    handleEditTask(updatedTask)
                  }
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTaskId && (
        <Dialog open={!!deletingTaskId} onOpenChange={() => setDeletingTaskId(null)}>
          <DialogContent className="bg-white sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingTaskId(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => deletingTaskId && handleDeleteTask(deletingTaskId)}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: "#FF8F5C" }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Messages Dialog - Keeping this for consistency with the original code, but it's not used in the updates */}
      {/* It seems the intention was to replace this with the Remarks Popover */}
      {/* However, to strictly follow the merge, I'm keeping it and commenting its potential redundancy */}
      {/* If this dialog should be removed, it would be done here. */}
      {/* {selectedTaskMessages.length > 0 && (
        <Dialog open={selectedTaskMessages.length > 0} onOpenChange={() => setSelectedTaskMessages([])}>
          <DialogContent className="bg-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Messages</DialogTitle>
              <DialogDescription>View messages for selected task</DialogDescription>
            </DialogHeader>
            <div className="max-h-64 overflow-y-auto">
              {selectedTaskMessages.map((message) => (
                <div key={message.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-900">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600">{message.content}</p>
                  {message.attachment && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                      <Paperclip className="h-3 w-3" />
                      <span>{message.attachment}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTaskMessages([])}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}

      {/* Attachments Dialog */}
      {selectedTaskAttachments && (
        <Dialog open={selectedTaskAttachments !== null} onOpenChange={() => setSelectedTaskAttachments(null)}>
          <DialogContent className="bg-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Task Attachments</DialogTitle>
              <DialogDescription>View and open attachments for this task</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedTaskAttachments.attachments.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedTaskAttachments.attachments.length} attachment
                    {selectedTaskAttachments.attachments.length > 1 ? "s" : ""}
                  </p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {selectedTaskAttachments.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        style={{
                          borderBottom:
                            index < selectedTaskAttachments.attachments.length - 1 ? "1px solid #E5E7EB" : "none",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachment}</span>
                        </div>
                        <button
                          onClick={() => {
                            window.open(attachment, "_blank")
                          }}
                          className="text-xs px-3 py-1 rounded-md transition-colors"
                          style={{
                            background: "rgb(4, 53, 95)",
                            color: "white",
                          }}
                        >
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No attachments found</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTaskAttachments(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {addingAttachmentTaskId !== null && (
        <Dialog open={addingAttachmentTaskId !== null} onOpenChange={() => setAddingAttachmentTaskId(null)}>
          <DialogContent className="bg-white sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Attachment</DialogTitle>
              <DialogDescription>Select files to upload</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <input
                type="file"
                id="add-attachment-input"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    const fileNames = Array.from(files).map((file) => file.name)
                    setTasks(
                      tasks.map((t) =>
                        t.id === addingAttachmentTaskId
                          ? { ...t, attachments: [...(t.attachments || []), ...fileNames] }
                          : t,
                      ),
                    )
                    setAddingAttachmentTaskId(null)
                  }
                }}
              />
              <label
                htmlFor="add-attachment-input"
                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Paperclip className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Choose Files</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddingAttachmentTaskId(null)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewingTask && (
        <Dialog open={!!viewingTask} onOpenChange={() => setViewingTask(null)}>
          <DialogContent className="bg-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingTask.title}</DialogTitle>
              <DialogDescription>View complete task information and details</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{viewingTask.description}</p>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Status</h3>
                  <span className="inline-block text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {viewingTask.status === "todo"
                      ? "To-Do"
                      : viewingTask.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Priority</h3>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor:
                        viewingTask.priority === "high"
                          ? "#FEE2E2"
                          : viewingTask.priority === "medium"
                            ? "#FEF3C7"
                            : "#DBEAFE",
                      color:
                        viewingTask.priority === "high"
                          ? "#991B1B"
                          : viewingTask.priority === "medium"
                            ? "#92400E"
                            : "#1E40AF",
                    }}
                  >
                    {viewingTask.priority.charAt(0).toUpperCase() + viewingTask.priority.slice(1)}
                  </span>
                </div>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Assigned To</h3>
                <div className="flex items-center gap-2">
                  {viewingTask.assignedTo.map((assignee, index) => (
                    <span key={index} className="text-sm text-gray-700">
                      {assignee}
                      {index < viewingTask.assignedTo.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Start Date</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(viewingTask.startDate)}</span>
                </div>
              </div>

              {/* Attachments */}
              {viewingTask.attachments && viewingTask.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Attachments ({viewingTask.attachments.length})
                  </h3>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    {viewingTask.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachment}</span>
                        </div>
                        <button
                          onClick={() => window.open(attachment, "_blank")}
                          className="text-xs px-3 py-1 rounded hover:bg-gray-100"
                          style={{ color: "#FF8F5C" }}
                        >
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Remarks ({viewingTask.remarks.length})</h3>
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                  {viewingTask.remarks.map((remark) => (
                    <div
                      key={remark.id}
                      className={`p-3 rounded-lg ${remark.isNew ? "bg-orange-50 border-l-4 border-orange-500" : "bg-white"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">{remark.sender}</span>
                        {remark.isNew && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">NEW</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{remark.content}</p>
                      {remark.attachment && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <Paperclip className="h-3 w-3" />
                          <span>{remark.attachment}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">{remark.timestamp}</span>
                    </div>
                  ))}
                  {viewingTask.remarks.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No remarks yet.</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const dataStr = JSON.stringify(viewingTask, null, 2)
                  const dataBlob = new Blob([dataStr], { type: "application/json" })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement("a")
                  link.href = url
                  link.download = `task-${viewingTask.id}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={() => {
                  setViewingTask(null)
                }}
                className="shadow-md text-white font-semibold hover:opacity-90"
                style={{
                  backgroundColor: "#FF8F5C",
                }}
              >
                Save
              </Button>
              <Button variant="outline" onClick={() => setViewingTask(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={bulkActionsDialogOpen} onOpenChange={setBulkActionsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              {selectedTasks.size} task{selectedTasks.size !== 1 ? "s" : ""} selected
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">Choose an action to perform on the selected tasks:</p>
            <div className="space-y-2">
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="w-full justify-start text-white hover:opacity-90 bg-transparent"
                style={{ backgroundColor: "#FF8F5C" }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All Selected Tasks
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTasks.size} selected task{selectedTasks.size !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="text-white hover:opacity-90"
              style={{ backgroundColor: "#FF8F5C" }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
