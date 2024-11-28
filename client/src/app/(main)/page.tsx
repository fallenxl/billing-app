"use client"
import { TenantHome } from "@/components/homes/tenant-home"
import { useUserStore } from "@/stores"
import CustomerPage from "./customer/[id]/page"

export default function HomePage() {
    const { user } = useUserStore(state => state)

    return (
        <>
        {user?.authority === 'TENANT_ADMIN'? <TenantHome /> : <CustomerPage />}
        </>
    )
}