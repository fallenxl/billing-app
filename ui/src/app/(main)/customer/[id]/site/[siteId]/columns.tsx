import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ILocal } from "@/interfaces"
import { useLocalsStore } from "@/stores"
import { ColumnDef, Table } from "@tanstack/react-table"
import { table } from "console"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

interface ILocalsColumns {
    editLocalAction: (local: ILocal) => void
}
export const localsColumns = (
    { editLocalAction }: ILocalsColumns
): ColumnDef<ILocal>[] => {
    const {addLocal, removeLocal, localsSelected} = useLocalsStore()

    const isSelected = (row: ILocal) => {
        return localsSelected.some((local) => local.id.id === row.id.id)
    }
    const toggleSelected = (row: ILocal) => {
        if (isSelected(row)) {
            removeLocal(row.id.id)
        } else {
            addLocal(row)
        }
    }

    const isSelectedAll = (table: Table<ILocal>) => {
        return table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
    }
    const toggleSelectedAll = ( table: Table<ILocal>) => {
        if (isSelectedAll(table)) {
            table.toggleAllPageRowsSelected(false)
            localsSelected.forEach((local) => removeLocal(local.id.id))
        } else {
            table.toggleAllPageRowsSelected(true)
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
                    onCheckedChange={(value) => toggleSelectedAll(table)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={isSelected(row.original)}
                    onCheckedChange={() => toggleSelected(row.original)}
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
