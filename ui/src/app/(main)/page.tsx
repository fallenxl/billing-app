"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {  Search} from "lucide-react"
import { useAuthStore, useDataStore } from "@/stores"
import { RoleGuard } from "@/guards/role.guard"
import { ROLES } from "@/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomerCard } from "@/components/customer-card"


export default function Home() {
  const { user } = useAuthStore()
  const { customers} = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const filteredCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  useEffect(() => {
    if(customers){
      setLoading(false)
    }
  }, [customers])

  return (


    <RoleGuard roles={[ROLES.TENANT_ADMIN]} redirect={true} path={`/customer/${user?.customerId}`}>
      <div className="p-4 mx-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {loading && (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 h-32">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="flex flex-col">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
          {!loading && filteredCustomers?.map((customer) => (
            <div key={customer.id.id} className={`${!customer.sitesGroup && "opacity-50"}  overflow-hidden hover:shadow-md transition-shadow cursor-pointer`} >
              <CustomerCard {...customer} />
            </div>
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


