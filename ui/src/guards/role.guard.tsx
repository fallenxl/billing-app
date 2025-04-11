"use client"

import { LoadingPage } from "@/components/loading-page"
import { useAuthStore } from "@/stores"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function RoleGuard({
    children,
    roles = [],
    redirect = false,
    path = "/auth/login"
}: {
    children: React.ReactNode,
    roles: string[],
    redirect?: boolean,
    path?: string
}) {

    const navigate = useRouter()
    const { user } = useAuthStore()
    const [hasAccess, setHasAccess] = useState<boolean | null>(null)

    useEffect(() => {
        if (user) {
            
            const hasRole = roles.some((role) => user.scopes.includes(role))
            setHasAccess(hasRole)
        } else {
            setHasAccess(false)
        }
    }, [user, roles])

    if (hasAccess === null) {
        return <LoadingPage />
    }
    if (!hasAccess && redirect) {
        navigate.replace(path)
        return <LoadingPage />
    }
    if (!hasAccess && !redirect) {
        return <div className="text-red-500">Access Denied</div>
    }
    return <>{children}</>
        
}