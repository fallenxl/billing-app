"use client"
import { ExportAdditionalCharges } from "@/components/export/export-charges"
import { LocalSettings } from "@/components/settings/local-settings"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ILocal, } from "@/interfaces/local.interface"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"


export function Columns(): ColumnDef<ILocal>[] {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
    ,
    {
      accessorKey: "toName",
      header: () => <></>,
      cell: () => <></>,
    },
    {
      accessorKey: "label",
      header: "Site",
      cell: ({ row }) => (
        <div className="capitalize min-w-[200px]">{row.getValue("label") ?? row.getValue("toName")}</div>),

    },
    {
      accessorKey: "buildingOwner",
      header: "Building owner",
      cell: ({ row }) => <div>{row.getValue("buildingOwner") || "-"}</div>,
      enableHiding: false,
    },    // email
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div
        title={row.getValue("email") || "-"}
        className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
      >{row.getValue("email") || "-"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone") || "-"}</div>,
    },
    {
      accessorKey: "address",
      header: () => <div className="hidden md:block">Address</div>,
      cell: ({ row }) => <div
        title={row.getValue("address") || "-"}
        className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
      >{row.getValue("address") || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => {
        const local = row.original as ILocal

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(local.label || local.toName)}
              >
                Copy local name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LocalSettings local={local} />
              <ExportAdditionalCharges local={local}
                button={<Button variant="ghost" className="w-full flex justify-start items-center text-left p-0 px-2 rounded-sm text-sm font-normal">
                  Edit charges
                </Button>}
              />

            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}