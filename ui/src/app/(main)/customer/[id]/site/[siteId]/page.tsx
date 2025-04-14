"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, Download, FileSpreadsheet, FileText, MoreHorizontal, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Datos de ejemplo
const sitesData = [
  {
    id: 1,
    site: "Zip Calpules - Edificio Administrativo",
    buildingOwner: "-",
    email: "-",
    phone: "-",
    address: "-",
  },
  {
    id: 2,
    site: "Zip Calpules - Edificio Operativo",
    buildingOwner: "Juan Pérez",
    email: "juan@example.com",
    phone: "123-456-7890",
    address: "Calle Principal 123",
  },
  {
    id: 3,
    site: "Zip Calpules - Almacén Central",
    buildingOwner: "María Rodríguez",
    email: "maria@example.com",
    phone: "987-654-3210",
    address: "Avenida Central 456",
  },
]

export default function SiteManagement() {
  const [selectedSites, setSelectedSites] = useState<number[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(2025, 3, 1), // Abril 1, 2025
    to: new Date(2025, 4, 23), // Mayo 23, 2025
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState("10")

  // Filtrar sitios basados en el término de búsqueda
  const filteredSites = sitesData.filter((site) => site.site.toLowerCase().includes(searchTerm.toLowerCase()))

  // Manejar selección de sitios
  const handleSelectSite = (id: number) => {
    setSelectedSites((prev) => (prev.includes(id) ? prev.filter((siteId) => siteId !== id) : [...prev, id]))
  }

  // Manejar selección de todos los sitios
  const handleSelectAll = () => {
    if (selectedSites.length === filteredSites.length) {
      setSelectedSites([])
    } else {
      setSelectedSites(filteredSites.map((site) => site.id))
    }
  }

  // Función para exportar datos
  const handleExport = (format: "pdf" | "excel" | "csv") => {
    // Aquí implementarías la lógica real de exportación
    console.log(`Exportando en formato ${format}...`)
    alert(`Datos exportados en formato ${format}`)
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        {/* Encabezado */}
        <div className="flex items-center mb-4">
          <ChevronLeft className="h-5 w-5 text-gray-500 mr-2" />
          <h1 className="text-xl font-medium">
            ZIP Calpules / <span className="font-bold">ZIP Calpules</span>
          </h1>
          <Button variant="ghost" size="icon" className="ml-2">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-gray-500 mb-6">Manage your sites</p>

        {/* Controles */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search site..."
              className="w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center">
              <span className="mr-2 text-sm whitespace-nowrap">Show</span>
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <span className="block text-sm mb-1 text-gray-500">Filter by date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM dd, yyyy", { locale: es })} -{" "}
                          {format(dateRange.to, "MMM dd, yyyy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy", { locale: es })
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        // setDateRange(range)
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="self-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Export</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export as Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export as CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredSites.length > 0 && selectedSites.length === filteredSites.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Building owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No sites found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSites.includes(site.id)}
                        onCheckedChange={() => handleSelectSite(site.id)}
                        aria-label={`Select ${site.site}`}
                      />
                    </TableCell>
                    <TableCell>{site.site}</TableCell>
                    <TableCell>{site.buildingOwner}</TableCell>
                    <TableCell>{site.email}</TableCell>
                    <TableCell>{site.phone}</TableCell>
                    <TableCell>{site.address}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pie de página */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {selectedSites.length} of {filteredSites.length} row(s) selected.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={filteredSites.length === 0}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredSites.length === 0}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
