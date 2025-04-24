"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useAuthStore, useDataStore } from "@/stores"
import { RoleGuard } from "@/guards/role.guard"
import { ROLES } from "@/constants"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"


export default function Home() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { customers, fetchCustomers } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const filteredCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    (async () => {
      if (!customers) {
        await fetchCustomers()
      }
      setLoading(false)
    })()
  }, [])
  return (


    <RoleGuard roles={[ROLES.TENANT_ADMIN]} redirect={true} path={`/customer/${user?.customerId}`}>
      <div className="container px-4 mx-auto">
        <div className="mb-8">

          <h1 className="text-2xl font-semibold">Customers</h1>


          <small className="text-gray-500">
            Manage your customers and their billing information.
          </small>
          <div className="relative max-w-md mt-5">
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
          {loading && (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <Skeleton className="h-20 w-20 rounded-sm mb-3" />
                      <Skeleton className="h-4 w-24 mb-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
          {!loading && filteredCustomers?.map((customer) => (
            <Card key={customer.id.id} className={`${!customer.sitesGroup && "opacity-50"}  overflow-hidden hover:shadow-md transition-shadow cursor-pointer`} onClick={() => customer.sitesGroup && router.push(`/customer/${customer.id.id}`)}>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-sm overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={customer.img || `https://api.dicebear.com/9.x/initials/svg?seed=${customer.name}`}
                      alt={`${customer.name}'s profile`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{customer.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found matching your search.</p>
          </div>
        )}
      </div>
    </RoleGuard>

  )
}
