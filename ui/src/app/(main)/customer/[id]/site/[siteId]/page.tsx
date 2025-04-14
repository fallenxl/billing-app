"use client"

import { useEffect, useState } from "react"
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
import { useParams, useRouter } from "next/navigation"
import { useCustomersStore } from "@/stores"
import { ICustomer, ILocal, ISite } from "@/interfaces"

export default function SiteManagement() {
  const router = useRouter()
  const { id, siteId } = useParams()
  const [states, setStates] = useState<
    {
      customer: ICustomer | null
      site: ISite | null
      locals: ILocal[] | null
    }
  >({
    customer: null,
    site: null,
    locals: null,
  })
  const { fetchLocalsByCustomerAndSiteId } = useCustomersStore()
  useEffect(() => {
    fetchLocalsByCustomerAndSiteId(id as string, siteId as string).then((states) => {
      const [customer, site, locals] = states
      setStates({ customer, site, locals })
    })
  }, [id, siteId, fetchLocalsByCustomerAndSiteId])


  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        {/* Encabezado */}
        <div className="flex items-center">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5 text-gray-500 " />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">
              {states.customer?.name} / <span className="font-bold">{states.site?.toName}</span>

            </h1>

          </div>
          <Button variant="ghost" size="icon" className="ml-2">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <small className="text-neutral-600 ml-10">
          Manage your site and locals
        </small>
      </div>
    </div>
  )
}
