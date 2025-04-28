"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, InfoIcon, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { LocalsOptions, useDataStore } from "@/stores"
import { ICustomer, ILocal, ISite, LocalsData } from "@/interfaces"
import { DataTable } from "@/components/data-table"
import { localsColumns } from "./columns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RangeDatePicker from "@/components/range-date-picker"
import { DateRange } from "react-day-picker"
import { addDays, endOfMonth, startOfMonth } from "date-fns"
import { LocalEditDialog } from "./local-edit-dialog"
import ExportModal from "./export-modal"
import { useLocalsStore } from "@/stores/local.store"

interface SiteManagementProps {
  customer: ICustomer | null
  site: ISite | null
  locals: LocalsData | null
}
export default function SiteManagement() {
  const router = useRouter()
  const { id, siteId } = useParams()
  const { localsSelected } = useLocalsStore()
  const [editLocal, setEditLocal] = useState<ILocal | null>(null)
  const [openEditLocal, setOpenEditLocal] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: addDays(endOfMonth(new Date()), 1),
  })
  const [states, setStates] = useState<SiteManagementProps>({
    customer: null,
    site: null,
    locals: null,
  })
  const { fetchLocalsByCustomerAndSiteId, fetchLocalsBySiteId } = useDataStore()

  useEffect(() => {
    fetchLocalsByCustomerAndSiteId(id as string, siteId as string).then((states) => {
      const [customer, site, locals] = states
      setStates({ customer, site, locals })
    })
  }, [id, siteId, fetchLocalsByCustomerAndSiteId])
  return (
    <div className="  p-4 ">
      <div className="bg-white border shadow-sm p-6">
        {/* Encabezado */}
        <div className="flex items-center">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5 text-gray-500 " />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">
              {states.customer?.name} / <span className="font-bold">{states.site?.name}</span>

            </h1>

          </div>
          <Button variant="ghost" size="icon" className="ml-2">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <small className="text-neutral-600 ml-10">
          Manage your site and locals
        </small>
        <DataTable data={{
          data: states.locals?.locals || [],
          hasNext: states.locals?.hasNext || false,
          totalElements: states.locals?.totalElements || 0,
          totalPages: states.locals?.totalPages || 0,
        }}

          searchOptions={
            {
              column: ["label", "email", "name"], placeholder: "Filter locals..."
            }
          }
        columns={localsColumns({
          editLocalAction: (local: ILocal) => {
            setEditLocal(local)
            setOpenEditLocal(true)
          },
        })} toggleColumns={false} >
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
          <ExportModal localsSelected={localsSelected} />

        </div>
      </DataTable>
    </div>
      { editLocal && <LocalEditDialog local={editLocal} onSave={(updatedLocal) => { }} open={openEditLocal} setOpen={setOpenEditLocal} /> }
    </div >
  )
}
