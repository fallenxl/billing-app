import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ILocal } from "@/interfaces"
import { useLocalsStore } from "@/stores"
import { CheckedState } from "@radix-ui/react-checkbox"
import { ColumnDef, Row, Table } from "@tanstack/react-table"
import { table } from "console"
import { ro } from "date-fns/locale"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

interface ILocalsColumns {
    editLocalAction: (local: ILocal) => void
}
export const localsColumns = (
    { editLocalAction }: ILocalsColumns
): ColumnDef<ILocal>[] => {
    const {addLocal, removeLocal, localsSelected, resetLocals} = useLocalsStore()

    const isSelected = (row: Row<ILocal>) => {
        return row.getIsSelected()
        // return localsSelected.some((local) => local.id.id === row.original.id.id)
    }
    const toggleSelected = (row: Row<ILocal>) => {
        const existLocal = localsSelected.find((local) => local.id === row.original.id)
        row.toggleSelected(!row.getIsSelected())
        if (existLocal) {
            removeLocal(row.original.id)
        } else {
            addLocal(row.original)
        }7
    }

    const isSelectedAll = (table: Table<ILocal>) => {
        return table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    const toggleSelectedAll = ( table: Table<ILocal>, value:CheckedState) => {
        if (table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()) {
            table.toggleAllPageRowsSelected(!!value)
            table.getRowModel().rows.forEach((row) => removeLocal(row.original.id))
        } else {
            table.toggleAllPageRowsSelected(!!value)
            table.getRowModel().rows.forEach((row) => addLocal(row.original))
        }
    }
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        isSelectedAll(table)
                    }
                    onCheckedChange={(value) => toggleSelectedAll(table, value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={isSelected(row)}
                    onCheckedChange={() => toggleSelected(row)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => {},
            cell: () => {}
        },
        {
            accessorKey: "label",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-left "
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Local
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="text-left">{row.getValue("label") || row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-left"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "buildingOwner",
            header: () => <div className="text-left">Building Owner</div>,
            cell: ({ row }) => (
                <div className="text-left">{row.getValue("buildingOwner")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            disabled
                            >Change name</DropdownMenuItem>
                            <DropdownMenuItem
                            disabled
                                onClick={() => editLocalAction(row.original)}
                            >View details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
}
