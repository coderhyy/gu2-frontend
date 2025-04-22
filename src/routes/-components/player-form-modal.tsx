"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface PlayerFormData {
  address: string;
  dateOfBirth: string;
  doctor: string;
  doctorTel: string;
  email: string;
  healthIssues: string;
  mobileNumber: string;
  name: string;
  nextOfKin: string;
  nextOfKinTel: string;
  positions: string[];
  postcode: string;
  sruNumber: string;
  telNumber: string;
}

interface PlayerFormModalProps {
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PlayerFormData) => void;
  open: boolean;
}

export function PlayerFormModal({
  onOpenChange,
  onSubmit,
  open,
}: PlayerFormModalProps) {
  const [formData, setFormData] = useState<PlayerFormData>({
    address: "",
    dateOfBirth: "",
    doctor: "",
    doctorTel: "",
    email: "",
    healthIssues: "",
    mobileNumber: "",
    name: "",
    nextOfKin: "",
    nextOfKinTel: "",
    positions: [],
    postcode: "",
    sruNumber: "",
    telNumber: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (position: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      positions: checked
        ? [...prev.positions, position]
        : prev.positions.filter((pos) => pos !== position),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            Player member form
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="name">
                  Name
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="name"
                  name="name"
                  onChange={handleInputChange}
                  value={formData.name}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="address1">
                  Address
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="address1"
                  name="address1"
                  onChange={handleInputChange}
                  value={formData.address}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="postcode">
                  Postcode
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="postcode"
                  name="postcode"
                  onChange={handleInputChange}
                  value={formData.postcode}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="nextOfKin">
                  Next of kin
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="nextOfKin"
                  name="nextOfKin"
                  onChange={handleInputChange}
                  value={formData.nextOfKin}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="nextOfKinTel">
                  Tel
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="nextOfKinTel"
                  name="nextOfKinTel"
                  onChange={handleInputChange}
                  value={formData.nextOfKinTel}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="sruNumber">
                  SRU number
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="sruNumber"
                  name="sruNumber"
                  onChange={handleInputChange}
                  value={formData.sruNumber}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="dateOfBirth">
                  Date of birth
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  onChange={handleInputChange}
                  value={formData.dateOfBirth}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="telNumber">
                  Tel number
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="telNumber"
                  name="telNumber"
                  onChange={handleInputChange}
                  value={formData.telNumber}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="mobileNumber">
                  Mobile number
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="mobileNumber"
                  name="mobileNumber"
                  onChange={handleInputChange}
                  value={formData.mobileNumber}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="email"
                  name="email"
                  onChange={handleInputChange}
                  type="email"
                  value={formData.email}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="doctor">
                  Doctor
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="doctor"
                  name="doctor"
                  onChange={handleInputChange}
                  value={formData.doctor}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="doctorTel">
                  Tel
                </Label>
                <Input
                  className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black px-0"
                  id="doctorTel"
                  name="doctorTel"
                  onChange={handleInputChange}
                  value={formData.doctorTel}
                />
              </div>
            </div>
          </div>

          {/* Health issues */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="healthIssues">
              Known health issues
            </Label>
            <Textarea
              className="min-h-[80px] border-gray-300"
              id="healthIssues"
              name="healthIssues"
              onChange={handleInputChange}
              rows={3}
              value={formData.healthIssues}
            />
          </div>

          {/* Positions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Position</Label>
            <div className="border border-gray-300">
              <div className="grid grid-cols-3 md:grid-cols-9 border-collapse">
                {[
                  "Full back",
                  "Wing",
                  "Centre",
                  "Fly half",
                  "Scrum half",
                  "Hooker",
                  "Prop",
                  "2nd row",
                  "Back row",
                ].map((position) => (
                  <div
                    className="flex flex-col items-center justify-center p-2 border border-gray-300 text-center"
                    key={position}
                  >
                    <span className="text-xs mb-1">{position}</span>
                    <Checkbox
                      checked={formData.positions.includes(position)}
                      id={position}
                      onCheckedChange={(checked) =>
                        handlePositionChange(position, checked as boolean)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs">
            List of seasons and subs paid on a separate sheet.
          </div>

          <DialogFooter className="sm:justify-end border-t pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
