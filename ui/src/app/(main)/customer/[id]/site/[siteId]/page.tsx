"use client"

import { useEffect, useState } from "react"
import { InfoIcon, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useDataStore } from "@/stores"
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
import { SiteSettings } from "@/components/site-settings"

interface SiteManagementProps {
  customer: ICustomer | null
  site: ISite | null
  locals: LocalsData | null
}
export default function SiteManagement() {
  const { id, siteId } = useParams()
  const { localsSelected, resetLocals } = useLocalsStore()
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
  const { fetchLocalsByCustomerAndSiteId, fetchSiteById, customersSelected } = useDataStore()

  useEffect(() => {
    resetLocals()
    fetchLocalsByCustomerAndSiteId(id as string, siteId as string).then((states) => {
      const [customer, site, locals] = states
      console.log("Fetched locals:", locals, "for site:", site, "and customer:", customer)
      setStates({ customer, site, locals })
    })
  }, [id, siteId, fetchLocalsByCustomerAndSiteId])

  useEffect(() => {
    fetchSiteById(siteId as string).then((site) => {
      setStates((prev) => ({ ...prev, site }))
    })
  }, [customersSelected])

  return (
    <div className="  md:p-4 ">
      <div className="md:p-6">
        {/* Encabezado */}
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">
              {states.customer?.name} / <span className="font-bold">{states.site?.label || states.site?.name}</span>

            </h1>

          </div>
          {states.site && <SiteSettings site={states.site}
            customBtn={<Button variant="ghost" size="icon" className="ml-2">
              <Settings className="h-5 w-5" />
            </Button>}

          />}

        </div>
        <small className="text-neutral-600 ">
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
          <div className="w-full flex flex-col-reverse md:flex-row  items-end  md:items-center justify-end">
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
            {(states.site && states.customer)&& <ExportModal

              site={states.site}
              customer={states.customer}
              exportData={
                {
                  startDate: date?.from || new Date(),
                  endDate: date?.to || new Date(),
                }
              } />}

          </div>
        </DataTable>
      </div>
      {editLocal && <LocalEditDialog local={editLocal} onSave={(updatedLocal) => { }} open={openEditLocal} setOpen={setOpenEditLocal} />}
    </div >
  )
}
