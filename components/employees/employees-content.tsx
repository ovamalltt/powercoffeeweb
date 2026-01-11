"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Pencil, Trash2, Phone, Briefcase, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { Karyawan, Jabatan } from "@/lib/supabase/types"

export function EmployeesContent() {
  const [employees, setEmployees] = useState<(Karyawan & { jabatan: Jabatan | null })[]>([])
  const [positions, setPositions] = useState<Jabatan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Karyawan | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    nama_karyawan: "",
    id_jabatan: "",
    telp: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()

    const [employeesRes, positionsRes] = await Promise.all([
      supabase.from("karyawan").select("*, jabatan:jabatan(*)").order("nama_karyawan"),
      supabase.from("jabatan").select("*").order("nama_jabatan"),
    ])

    if (employeesRes.data) setEmployees(employeesRes.data as (Karyawan & { jabatan: Jabatan | null })[])
    if (positionsRes.data) setPositions(positionsRes.data)
    setIsLoading(false)
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.nama_karyawan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jabatan?.nama_jabatan.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openAddModal = () => {
    setEditingEmployee(null)
    setFormData({
      nama_karyawan: "",
      id_jabatan: positions[0]?.id_jabatan.toString() || "",
      telp: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (employee: Karyawan) => {
    setEditingEmployee(employee)
    setFormData({
      nama_karyawan: employee.nama_karyawan,
      id_jabatan: employee.id_jabatan?.toString() || "",
      telp: employee.telp || "",
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const employeeData = {
      nama_karyawan: formData.nama_karyawan,
      id_jabatan: Number.parseInt(formData.id_jabatan),
      telp: formData.telp || null,
    }

    if (editingEmployee) {
      await supabase.from("karyawan").update(employeeData).eq("id_karyawan", editingEmployee.id_karyawan)
    } else {
      await supabase.from("karyawan").insert(employeeData)
    }

    setIsModalOpen(false)
    setIsSaving(false)
    fetchData()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return
    const supabase = createClient()
    await supabase.from("karyawan").delete().eq("id_karyawan", id)
    fetchData()
  }

  const getPositionColor = (position: string | undefined) => {
    switch (position) {
      case "Manager":
        return "text-purple-400 bg-purple-400/20"
      case "Barista":
        return "text-blue-400 bg-blue-400/20"
      case "Kasir":
        return "text-green-400 bg-green-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border rounded-xl"
          />
        </div>
        <Button
          onClick={openAddModal}
          className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass p-5 rounded-2xl border-0">
          <p className="text-sm text-muted-foreground">Total Staff</p>
          <p className="text-2xl font-bold text-foreground mt-1">{employees.length}</p>
        </Card>
        {positions.map((pos) => (
          <Card key={pos.id_jabatan} className="glass p-5 rounded-2xl border-0">
            <p className="text-sm text-muted-foreground">{pos.nama_jabatan}</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {employees.filter((e) => e.id_jabatan === pos.id_jabatan).length}
            </p>
          </Card>
        ))}
      </div>

      {/* Employees Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass rounded-2xl border-0 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary" />
                <div className="flex-1">
                  <div className="h-5 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id_karyawan}
              className="glass rounded-2xl border-0 p-5 hover:scale-[1.02] transition-transform duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {employee.nama_karyawan.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{employee.nama_karyawan}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPositionColor(employee.jabatan?.nama_jabatan)}`}
                    >
                      {employee.jabatan?.nama_jabatan || "No Position"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(employee)}
                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id_karyawan)}
                    className="w-8 h-8 rounded-lg bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {employee.telp && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.telp}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>Employee ID: {employee.id_karyawan}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass rounded-2xl border-0 p-12">
          <div className="text-center">
            <p className="text-muted-foreground">No employees found</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Employee Name</Label>
              <Input
                value={formData.nama_karyawan}
                onChange={(e) => setFormData({ ...formData, nama_karyawan: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Position</Label>
              <Select
                value={formData.id_jabatan}
                onValueChange={(value) => setFormData({ ...formData, id_jabatan: value })}
              >
                <SelectTrigger className="h-11 bg-input border-border rounded-xl">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.id_jabatan} value={pos.id_jabatan.toString()}>
                      {pos.nama_jabatan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Phone Number (optional)</Label>
              <Input
                value={formData.telp}
                onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                className="h-11 bg-input border-border rounded-xl"
                placeholder="e.g. 08123456789"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-border bg-transparent"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                onClick={handleSave}
                disabled={isSaving || !formData.nama_karyawan || !formData.id_jabatan}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingEmployee ? (
                  "Save Changes"
                ) : (
                  "Add Employee"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
