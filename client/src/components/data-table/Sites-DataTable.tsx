import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { IRelation } from "../../interfaces/relation/relation.interface";
import { DataTable } from "./DataTable";
import { Button } from "../ui/button";
import {  MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";


export const columns: ColumnDef<IRelation>[] = [
    {
        id: "select",
        header: ({ table }: any) => (

            <input type="checkbox"  

            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            aria-label="Select all"
            />
        ),
        cell: ({ row }: any) => (
            <input type="checkbox"  
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "label",
        header: "Name",
        cell: ({ row }: any) => (
            <div className="capitalize">{row.getValue("label")}</div>
        ),
    },
    // {
    //     accessorKey: "email",
    //     header: ({ column }: any) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Email
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }: any) => <div className="lowercase">{row.getValue("email")}</div>,
    // },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: () => {
            return (
                <DropdownMenu >
                    <DropdownMenuTrigger asChild >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-md border border-gray-200 ">
                        <DropdownMenuLabel className=" py-1  text-xs font-bold px-4">Actions</DropdownMenuLabel>

                        
                        <DropdownMenuSeparator className=" border-b border-gray-200" />
                        <DropdownMenuItem
                            // onClick={() => navigator.clipboard.writeText(payment.id)}
                            className="px-4 py-1 cursor-pointer hover:bg-gray-100"
                        >View site</DropdownMenuItem>
                        </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]


interface SitesDataTableProps {
    data: IRelation[]
}

export function SitesDataTable({ data }: SitesDataTableProps) {
    return <>
        <DataTable data={data} columns={columns} exportData/>
    </>
}