"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { useDataStore } from "@/stores"

export function AppBreadcrumb() {
  const pathname = usePathname()
  const router = useRouter()
  const paths = pathname.split("/").filter(Boolean)

  const { customersSelected } = useDataStore()

  let customerName: string | undefined
  let siteName: string | undefined

  const breadcrumbItems = paths.map((path, index) => {
    const isLast = index === paths.length - 1
    const prev = paths[index - 1]
    const href = "/" + paths.slice(0, index + 1).join("/")

    if (prev === "customer") {
      const customer = customersSelected.find(c => c.id.id === path)
      if (customer) customerName = customer.name
    }

    if (prev === "site") {
      for (const customer of customersSelected) {
        const site = customer.sites?.find(s => s.id === path)
        if (site) siteName = site.name
      }
    }

    const isUUID = prev === "customer" || prev === "site"
    const show = isUUID || (path !== "customer" && path !== "site")
    if (!show) return null

    const label = customerName && prev === "customer"
      ? customerName
      : siteName && prev === "site"
        ? siteName
        : path

    return (
      <div key={index} className="flex items-center">
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="hidden md:block">
          {isLast ? (
            <BreadcrumbPage>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink onClick={() => router.push(href)} className="cursor-pointer">
              <span className="text-sm font-medium">{label}</span>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </div>
    )
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink onClick={() => router.push("/")} className="cursor-pointer">
            <span className="text-sm font-medium text-muted-foreground">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
