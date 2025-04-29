"use client"

import { ISite } from "@/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { siteSettingsSchema } from "@/schemas";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useDataStore, useSiteStore } from "@/stores";
import { Circle, CircleCheck, Loader } from "lucide-react";
import { toast } from "sonner";

interface SiteSettingsProps {
    site: ISite,
    customBtn?: React.ReactNode,
    open?: boolean,
    setOpen?: (open: boolean) => void,
}

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export function SiteSettings({ site, customBtn, open, setOpen }: SiteSettingsProps) {
    const {updateSite, siteIsUpdating, siteSuccess, resetSuccess} = useSiteStore()
    const {updateSiteSelected} = useDataStore()
    const form = useForm<SiteSettingsFormValues>({
        resolver: zodResolver(siteSettingsSchema),
        defaultValues: {
            name: site.name || "",
            label: site.label || "",
            type: site.type,
            address: site.address || "",
            phone: site.phone || "",
            email: site.email || "",
            paymentInfo: site.paymentInfo || "",
            supportInfo: site.supportInfo || "",
            currency: site.currency || "",
            tariff: {
                energyRate: {
                    value: site.tariff?.energyRate.value || "0",
                    unit: site.tariff?.energyRate.unit || "kWh",
                },
                waterRate: {
                    value: site.tariff?.waterRate.value || "0",
                    unit: site.tariff?.waterRate.unit || "m3",
                },
            }
        }
    });
    function onSubmit() {
        //  TODO: handle form submission
        const data = form.getValues()
        updateSite(site.id, data as Partial<ISite>).then((res) => {
            if(res.success){
                updateSiteSelected(site.id, res.data as ISite)
                toast.success("Site updated successfully", {
                    position: "bottom-center",
                })
            }
        })
        
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            {customBtn && (
                <DialogTrigger  asChild >
                    {customBtn}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[625px] w-full h-full md:h-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle>{site.label || site.name}</DialogTitle>
                    <DialogDescription>Settings</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Tabs defaultValue="General" className="w-full">
                            <TabsList className="w-full flex rounded-sm">
                                {["General", "Contact", "Billing"].map(tab => (
                                    <TabsTrigger key={tab} className="flex-1 rounded-sm" value={tab}>
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* General Settings */}
                            <TabsContent value="General" className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input {...field} disabled/></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Label</FormLabel>
                                            <FormControl><Input {...field} placeholder="ex. Lumen Place" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* Contact Settings */}
                            <TabsContent value="Contact" className="space-y-4 pt-4">

                                <div className="flex items-end gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl><Input {...field} placeholder="ex. +504 9988-XXXX" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl><Input {...field} type="email" placeholder="ex. billing@lumen.com" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} rows={3} placeholder="ex. 123 Main St, San Pedro Sula" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="supportInfo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Support Info</FormLabel>
                                            <FormControl><Textarea {...field} rows={3} placeholder="ex. Visit our office or call us at +504 9988-XXXX" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* Billing Settings */}
                            <TabsContent value="Billing" className="space-y-4 pt-4">

                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Currency</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full" >
                                                        <SelectValue placeholder="Select a currency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="HNL">HNL</SelectItem>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>

                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-end gap-4">
                                    <FormField
                                        control={form.control}
                                        name="tariff.energyRate.value"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Energy Rate</FormLabel>
                                                <FormControl><Input type="number" {...field} value={field.value || "0"} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tariff.energyRate.unit"
                                        render={({ field }) => (
                                            <FormItem className="flex-1" >
                                                <FormLabel>Unit</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full" >
                                                            <SelectValue placeholder="Select a unit" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="kWh">kWh</SelectItem>
                                                            <SelectItem value="MWh">MWh</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex items-end gap-4">
                                    <FormField
                                
                                        control={form.control}
                                        name="tariff.waterRate.value"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Water Rate</FormLabel>
                                                <FormControl><Input type="number" {...field}  /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tariff.waterRate.unit"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Unit</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full" >
                                                            <SelectValue placeholder="Select a unit" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="m3">m3</SelectItem>
                                                            <SelectItem value="L">L</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="paymentInfo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Info</FormLabel>
                                            <FormControl><Textarea {...field} rows={3} placeholder="ex. Pay your bill at our office or online" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* Advanced Settings */}
                            {/* <TabsContent value="Advanced" className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="supportInfo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Support Info</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent> */}
                        </Tabs>

                        <Button type="submit" className="mt-4 w-full" disabled={siteIsUpdating}>
                            {siteIsUpdating && <Loader className="animate-spin mr-2" size={16} />}
                            {siteIsUpdating ? "Saving..." : "Save Changes"}

                            </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
