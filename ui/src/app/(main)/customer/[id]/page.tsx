"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ICustomer, ISite } from "@/interfaces";
import { useDataStore } from "@/stores";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchSitesByCustomerId, fetchCustomerById, customers } = useDataStore()
  const [sites, setSites] = useState<ISite[] | null>(customers?.find(customer => customer.id.id === id)?.sites || null)
  const [customer, setCustomer] = useState<ICustomer | null>(customers?.find(customer => customer.id.id === id) || null)
  const [searchTerm, setSearchTerm] = useState("")
  const filteredSites = sites?.filter((site) =>
    site.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const fetchData = async () => {
      if (typeof id === 'string') {
        const [customer, sites] = await Promise.all([
          fetchCustomerById(id),
          fetchSitesByCustomerId(id)
        ]);
        setSites(sites);
        setCustomer(customer);

      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="container px-4 mx-auto">
      <div className="mb-8">
        {
          !customer ? (
            <Skeleton className="h-8 w-1/3 mb-2" />
          ) : (
            <h1 className="text-2xl font-semibold">{customer.name}</h1>
          )}

        <small className="text-gray-500">
          Manage your sites and their billing information.
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

      {/* sites cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!filteredSites && (
          [...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-20 w-20 rounded-sm mb-3" />
                  <Skeleton className="h-4 w-24 mb-2" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {filteredSites && filteredSites.map((site) => (
          <Card key={site.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/customer/${id}/site/${site.id}`)}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-sm overflow-hidden mb-3 bg-gray-100">
                  <img
                    src={customer?.img || `https://api.dicebear.com/9.x/initials/svg?seed=${site.name}`}
                    alt={`${site.name}'s profile`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium">{site.name}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSites?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sites found matching your search.</p>
        </div>
      )}
    </div>
  );
}