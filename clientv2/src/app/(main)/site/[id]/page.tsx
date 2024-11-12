"use client"
import { getSiteService } from "@/services"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
    const { id } = useParams()
    useEffect(() => {
        (async () => {
            if (typeof id !== "string") return
            const response = await getSiteService({ id })
            console.log(response)
        })()
    }, [])
    return (
        <div>
            <h1>Page</h1>
        </div>
    )
}