"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, InfoIcon, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useCustomersStore } from "@/stores"
import { ICustomer, ILocal, ISite } from "@/interfaces"
import { DataTable } from "@/components/data-table"
import { localsColumns } from "./columns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RangeDatePicker from "@/components/range-date-picker"
import { DateRange } from "react-day-picker"
import { addDays, endOfMonth, startOfMonth } from "date-fns"

interface SiteManagementProps {
  customer: ICustomer | null
  site: ISite | null
  locals: ILocal[] | null
}
export default function SiteManagement() {
  const router = useRouter()
  const { id, siteId } = useParams()
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: addDays(endOfMonth(new Date()), 1),
  })
  const [states, setStates] = useState<SiteManagementProps>({
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
    <div className="container mx-auto p-4 max-w-screen-2xl">
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
        <DataTable data={states.locals || []} columns={localsColumns} toggleColumns={false} >
          <div className="w-full flex items-center justify-end">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The date range is set to the current month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <RangeDatePicker date={date} setDate={setDate} />
            </div>
            <Button variant="outline" size="sm" className="ml-2">
              Export
            </Button>



          </div>
        </DataTable>
      </div>


    </div>
  )
}
