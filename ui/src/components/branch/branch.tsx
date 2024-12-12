import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Columns } from "../../app/(main)/customer/columns";
import DatePickerWithRange from "@/components/ui/date-range";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportDataService } from "@/services/export.service";
import { useEffect, useMemo, useState } from "react";
import { LoadingProcess } from "@/components/loadings/loading-process";
import { toast } from "sonner";
import { ICustomer } from "@/interfaces";
import { useBranchStore } from "@/stores";
import { ILocal } from "@/interfaces/local.interface";
import { BranchSettings } from "../settings/branch-settings";
import { ExportModal } from "../export/export-modal";

export function Branch({ customer, isLoading }: { customer: ICustomer, isLoading: boolean }) {
    const router = useRouter()
    const { branch, branchRelations } = useBranchStore(state => state)
    const [isLoadingExport, setIsLoadingExport] = useState(false)
    const [selectedSites, setSelectedSites] = useState<ILocal[]>([])

    // Memoriza las columnas si no cambian
    const columns = useMemo(() => Columns(), []);

    const initialDates = useMemo(() => ({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(0, 0, 0, 0),
        endDate: new Date().setHours(0, 0, 0, 0)
    }), []);

    const [dates, setDates] = useState<{ startDate: number, endDate: number }>(initialDates);

    function handleDateChange(startDate?: Date, endDate?: Date) {
        if (startDate && endDate) {
            setDates({
                startDate: startDate.setHours(0, 0, 0, 0),
                endDate: endDate.setHours(0, 0, 0, 0)
            });
        }
    }





    return (
        <>
            {isLoadingExport && <LoadingProcess />}

            <div className="md:rounded-md md:border md:p-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <span onClick={() => router.back()} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer">
                            <ChevronLeft />
                        </span>
                        <h1 className="text-xl md:text-3xl font-bold">
                            <span className="text-neutral-500 dark:text-neutral-400">{customer.label || customer.name} / </span>
                            {branch?.label || branch?.toName}
                        </h1>
                        <div className="text-neutral-400">
                            <BranchSettings />
                        </div>
                    </div>
                    <small className="text-neutral-400 ml-9">Manage your sites</small>
                </div>

                <div className="md:ml-9">
                    <DataTable columns={columns} data={branchRelations} showColumns={false} searchPlaceholder="Search site..." setSelectedRows={setSelectedSites} isLoading={isLoading}>
                        <div className="flex flex-col items-start gap-2 w-full md:w-auto">
                            <small className="text-neutral-400">Filter by date</small>
                            <div className="flex items-center gap-2 w-full">
                                <DatePickerWithRange onDateChange={handleDateChange} />

                                <ExportModal exportDisabled={selectedSites.length === 0} branch={branch!} dates={dates} customer={customer!} endDateTs={dates.endDate} startDateTs={dates.startDate} selectedDevices={selectedSites} />

                            </div>
                        </div>
                    </DataTable>
                </div>
            </div>
        </>
    );
}