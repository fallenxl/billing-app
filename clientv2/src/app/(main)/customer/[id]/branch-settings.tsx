"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IBranchSettings } from "@/interfaces";
import { updateBranchNameService, updateBranchSettingsService } from "@/services/branch.service";
import { useBranchStore } from "@/stores";
import { DialogClose } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GeneralSettingsProps {
    branchSettings: IBranchSettings | null,
    handleSettingsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    setBranchSettings: React.Dispatch<React.SetStateAction<IBranchSettings | null>>
}

const templates = [
    {
        id: "1",
        name: "Template 1",
        type: "pdf",
        image: "/templates/pdf_template.png",
    },
    {
        id: "2",
        name: "Template 1",
        type: "excel",
        image: "/templates/excel_template.png",
    },
    {
        id: "3",
        name: "Template 1",
        type: "support",
        image: "/templates/support_template.png",
    }
]

function GeneralSettings({ branchSettings, handleSettingsChange, setBranchSettings }: GeneralSettingsProps) {
    return (
        <div className="flex flex-col gap-4 w-full px-2 z-[100]">
            <div className="font-bold border-b pb-2">
                <h2 className="text-2xl">General</h2>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <Label htmlFor="branch-name">Name</Label>
                <Input className="w-full" placeholder="ex. Plaza Uno" value={branchSettings?.label} name="label" disabled />
            </div>
            <div className="flex flex-col gap-4">
                <Label htmlFor="branch-address">Address</Label>
                <Textarea placeholder="ex. 1234 Main St" className="resize-none" value={branchSettings?.address} name="address" onChange={handleSettingsChange} />
            </div>
            <div className="flex flex-col gap-4">
                <Label htmlFor="branch-phone">Phone</Label>
                <Input type="tel" placeholder="ex. 123-456-7890" value={branchSettings?.phone} name="phone" onChange={handleSettingsChange} />
            </div>
            <div className="flex flex-col gap-4">
                <Label htmlFor="branch-email">Email</Label>
                <Input placeholder="ex. example@lumenbilling.com" type="email" value={branchSettings?.email} name="email" onChange={handleSettingsChange} />
            </div>
        </div>
    )
}

function ExportSettings({ branchSettings, handleSettingsChange, setBranchSettings }: GeneralSettingsProps) {
    return (
        <div className="flex flex-col gap-4 px-2">
            {/* Currency */}
            <div className="border-b pb-2 font-bold">
                <h2 className="text-2xl">Tariff</h2>
            </div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={branchSettings?.currency ?? ""} onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, currency: value } : prevSettings)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a currency" className="text-white" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Currencies</SelectLabel>
                        <SelectItem value="HNL">Lempira</SelectItem>
                        <SelectItem value="USD">Dollar</SelectItem>
                        <SelectItem value="EUR">Euro</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-4">
                    <Label htmlFor="rate">Rate Energy</Label>
                    <Input id="rate" type="number" placeholder="ex. 24" value={branchSettings?.rate.energy} name="rate.energy" onChange={handleSettingsChange} />
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="rate">Rate Water</Label>
                    <Input id="rate" type="number" placeholder="ex. 24" value={branchSettings?.rate.water} name="rate.water" onChange={handleSettingsChange} />
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="rate">Rate Gas</Label>
                    <Input id="rate" type="number" placeholder="ex. 24" value={branchSettings?.rate.gas} name="rate.gas" onChange={handleSettingsChange} />
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="rate">Rate Air</Label>
                    <Input id="rate" type="number" placeholder="ex. 24" value={branchSettings?.rate.air} name="rate.air" onChange={handleSettingsChange} />
                </div>

            </div>
            <div className="border-b pb-2 mt-4 font-bold">
                <h2 className="text-2xl">Units</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-4">
                    <Label htmlFor="unit">Unit Energy</Label>
                    <Select value={branchSettings?.units.energy ?? ""} onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, units: { ...prevSettings.units, energy: value } } : prevSettings)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Units</SelectLabel>
                                <SelectItem value="kWh">kWh</SelectItem>
                                <SelectItem value="mWh">mWh</SelectItem>
                                <SelectItem value="GWh">GWh</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="unit">Unit Water</Label>
                    <Select value={branchSettings?.units.water ?? ""} onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, units: { ...prevSettings.units, water: value } } : prevSettings)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Units</SelectLabel>
                                <SelectItem value="m³">m³</SelectItem>
                                <SelectItem value="l">l</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="unit">Unit Gas</Label>
                    <Select value={branchSettings?.units.gas ?? ""} onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, units: { ...prevSettings.units, gas: value } } : prevSettings)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Units</SelectLabel>
                                <SelectItem value="m³">m³</SelectItem>
                                <SelectItem value="l">l</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="unit">Unit Air</Label>
                    <Select value={branchSettings?.units.air ?? ""} onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, units: { ...prevSettings.units, air: value } } : prevSettings)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Units</SelectLabel>
                                <SelectItem value="m³">m³</SelectItem>
                                <SelectItem value="l">l</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="border-b pb-2 mt-4 font-bold">
                <h2 className="text-2xl">Templates</h2>
            </div>
            <div className="flex flex-col gap-4">
                <Label htmlFor="unit">PDF Templates</Label>
                <RadioGroup value={branchSettings?.templates.pdf ?? ""}
                    onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, templates: { ...prevSettings.templates, pdf: value } } : prevSettings)}
                    className="grid grid-cols-2 gap-4">
                    {templates.filter(template => template.type == "pdf").map(template => (
                        <Label
                            key={template.id}
                            htmlFor={template.id}
                            className="cursor-pointer space-y-2 border rounded-lg p-4 hover:bg-accent transition-colors flex flex-col justify-center"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={template.id} id={template.id} />
                                <span className="font-medium">{template.name}</span>
                            </div>

                            <img src={template.image} alt={template.name} className="h-[200px]  " />
                        </Label>
                    ))}
                </RadioGroup>

            </div>
            <div className="flex flex-col gap-4">
                <Label htmlFor="unit">Excel Templates</Label>
                <RadioGroup
                    value={branchSettings?.templates.excel ?? ""}
                    onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, templates: { ...prevSettings.templates, excel: value } } : prevSettings)}
                    className="grid grid-cols-2 gap-4">
                    {templates.filter(template => template.type == "excel").map(template => (
                        <Label
                            key={template.id}
                            htmlFor={template.id}
                            className="cursor-pointer space-y-2 border rounded-lg p-4 hover:bg-accent transition-colors flex flex-col justify-center"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={template.id} id={template.id} />
                                <span className="font-medium">{template.name}</span>
                            </div>
                            <img src={template.image} alt={template.name} className="h-[200px]  object-contain" />
                        </Label>
                    ))}
                </RadioGroup>
            </div>
            <div className="flex flex-col gap-4">
                <Label htmlFor="unit">Support Templates</Label>
                <RadioGroup
                    value={branchSettings?.templates.support ?? ""}
                    onValueChange={(value) => setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, templates: { ...prevSettings.templates, support: value } } : prevSettings)}
                    className="grid grid-cols-2 gap-4">
                    {templates.filter(template => template.type == "support").map(template => (
                        <Label
                            key={template.id}
                            htmlFor={template.id}
                            className="cursor-pointer space-y-2 border rounded-lg p-4 hover:bg-accent transition-colors flex flex-col justify-center"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={template.id} id={template.id} />
                                <span className="font-medium">{template.name}</span>
                            </div>
                            <img src={template.image} alt={template.name} className="h-[200px]  object-contain" />
                        </Label>
                    ))}
                </RadioGroup>
            </div>

        </div>
    )
}
export function BranchSettings({ }) {
    const [activeOption, setActiveOption] = useState('general');
    const { branch, updateBranch } = useBranchStore(state => state)

    const [branchSettings, setBranchSettings] = useState<IBranchSettings | null>(branch ? {
        id: branch.to,
        name: branch.toName ?? "",
        label: branch.label ?? "",
        address: branch.address ?? "",
        phone: branch.phone ?? "",
        email: branch.email ?? "",
        currency: branch.settings.currency ?? "",
        rate: branch.settings.rate ?? { energy: 0, water: 0, gas: 0, air: 0 },
        units: branch.settings.units ?? { energy: "", water: "", gas: "", air: "" },
        templates: branch.settings.templates ?? { pdf: "", excel: "", support: "" }
    } : null)

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [key, subKey] = name.split(".")
        if (subKey) {
            setBranchSettings(prevSettings => {
                if (!prevSettings) return prevSettings;
                const subSettings = prevSettings[key as keyof IBranchSettings];
                if (typeof subSettings === 'object' && subSettings !== null) {
                    return { ...prevSettings, [key]: { ...subSettings, [subKey]: value } };
                }
                return prevSettings;
            });
            return
        }
        setBranchSettings(prevSettings => prevSettings ? { ...prevSettings, [name]: value } : prevSettings)
    }

    const handleClose = () => {
        if (branch) {
            setBranchSettings({
                id: branch.to,
                label: branch.label ?? "",
                name: branch.toName ?? "",
                address: branch.address ?? "",
                phone: branch.phone ?? "",
                email: branch.email ?? "",
                currency: branch.settings.currency ?? "",
                rate: branch.settings.rate ?? { energy: 0, water: 0, gas: 0, air: 0 },
                units: branch.settings.units ?? { energy: "", water: "", gas: "", air: "" },
                templates: branch.settings.templates ?? { pdf: "", excel: "", support: "" }
            })
        } else {
            setBranchSettings(null)
        }
    }

    async function handleSaveChanges() {
        if (branchSettings?.label !== branch?.label) {
            const response = await updateBranchNameService({ data: branchSettings! });
            if (!response.success) {
                console.error(response.message)
                toast.error(response.message)
                return
            }
        }

        const response = await updateBranchSettingsService({ id: branchSettings!.id.id, data: branchSettings! });
        if (!response.success) {
            console.error(response.message)
            toast.error(response.message)
            return
        }

        toast.success("Branch settings updated successfully")
        updateBranch({
            ...branch!,
            label: branchSettings?.label!,
            address: branchSettings?.address!,
            phone: branchSettings?.phone!,
            email: branchSettings?.email!,
            settings: branchSettings!
        })

    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild className="hover:bg-gray-100 rounded-full">
                    <Settings className="cursor-pointer h-10 w-10 p-2"/>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[925px]" onCloseAction={handleClose}>
                    <DialogHeader>
                        <DialogTitle>Edit branch settings</DialogTitle>
                        <DialogDescription>
                            Make changes to the branch settings
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col md:flex-row md:border-t">
                        <div>
                            <ul className="flex md:flex-col items-center h-full md:h-auto jus md:items-start">
                                <li
                                    onClick={() => setActiveOption('general')}
                                    className={`flex items-center gap-2 border-r md:border-r-0 py-4 w-full px-2 h-full pr-14 cursor-pointer duration-300 md:border-b ${activeOption == 'general' && "bg-neutral-100 dark:bg-neutral-700 "}`}>
                                    <p className="text-neutral-900 dark:text-white text-sm">General settings</p>
                                </li>
                                <li
                                    onClick={() => setActiveOption('export')}
                                    className={`flex items-center  gap-2  py-4 w-full cursor-pointer h-full px-2 pr-14 duration-300 ${activeOption == 'export' && "bg-neutral-100 dark:bg-neutral-700 "}`}>
                                    <p className="text-neutral-900 dark:text-white text-sm">Export settings</p>
                                </li>
                            </ul>

                        </div>
                        <ScrollArea className="w-full md:w-3/4 h-[400px] md:h-[500px] border-t md:border-t-0 md:border-l p-2 md:p-10 py-10 overflow-y-auto">
                            {activeOption == 'general' && <GeneralSettings branchSettings={branchSettings} handleSettingsChange={handleSettingsChange} setBranchSettings={setBranchSettings} />}
                            {activeOption == 'export' && <ExportSettings branchSettings={branchSettings} handleSettingsChange={handleSettingsChange} setBranchSettings={setBranchSettings} />}
                        </ScrollArea>
                    </div>
                    <DialogFooter className="border-t py-2">
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit"
                            onClick={handleSaveChanges}
                        >Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}