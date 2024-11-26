"use client"
import { getCustomersService } from "@/services/customer.service";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Search } from "lucide-react";
import IconInput from "../ui/icon-input";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export function TenantHome() {
    const router = useRouter();
    const [customerGroups, setCustomerGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getCustomersService().then(res => {
            setIsLoading(false);
            if (res.success) {
                setCustomerGroups(res.data);
            }
        });
    }, []);

    // Memoriza el resultado del filtro de clientes para evitar cálculos innecesarios
    const filteredCustomers = useMemo(() => {
        return customerGroups.filter((customer: any) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customerGroups, searchTerm]);

    return (
        <div>
            <div>
                <h3 className="text-2xl font-bold">Customers</h3>
                <small className="dark:text-neutral-400">Manage your customers</small>
                <div className="max-w-md mt-5">
                    <IconInput
                        icon={<Search className="h-4 w-4" />}
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                {isLoading && Array.from({ length: 4 }).map((_, n) => (
                    <Skeleton key={n} className="h-36 w-full md:w-[300px]" />
                ))}
                {(filteredCustomers.length > 0 && !isLoading) ? filteredCustomers.map((customer: any, index: number) => (
                    <Card key={index} className="py-5 flex items-center justify-center gap-5 cursor-pointer hover:scale-105 duration-300 dark:bg-neutral-900"
                        onClick={() => router.push(`/customer/${customer.id.id}`)}
                    >
                        <CardContent className="p-0">
                            <img src={customer.img} alt="" className="w-20 h-20 object-contain" />
                        </CardContent>
                        <CardFooter className="p-0">
                            <CardTitle>{customer.name}</CardTitle>
                        </CardFooter>
                    </Card>
                )) : (
                    <div className="text-center col-span-4 flex items-center justify-center py-20">
                        <p className="text-neutral-400 dark:text-neutral-500">No customers found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
