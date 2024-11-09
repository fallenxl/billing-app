"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

interface IconInputProps {
  placeholder?: string
  icon?: React.ReactNode
  onChange?: (e: any) => void
  value?: string
}

export default function IconInput({ 
  placeholder = "Search...", 
  icon = <Search className="h-4 w-4" />,
  onChange,
  value
}: IconInputProps) {


  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-8"
      />
      <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
    </div>
  )
}