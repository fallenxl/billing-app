"use client"

import { LoadingPage } from "@/components/loading-page"
import { useAuthStore } from "@/stores"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthGuard({
    children,
}: {
    children: React.ReactNode
}) {
    const navigate = useRouter()
    const { refresh, isAuthenticated } = useAuthStore()
    useEffect(() => {
        (async () => {
            try {
                await refresh()
            } catch (error) {
                navigate.replace("/auth/login")
                console.error("Error refreshing token:", error)
            }
        })()
    },[])
    if (isAuthenticated === null) {
        return <LoadingPage />
    }

    return isAuthenticated && children
        
}