"use client"

import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useAuthStore, useDataStore } from "@/stores"
import { ROLES } from "@/constants"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "./ui/avatar"
import { useEffect } from "react"
import {  useRouter } from "next/navigation"

export function NavAdmin() {
  const router = useRouter()

  const { user } = useAuthStore()
  const { customers, fetchCustomers } = useDataStore()
  const isAdmin = user?.scopes.includes(ROLES.TENANT_ADMIN)
  useEffect(() => {
    if (!customers) {
      fetchCustomers()
    }
  }, [])
  return (
    <SidebarGroup>
      {(isAdmin) &&
        <>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>

            <Collapsible defaultOpen={false}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"Customers"}>
                  <span className="flex items-center">
                    Customers
                  </span>
                </SidebarMenuButton>

                {(customers && customers.length > 0) ?
                  <>
                    <CollapsibleTrigger asChild >
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {customers?.map((customer) => (
                          <SidebarMenuSubItem key={customer.id.id} >
                            <SidebarMenuSubButton className={`${customer.sitesGroup ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`} onClick={() => { customer.sitesGroup && router.push(`/customer/${customer.id.id}`) }} >
                              <Avatar className="h-4 w-4 rounded-full">
                                <AvatarImage src={customer.img || `https://api.dicebear.com/9.x/initials/svg?seed=${customer.name}&backgroundColor=00acc1`} alt={customer.name} />
                                <AvatarFallback className="rounded-lg">{customer.name}</AvatarFallback>
                              </Avatar>
                              <span>{customer.name}</span>

                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>

                  </> : null}
              </SidebarMenuItem>
            </Collapsible>

          </SidebarMenu>
        </>
      }
    </SidebarGroup>
  )
}
