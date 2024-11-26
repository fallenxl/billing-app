"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import IconInput from "@/components/ui/icon-input";
import { Skeleton } from "@/components/ui/skeleton";
import { ICustomer, IBranch } from "@/interfaces";
import { useBranchStore } from "@/stores/branch-store";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export function CustomerBranchList({ customer, relations, isLoading }: { customer: ICustomer, relations: IBranch[], isLoading: boolean }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Memoriza el resultado del filtro de relaciones
    const filteredRelations = useMemo(() => {
        return relations?.filter((relation: IBranch) =>
            relation.toName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [relations, searchTerm]);

    const { setBranch } = useBranchStore(state => state);

    function handleBranchClick(branchId: IBranch) {
        setBranch(branchId);
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('branch', branchId.id);
        window.history.pushState({}, '', `${window.location.pathname}?${urlSearchParams.toString()}`);
    }

    return (
        <div>
            <div>
                <h1 className="text-3xl md:text-4xl font-bold">{customer?.name}</h1>
                <small className="text-neutral-400">Manage your branches and sites</small>
                <div className="max-w-md mt-5">
                    <IconInput
                        icon={<Search className="h-4 w-4" />}
                        placeholder="Search branches and sites..."
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {isLoading && [...Array(4)].map((_, n) => (
                    <Skeleton key={n} className="h-36 md:w-[300px]" />
                ))}
                {!isLoading && filteredRelations && filteredRelations.length > 0 && filteredRelations.map((relation, index) => (
                    <Card key={index} className="py-5 flex items-center justify-center gap-5 cursor-pointer hover:scale-105 duration-300"
                        onClick={() => handleBranchClick(relation)}
                    >
                        <CardContent className="p-0">
                            <img src={customer?.img} alt="" className="w-20 h-20 object-contain" />
                        </CardContent>
                        <CardFooter className="p-0 flex flex-col items-start">
                            <CardTitle>{relation.label || relation.toName}</CardTitle>
                            <small className="text-neutral-400">{customer.label || customer.name}</small>
                        </CardFooter>
                    </Card>
                ))}
                {!isLoading && filteredRelations?.length === 0 && (
                    <div className="text-center col-span-4 flex items-center justify-center py-20">
                        <p className="text-neutral-400 dark:text-neutral-500">No branches or sites found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
