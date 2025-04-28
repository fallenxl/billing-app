import * as React from "react"
import { LifeBuoy, Send, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


export function NavSupport({
  ...props
}: & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
            <SidebarMenuItem >
              <SidebarMenuButton asChild size="sm">
                <a href={"#"} className="">
                  <LifeBuoy className="size-4" />
                  <span>Support</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem >
              <SidebarMenuButton asChild size="sm">
                <a href={"#"} className="">
                  <Send className="size-4" />
                  <span>Feedback</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
