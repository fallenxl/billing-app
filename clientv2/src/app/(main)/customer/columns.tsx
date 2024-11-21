"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { IBranch } from "@/interfaces"
import { ILocal, ILocalUpdate } from "@/interfaces/local.interface"
import { updateLocalService } from "@/services"
import { useBranchStore } from "@/stores"
import { useCustomerStore } from "@/stores/customer-store"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ColumnDef, useReactTable } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React, { useEffect } from "react"
import { toast } from "sonner"

interface EditRowProps {
  local: ILocal
}
function EditRow({ local }: EditRowProps) {
  const [updatedBranch, setUpdatedBranch] = React.useState<ILocal>(local)
  const [hasChanges, setHasChanges] = React.useState(false)
  const { branchRelations, setBranchRelations, branch } = useBranchStore(state => state)
  const {customer} = useCustomerStore(state => state)
  useEffect(() => {
    setHasChanges(JSON.stringify(updatedBranch) !== JSON.stringify(local))
  }, [updatedBranch])
  function handleSave() {
    const payload: ILocalUpdate = {
      id: {
        entityType: local.to.entityType,
        id: local.to.id,
      },
      customerId: customer?.id!,
      name: updatedBranch.toName,
      label: updatedBranch.label,
      address: updatedBranch.address,
      phone: updatedBranch.phone,
      email: updatedBranch.email,
    }
    updateLocalService({ id: payload.id.id, data: payload }).then(response => {
      if (response.success) {
        const updatedBranches = branchRelations.map(b => {
          if (b.id === updatedBranch.id) {
            return updatedBranch
          }
          return b
        })
        setBranchRelations(updatedBranches as ILocal[])
        document.getElementById("close-local-edit-sheet")?.click()
        toast.success(response.message)
      }
    })
   
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedBranch({
      ...updatedBranch,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-start items-center text-left p-0 px-2 rounded-sm text-sm font-normal">
            Edit site
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full md:min-w-[800px]"> {/* Ajuste del tamaño del Sheet */}
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-start space-y-4 py-5">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="label" >
                Name
              </Label>
              <Input name="label"
                placeholder="ex. Local name"
                value={updatedBranch.label || updatedBranch.toName} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="phone" >
                Phone
              </Label>
              <Input
                placeholder="ex. 1234567890"
                name="phone" value={updatedBranch.phone} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="email" >
                Email
              </Label>
              <Input
                placeholder="ex. example@lumenbilling.com"
                name="email" value={updatedBranch.email} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="address" >
                Address
              </Label>
              <Input
                placeholder="ex. 1234 Main St, City, State, Zip"
                name="address" value={updatedBranch.address} onChange={handleInputChange} />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="ghost" className="sr-only" 
              id="close-local-edit-sheet"
              >
                Cancel
              </Button>
            </SheetClose>
            <Button onClick={handleSave} type="button" className="w-full" disabled={!hasChanges}>
                Save changes
              </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
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
    // email
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email") || "-"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone") || "-"}</div>,
    },
    {
      accessorKey: "address",
      header: () => <div className="hidden md:block">Address</div>,
      cell: ({ row }) => <div className="hidden md:block text-wrap">{row.getValue("address") || "-"}</div>,
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
              <EditRow local={local} />

            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}