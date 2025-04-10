"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, LogOut, User, Settings } from "lucide-react"
import Image from "next/image"

// Sample customer data
const customers = [
  { id: 1, name: "Juan Pérez", image: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "María González", image: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Carlos Rodríguez", image: "/placeholder.svg?height=100&width=100" },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (


    <div className="container px-4 mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Customers</h2>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-100">
                  <Image
                    src={customer.image || "/placeholder.svg"}
                    alt={`${customer.name}'s profile`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium">{customer.name}</h3>
                <p className="text-sm text-gray-500">Customer #{customer.id}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found matching your search.</p>
        </div>
      )}
    </div>

  )
}
