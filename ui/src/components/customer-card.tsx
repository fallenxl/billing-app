"use client"
import { ICustomer } from "@/interfaces";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Loader, Loader2, MoreHorizontal, RefreshCcw, Trash } from "lucide-react";
import { useSyncStore } from "@/stores";
import { LoadingOverlay } from "./loading-overlay";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";

export function CustomerCard(customer: ICustomer) {
    const router =useRouter()
    const { startCustomerSync, syncInProgress } = useSyncStore()

    return (
        <>
        <Card className={`overflow-hidden transition-all relative hover:shadow-md ${syncInProgress.includes(customer.sitesGroup || "") ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}>
          
            <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {customer.img ? (
                            <Avatar className="h-10 w-10 rounded-md">
                                <AvatarImage src={customer.img || `https://api.dicebear.com/9.x/initials/svg?seed=${customer.name}`} alt={customer.name} />
                                <AvatarFallback className="rounded-md">{customer.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-gray-200`}>
                                <Skeleton className="h-10 w-10 rounded-md" />
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-base">{customer.name}</CardTitle>
                            <CardDescription>Customer</CardDescription>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild >
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => startCustomerSync(customer.sitesGroup!)}>
                                <RefreshCcw className="text-muted-foreground" />
                                Sync</DropdownMenuItem>
                            {/* <DropdownMenuItem>See details</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" disabled>
                                <Trash className="text-destructive" />
                                Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
                {/* <div className="grid gap-2">
         
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última factura:</span>
              <span className="font-medium">{lastInvoice}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Actividad:</span>
              <span>{lastActivity}</span>
            </div>
          </div> */}
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-3 relative w-full">
         
                <div className="flex w-full justify-between">
                {syncInProgress.includes(customer.sitesGroup || "") && 
                <Badge className="w-auto "  variant={"outline"} >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sync in progress</Badge>
                }
                    <Button variant="ghost" className="ml-auto" size="sm" onClick={() => customer.sitesGroup && router.push(`/customer/${customer.id.id}`)}>
                        View
                    </Button>
                </div>
            </CardFooter>
        </Card>
        {/* {!syncInProgress && <LoadingOverlay isLoading={!syncInProgress} message="Sincronizando datos..." />} */}
        </>
    )
}
