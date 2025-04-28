"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  progress?: number
  message?: string
  onComplete?: () => void
}

export function LoadingOverlay({
  isLoading,
  progress = 0,
  message = "Sincronizando datos...",
  onComplete,
}: LoadingOverlayProps) {
  // const [value, setValue] = useState(progress)

  // useEffect(() => {
  //   setValue(progress)

  //   if (progress >= 100 && onComplete) {
  //     const timer = setTimeout(() => {
  //       onComplete()
  //     }, 500)

  //     return () => clearTimeout(timer)
  //   }
  // }, [progress, onComplete])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center ">
      <div className="w-full max-w-md rounded-lg  p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">{message}</h2>
          <div className="w-full space-y-2">
            {/* <Progress value={value} className="h-2 w-full" /> */}
            {/* <p className="text-right text-sm text-muted-foreground">{Math.round(value)}%</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
