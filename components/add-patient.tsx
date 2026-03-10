"use client"

import { Checkbox } from "@/components/ui/checkbox"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Paperclip } from "lucide-react"

export function AddPatient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mi: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    condition: "",
    notes: "",
    primaryInsuranceProvider: "",
    primaryInsurancePolicyNumber: "",
    primaryInsuranceGroupNumber: "",
    primaryInsuranceSubscriberId: "",
    primaryInsuranceSubscriberName: "",
    primaryInsuranceSubscriberDOB: "",
    primaryInsuranceSubscriberRelation: "",
    secondaryInsuranceProvider: "",
    secondaryInsurancePolicyNumber: "",
    secondaryInsuranceGroupNumber: "",
    secondaryInsuranceSubscriberId: "",
    secondaryInsuranceSubscriberName: "",
    secondaryInsuranceSubscriberDOB: "",
    secondaryInsuranceSubscriberRelation: "",
    tertiaryInsuranceProvider: "",
    tertiaryInsurancePolicyNumber: "",
    tertiaryInsuranceGroupNumber: "",
    tertiaryInsuranceSubscriberId: "",
    tertiaryInsuranceSubscriberName: "",
    tertiaryInsuranceSubscriberDOB: "",
    tertiaryInsuranceSubscriberRelation: "",
  })

  const [primaryCardFront, setPrimaryCardFront] = useState<File | null>(null)
  const [primaryCardBack, setPrimaryCardBack] = useState<File | null>(null)
  const [secondaryCardFront, setSecondaryCardFront] = useState<File | null>(null)
  const [secondaryCardBack, setSecondaryCardBack] = useState<File | null>(null)
  const [tertiaryCardFront, setTertiaryCardFront] = useState<File | null>(null)
  const [tertiaryCardBack, setTertiaryCardBack] = useState<File | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New patient data:", formData)
    // Handle form submission
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (
    insuranceType: "primary" | "secondary" | "tertiary",
    side: "front" | "back",
    file: File | null,
  ) => {
    if (insuranceType === "primary") {
      if (side === "front") setPrimaryCardFront(file)
      else setPrimaryCardBack(file)
    } else if (insuranceType === "secondary") {
      if (side === "front") setSecondaryCardFront(file)
      else setSecondaryCardBack(file)
    } else {
      if (side === "front") setTertiaryCardFront(file)
      else setTertiaryCardBack(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold" style={{ color: "rgb(4, 53, 95)" }}>
          Add New Patient
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="inline-flex gap-1 mb-6 bg-transparent p-0">
              <TabsTrigger
                value="personal"
                className="px-6 py-2.5 text-sm rounded-t-lg font-medium transition-all bg-gray-200 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
              >
                Personal Information
              </TabsTrigger>
              <TabsTrigger
                value="insurance"
                className="px-6 py-2.5 text-sm rounded-t-lg font-medium transition-all bg-gray-200 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md"
              >
                Insurance Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #CBD5E1" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="firstName" className="text-sm">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="First name"
                        className="h-9"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="lastName" className="text-sm">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Last name"
                        className="h-9"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="mi" className="text-sm">
                        MI
                      </Label>
                      <Input
                        id="mi"
                        value={formData.mi}
                        onChange={(e) => handleInputChange("mi", e.target.value)}
                        placeholder="MI"
                        className="h-9"
                        maxLength={1}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-sm">
                        DOB *
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        className="h-9"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm">
                        Gender *
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #CBD5E1" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Email address"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Phone number"
                        className="h-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1" className="text-sm">
                        Address Line 1 *
                      </Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                        placeholder="Street address"
                        className="h-9"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2" className="text-sm">
                        Address Line 2
                      </Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                        placeholder="Apt, suite, etc."
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="city" className="text-sm">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                        className="h-9"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="state" className="text-sm">
                        State *
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                        className="h-9"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="zipCode" className="text-sm">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="12345-6789"
                        className="h-9"
                        pattern="^\d{5}(-\d{4})?$"
                        title="Enter a valid ZIP code (12345 or 12345-6789)"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #CBD5E1" }}>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Additional medical notes or observations"
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #CBD5E1" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                  Primary Insurance Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsuranceProvider" className="text-sm">
                        Insurance Provider
                      </Label>
                      <Input
                        id="primaryInsuranceProvider"
                        value={formData.primaryInsuranceProvider}
                        onChange={(e) => handleInputChange("primaryInsuranceProvider", e.target.value)}
                        placeholder="e.g., Blue Cross, Aetna"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsuranceSubscriberId" className="text-sm">
                        Subscriber ID
                      </Label>
                      <Input
                        id="primaryInsuranceSubscriberId"
                        value={formData.primaryInsuranceSubscriberId}
                        onChange={(e) => handleInputChange("primaryInsuranceSubscriberId", e.target.value)}
                        placeholder="Subscriber ID"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsuranceGroupNumber" className="text-sm">
                        Group Number
                      </Label>
                      <Input
                        id="primaryInsuranceGroupNumber"
                        value={formData.primaryInsuranceGroupNumber}
                        onChange={(e) => handleInputChange("primaryInsuranceGroupNumber", e.target.value)}
                        placeholder="Group number"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsurancePolicyNumber" className="text-sm">
                        Policy Number
                      </Label>
                      <Input
                        id="primaryInsurancePolicyNumber"
                        value={formData.primaryInsurancePolicyNumber}
                        onChange={(e) => handleInputChange("primaryInsurancePolicyNumber", e.target.value)}
                        placeholder="Policy number"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsuranceSubscriberName" className="text-sm">
                        Subscriber Name
                      </Label>
                      <Input
                        id="primaryInsuranceSubscriberName"
                        value={formData.primaryInsuranceSubscriberName}
                        onChange={(e) => handleInputChange("primaryInsuranceSubscriberName", e.target.value)}
                        placeholder="Name of policy holder"
                        className="h-9"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id="primarySameAsPatient"
                          checked={formData.primaryInsuranceSubscriberName === `${formData.firstName} ${formData.lastName}` && formData.firstName && formData.lastName}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("primaryInsuranceSubscriberName", `${formData.firstName} ${formData.lastName}`);
                            } else {
                              handleInputChange("primaryInsuranceSubscriberName", "");
                            }
                          }}
                        />
                        <Label htmlFor="primarySameAsPatient" className="text-sm font-normal cursor-pointer">
                          Same as patient name
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsuranceSubscriberDOB" className="text-sm">
                        Subscriber DOB
                      </Label>
                      <Input
                        id="primaryInsuranceSubscriberDOB"
                        type="date"
                        value={formData.primaryInsuranceSubscriberDOB}
                        onChange={(e) => handleInputChange("primaryInsuranceSubscriberDOB", e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryInsuranceSubscriberRelation" className="text-sm">
                        Relation to Subscriber
                      </Label>
                      <Select
                        value={formData.primaryInsuranceSubscriberRelation}
                        onValueChange={(value) => handleInputChange("primaryInsuranceSubscriberRelation", value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm opacity-0">Attach</Label>
                      <Dialog
                        open={uploadDialogOpen === "primary"}
                        onOpenChange={(open) => setUploadDialogOpen(open ? "primary" : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-9 w-full gap-2 bg-transparent">
                            <Paperclip className="h-4 w-4" />
                            Attach Insurance Card
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Upload Insurance Card</DialogTitle>
                            <DialogDescription>Upload front and back images of the insurance card</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="primary-front" className="text-sm">
                                Front Side
                              </Label>
                              <Input
                                id="primary-front"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("primary", "front", e.target.files?.[0] || null)}
                                className="h-9"
                              />
                              {primaryCardFront && (
                                <p className="text-xs text-gray-600">Selected: {primaryCardFront.name}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="primary-back" className="text-sm">
                                Back Side
                              </Label>
                              <Input
                                id="primary-back"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("primary", "back", e.target.files?.[0] || null)}
                                className="h-9"
                              />
                              {primaryCardBack && (
                                <p className="text-xs text-gray-600">Selected: {primaryCardBack.name}</p>
                              )}
                            </div>
                          </div>
                          <Button onClick={() => setUploadDialogOpen(null)} className="w-full">
                            Done
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #CBD5E1" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                  Secondary Insurance Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsuranceProvider" className="text-sm">
                        Insurance Provider
                      </Label>
                      <Input
                        id="secondaryInsuranceProvider"
                        value={formData.secondaryInsuranceProvider}
                        onChange={(e) => handleInputChange("secondaryInsuranceProvider", e.target.value)}
                        placeholder="e.g., Blue Cross, Aetna"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsuranceSubscriberId" className="text-sm">
                        Subscriber ID
                      </Label>
                      <Input
                        id="secondaryInsuranceSubscriberId"
                        value={formData.secondaryInsuranceSubscriberId}
                        onChange={(e) => handleInputChange("secondaryInsuranceSubscriberId", e.target.value)}
                        placeholder="Subscriber ID"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsuranceGroupNumber" className="text-sm">
                        Group Number
                      </Label>
                      <Input
                        id="secondaryInsuranceGroupNumber"
                        value={formData.secondaryInsuranceGroupNumber}
                        onChange={(e) => handleInputChange("secondaryInsuranceGroupNumber", e.target.value)}
                        placeholder="Group number"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsurancePolicyNumber" className="text-sm">
                        Policy Number
                      </Label>
                      <Input
                        id="secondaryInsurancePolicyNumber"
                        value={formData.secondaryInsurancePolicyNumber}
                        onChange={(e) => handleInputChange("secondaryInsurancePolicyNumber", e.target.value)}
                        placeholder="Policy number"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsuranceSubscriberName" className="text-sm">
                        Subscriber Name
                      </Label>
                      <Input
                        id="secondaryInsuranceSubscriberName"
                        value={formData.secondaryInsuranceSubscriberName}
                        onChange={(e) => handleInputChange("secondaryInsuranceSubscriberName", e.target.value)}
                        placeholder="Name of policy holder"
                        className="h-9"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id="secondarySameAsPatient"
                          checked={formData.secondaryInsuranceSubscriberName === `${formData.firstName} ${formData.lastName}` && formData.firstName && formData.lastName}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("secondaryInsuranceSubscriberName", `${formData.firstName} ${formData.lastName}`);
                            } else {
                              handleInputChange("secondaryInsuranceSubscriberName", "");
                            }
                          }}
                        />
                        <Label htmlFor="secondarySameAsPatient" className="text-sm font-normal cursor-pointer">
                          Same as patient name
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsuranceSubscriberDOB" className="text-sm">
                        Subscriber DOB
                      </Label>
                      <Input
                        id="secondaryInsuranceSubscriberDOB"
                        type="date"
                        value={formData.secondaryInsuranceSubscriberDOB}
                        onChange={(e) => handleInputChange("secondaryInsuranceSubscriberDOB", e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryInsuranceSubscriberRelation" className="text-sm">
                        Relation to Subscriber
                      </Label>
                      <Select
                        value={formData.secondaryInsuranceSubscriberRelation}
                        onValueChange={(value) => handleInputChange("secondaryInsuranceSubscriberRelation", value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm opacity-0">Attach</Label>
                      <Dialog
                        open={uploadDialogOpen === "secondary"}
                        onOpenChange={(open) => setUploadDialogOpen(open ? "secondary" : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-9 w-full gap-2 bg-transparent">
                            <Paperclip className="h-4 w-4" />
                            Attach Insurance Card
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Upload Insurance Card</DialogTitle>
                            <DialogDescription>Upload front and back images of the insurance card</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="secondary-front" className="text-sm">
                                Front Side
                              </Label>
                              <Input
                                id="secondary-front"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("secondary", "front", e.target.files?.[0] || null)}
                                className="h-9"
                              />
                              {secondaryCardFront && (
                                <p className="text-xs text-gray-600">Selected: {secondaryCardFront.name}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secondary-back" className="text-sm">
                                Back Side
                              </Label>
                              <Input
                                id="secondary-back"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("secondary", "back", e.target.files?.[0] || null)}
                                className="h-9"
                              />
                              {secondaryCardBack && (
                                <p className="text-xs text-gray-600">Selected: {secondaryCardBack.name}</p>
                              )}
                            </div>
                          </div>
                          <Button onClick={() => setUploadDialogOpen(null)} className="w-full">
                            Done
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #CBD5E1" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "rgb(4, 53, 95)" }}>
                  Tertiary Insurance Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsuranceProvider" className="text-sm">
                        Insurance Provider
                      </Label>
                      <Input
                        id="tertiaryInsuranceProvider"
                        value={formData.tertiaryInsuranceProvider}
                        onChange={(e) => handleInputChange("tertiaryInsuranceProvider", e.target.value)}
                        placeholder="e.g., Blue Cross, Aetna"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsuranceSubscriberId" className="text-sm">
                        Subscriber ID
                      </Label>
                      <Input
                        id="tertiaryInsuranceSubscriberId"
                        value={formData.tertiaryInsuranceSubscriberId}
                        onChange={(e) => handleInputChange("tertiaryInsuranceSubscriberId", e.target.value)}
                        placeholder="Subscriber ID"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsuranceGroupNumber" className="text-sm">
                        Group Number
                      </Label>
                      <Input
                        id="tertiaryInsuranceGroupNumber"
                        value={formData.tertiaryInsuranceGroupNumber}
                        onChange={(e) => handleInputChange("tertiaryInsuranceGroupNumber", e.target.value)}
                        placeholder="Group number"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsurancePolicyNumber" className="text-sm">
                        Policy Number
                      </Label>
                      <Input
                        id="tertiaryInsurancePolicyNumber"
                        value={formData.tertiaryInsurancePolicyNumber}
                        onChange={(e) => handleInputChange("tertiaryInsurancePolicyNumber", e.target.value)}
                        placeholder="Policy number"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsuranceSubscriberName" className="text-sm">
                        Subscriber Name
                      </Label>
                      <Input
                        id="tertiaryInsuranceSubscriberName"
                        value={formData.tertiaryInsuranceSubscriberName}
                        onChange={(e) => handleInputChange("tertiaryInsuranceSubscriberName", e.target.value)}
                        placeholder="Name of policy holder"
                        className="h-9"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id="tertiarySameAsPatient"
                          checked={formData.tertiaryInsuranceSubscriberName === `${formData.firstName} ${formData.lastName}` && formData.firstName && formData.lastName}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange("tertiaryInsuranceSubscriberName", `${formData.firstName} ${formData.lastName}`);
                            } else {
                              handleInputChange("tertiaryInsuranceSubscriberName", "");
                            }
                          }}
                        />
                        <Label htmlFor="tertiarySameAsPatient" className="text-sm font-normal cursor-pointer">
                          Same as patient name
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsuranceSubscriberDOB" className="text-sm">
                        Subscriber DOB
                      </Label>
                      <Input
                        id="tertiaryInsuranceSubscriberDOB"
                        type="date"
                        value={formData.tertiaryInsuranceSubscriberDOB}
                        onChange={(e) => handleInputChange("tertiaryInsuranceSubscriberDOB", e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryInsuranceSubscriberRelation" className="text-sm">
                        Relation to Subscriber
                      </Label>
                      <Select
                        value={formData.tertiaryInsuranceSubscriberRelation}
                        onValueChange={(value) => handleInputChange("tertiaryInsuranceSubscriberRelation", value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm opacity-0">Attach</Label>
                      <Dialog
                        open={uploadDialogOpen === "tertiary"}
                        onOpenChange={(open) => setUploadDialogOpen(open ? "tertiary" : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-9 w-full gap-2 bg-transparent">
                            <Paperclip className="h-4 w-4" />
                            Attach Insurance Card
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Upload Insurance Card</DialogTitle>
                            <DialogDescription>Upload front and back images of the insurance card</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="tertiary-front" className="text-sm">
                                Front Side
                              </Label>
                              <Input
                                id="tertiary-front"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("tertiary", "front", e.target.files?.[0] || null)}
                                className="h-9"
                              />
                              {tertiaryCardFront && (
                                <p className="text-xs text-gray-600">Selected: {tertiaryCardFront.name}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tertiary-back" className="text-sm">
                                Back Side
                              </Label>
                              <Input
                                id="tertiary-back"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("tertiary", "back", e.target.files?.[0] || null)}
                                className="h-9"
                              />
                              {tertiaryCardBack && (
                                <p className="text-xs text-gray-600">Selected: {tertiaryCardBack.name}</p>
                              )}
                            </div>
                          </div>
                          <Button onClick={() => setUploadDialogOpen(null)} className="w-full">
                            Done
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-9 bg-transparent"
              onClick={() =>
                setFormData({
                  firstName: "",
                  lastName: "",
                  mi: "",
                  dob: "",
                  gender: "",
                  email: "",
                  phone: "",
                  addressLine1: "",
                  addressLine2: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  condition: "",
                  notes: "",
                  primaryInsuranceProvider: "",
                  primaryInsurancePolicyNumber: "",
                  primaryInsuranceGroupNumber: "",
                  primaryInsuranceSubscriberName: "",
                  primaryInsuranceSubscriberDOB: "",
                  primaryInsuranceSubscriberRelation: "",
                  secondaryInsuranceProvider: "",
                  secondaryInsurancePolicyNumber: "",
                  secondaryInsuranceGroupNumber: "",
                  secondaryInsuranceSubscriberName: "",
                  secondaryInsuranceSubscriberDOB: "",
                  secondaryInsuranceSubscriberRelation: "",
                  tertiaryInsuranceProvider: "",
                  tertiaryInsurancePolicyNumber: "",
                  tertiaryInsuranceGroupNumber: "",
                  tertiaryInsuranceSubscriberName: "",
                  tertiaryInsuranceSubscriberDOB: "",
                  tertiaryInsuranceSubscriberRelation: "",
                })
              }
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              className="h-9 shadow-lg hover:shadow-xl transition-all text-white font-semibold px-8"
              style={{
                backgroundColor: "#FF8F5C",
              }}
            >
              Add Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
