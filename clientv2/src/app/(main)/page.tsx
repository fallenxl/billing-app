"use client"
import { TenantHome } from "@/components/tenant-admin/home"
import { useUserStore } from "@/stores"
import { CustomerBranchList } from "./customer/customer-branch-list"
import { use, useEffect, useState } from "react"
import { ICustomer } from "@/interfaces"
import CustomerPage from "./customer/[id]/page"

export default function HomePage() {
    const { user } = useUserStore(state => state)

    return (
        <>
        {user?.authority === 'TENANT_ADMIN'? <TenantHome /> : <CustomerPage />}
        </>
    )
}