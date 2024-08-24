"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { CalendarDays, ChevronDown, X } from "lucide-react"

import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { ExportDataService } from "../../services/data/data.services"
import { useDispatch, useSelector } from "react-redux"
import { AppState } from "../../interfaces/app-state/app-state"
import { IExportData } from "../../interfaces/data/data.interfaces"
import { IRelation } from "../../interfaces/relation/relation.interface"
import { setIsLoading } from "../../store/slices/is-loading.slice"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
interface DataTableProps {
  data: any[]
  columns: ColumnDef<any>[]
  exportData?: boolean
}
export function DataTable({ data, columns, exportData }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const customer = useSelector((state: AppState) => state.customer)
  const branch = useSelector((state: AppState) => state.branch)
  const dispatch = useDispatch()

  function handleExport(type: 'pdf' | 'excel' | 'support') {
    const firsDateOfTheMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(0, 0, 0, 0)
    // get hours, minutes, seconds, and milliseconds

    
   const startDateTs = startDate ? new Date(dateRange[0]).getTime() : firsDateOfTheMonth
    const endDateTs = endDate ? new Date(dateRange[1]).getTime() : new Date().getTime()
    console.log(branch)
    const data: IExportData = {
      format: type,
      img: customer?.img,
      startDateTs,
      endDateTs,
      customer: customer?.name ?? '',
      branch: branch?.toName ?? '',
      currency: branch?.settings.currency ?? 'LPS',
      rate: branch?.settings.rate ??{
        water: 0.324,
        energy: 6.23,
        gas: 0.324,
        air: 0.324,
        hotWater: 0.324
      },
      units: {
        water: 'm3',
        energy: 'kWh',
        gas: 'm3',
        air: 'm3'
      },
      selectedDevices: table.getSelectedRowModel().rows.map((row) => row.original) as IRelation[]
    }
    dispatch(setIsLoading({
      isLoading: true,
      message: 'Exporting data'
    }))
    ExportDataService(data).then((_response) => {
      dispatch(setIsLoading({
        isLoading: false,
        message: ''
      }))
    })
  }

  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [calendarVisible, setCalendarVisible] = React.useState(false);
  const [dateRange, setDateRange] = React.useState([new Date(), new Date()]);
  // const [isOpened, setIsOpened] = React.useState(false);
  const formatDate = (date: any) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  React.useEffect(() => {
    setCalendarVisible(false);
  }, [dateRange]);

  const handleDateChange = (range: any) => {
    setDateRange(range);
    setStartDate(formatDate(range[0]));
    setEndDate(formatDate(range[1]));
  };

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  return (
    <div className="w-full bg-white py-4 px-6 rounded">
      <div className="flex flex-col  gap-1">
        <h1 className="text-2xl font-semibold text-gray-600">Sites</h1>
        <small className="text-sm text-muted-foreground">
          Here are the sites that are currently active.
        </small>
      </div>
      <div className="flex flex-col lg:flex-row items-center w-full justify-between py-4">
        <Input
          placeholder="Filter sites..."
          value={(table.getColumn("label")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("label")?.setFilterValue(event.target.value)
          }
          className="lg:max-w-sm outline-none focus:ring-transparent "
        />

        <div className="flex  flex-col md:flex-row  items-center gap-3 w-full">
          {exportData && (
            <>
                <div className="flex items-center relative w-full self-end justify-end">
              <div className="flex items-center gap-2 relative w-full self-end justify-end py-2 ">
                <span className="text-gray-500 gap-2 text-xs hidden xl:block">Filter by date</span>
                <div className="border border-gray-300 rounded-md flex items-center w-full lg:w-auto cursor-pointer" onClick={toggleCalendar}>
                  <input
                    type="text"
                    className=" rounded-md px-3 py-[.4rem] outline-none  cursor-pointer w-full lg:w-[11.5rem] flex-grow "
                    value={`${startDate} - ${endDate}`}
                    readOnly
                  />
                  {(startDate && endDate) && (
                    <>
                    <X className="w-4 h-4 mr-3" onClick={() => {
                      setDateRange([]);
                      setStartDate('');
                      setEndDate('');
                    }} />
                    </>
                  )}
                  <CalendarDays className="w-4 h-4 mr-3" />
                  
                </div>
                {calendarVisible && (
                  <Calendar
                    selectRange
                    onChange={handleDateChange}
                    className={"absolute w-[20rem] top-[1rem] left-1 z-[100] scale-[.85] "}
                    
                    value={dateRange as any}
                  />
                )}
              </div>
            </div>
              <DropdownMenu >
                <DropdownMenuTrigger asChild disabled={table.getSelectedRowModel().rows.length === 0}>
                  <Button variant="outline" className="ml-auto w-full lg:w-auto">
                    Export <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('pdf')}
                    className="cursor-pointer">Export PDF</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport('excel')}
                    className="cursor-pointer">Export Excel</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport('support')}
                    className="cursor-pointer">Export Support</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full lg:w-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.header as string}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
