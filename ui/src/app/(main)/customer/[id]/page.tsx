"use client";

import { SiteCard } from "@/components/site-card";
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
  const { fetchSitesByCustomerId, fetchCustomerById, customers, customersSelected } = useDataStore()
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

  useEffect(() => {
    if (customersSelected && customersSelected.length > 0) {
      
      setSites(customersSelected?.find(customer => customer.id.id === id)?.sites || null)
    }
  }, [customersSelected])
  return (
    <div className=" p-4 mx-auto">
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
          <div key={site.id} className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer`} >
            <SiteCard site={site} customer={customer!} />
          </div>
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