"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IBranch, IBranchSettings, ICustomer, IExportData, ILocal } from "@/interfaces";
import { updateBranchNameService, updateBranchSettingsService } from "@/services/branch.service";
import { useBranchStore } from "@/stores";
import { useCustomerStore } from "@/stores/customer-store";
import { DialogClose } from "@radix-ui/react-dialog";
import { CircleX, FileDown, Info, InfoIcon, Settings, Trash } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import ProcessStepper, { Step } from "../ui/stepper";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ExportAdditionalCharges } from "./export-charges";
import { exportDataService, getExtension } from "@/services";


const formats = [
    {
        id: "1",
        name: "PDF",
        value: "pdf",
        image: "/templates/pdf_template.png",
    },
    {
        id: "2",
        name: "Excel",
        value: "excel",
        image: "/templates/excel_template.png"
    },
    {
        id: "3",
        name: "Support",
        value: "support",
        image: "/templates/support_template.png"
    }
]

interface SelectFormatProps {
    exportData: IExportData,
    setExportData: React.Dispatch<React.SetStateAction<IExportData>>,
}
function SelectFormat({ exportData, setExportData }: SelectFormatProps) {
    return (
        <div className="flex flex-col gap-4 w-full px-2 pt-2">
            <Label>Select Format</Label>
            <form action="">
                <RadioGroup className="grid grid-cols-1 md:grid-cols-3 gap-4 " required value={exportData.format} onValueChange={(value) => setExportData(prev => ({ ...prev, format: value as "pdf" | "excel" | "support" }))}>
                    {formats.map((format) => (
                        <Label
                            key={format.id}
                            htmlFor={format.id}
                            className="cursor-pointer space-y-2 border rounded-lg p-4 hover:bg-accent transition-colors flex flex-col justify-center "
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={format.value} id={format.id} />
                                <span className="font-medium">{format.name}</span>
                            </div>

                            <img src={format.image} alt={format.name} className="max-h-[140px]  " />
                        </Label>
                    ))}
                </RadioGroup>
            </form>

        </div>
    )
}

interface ExportDataSettingsProps {
    exportData: IExportData,
    setExportData: React.Dispatch<React.SetStateAction<IExportData>>,
}

function ExportSettings({ exportData, setExportData }: ExportDataSettingsProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar dispositivos según el término de búsqueda
    const filteredDevices = exportData.selectedDevices?.filter((device) =>
        (device.label || device.toName).toLowerCase().includes(searchTerm.toLowerCase())
    );
    function handleDeleteDevice(device: ILocal) {
        setExportData(prev => ({
            ...prev,
            selectedDevices: prev.selectedDevices.filter((d) => d.id !== device.id)
        }))
    }

    return (
        <div className="flex flex-col gap-4 w-full px-2 pt-2">
            <div className="flex flex-col gap-4">
                <Label>Export Settings</Label>
                <div className="flex flex-col  gap-2">
                    <Label>Branch</Label>
                    <Input value={exportData.branch} disabled />
                </div>
                <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={exportData.currency} onValueChange={(value) => setExportData(prev => ({ ...prev, currency: value }))}>
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
                </div>
                <div className="flex items-center  gap-2">
                    <Checkbox checked={exportData.sendEmail} onCheckedChange={(value) => setExportData(prev => ({ ...prev, sendEmail: exportData.format === "support" ? true : !!value }))} disabled={exportData.format !== "support"} />
                    <Label className="flex items-center">Send Email
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><InfoIcon className="ml-1 h-3 w-3" /></TooltipTrigger>
                                <TooltipContent className="dark:bg-neutral-900 dark:text-neutral-400 py-2">
                                    {exportData.format === "support" ? (
                                        <p className="text-xs">Send the exported data to the customer's email</p>
                                    ) : (
                                        <p className="text-xs font-bold flex items-center gap-2"><CircleX className="h-4 w-4 text-red-500" /> This option is only available for Support format</p>

                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                </div>
                <div>
                    <div>
                        <Label>Selected Locations</Label>
                        {/* Búsqueda */}
                        <div className="flex items-center gap-4 py-2">
                            <Input
                                placeholder="Search locations"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline" onClick={() => setSearchTerm("")}>
                                Clear
                            </Button>
                        </div>
                    </div>
                    <ScrollArea className="h-[150px] ">
                        <ul className="flex flex-col border w-full overflow-auto max-w-[300px] md:max-w-full ">
                            {filteredDevices?.map((device, index) => (
                                <li
                                    key={device.id}
                                    className={`flex items-center justify-between text-xs p-1 px-3 w-[600px] md:w-full ${index % 2 === 0 ? "bg-neutral-100 dark:bg-neutral-900" : ""
                                        }`}
                                >
                                    <span>{device.label || device.toName}</span>
                                    <span>{device.buildingOwner}</span>
                                    <div className="flex gap-2 items-center">
                                        <span
                                            className="cursor-pointer"
                                            title={device.charges?.map((charge) => charge.name).join(", ") ?? "No additional charges"}
                                        >{device.charges?.length ?
                                            `${device.charges?.length} additional charges`
                                            : "No additional charges"}</span>
                                        <ExportAdditionalCharges local={device} setExportData={setExportData} />
                                        <Button
                                            onClick={() => handleDeleteDevice(device)}
                                            variant="outline" size="sm">
                                            <Trash className="text-red-500" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                            {filteredDevices?.length === 0 && (
                                <li className="text-center text-xs p-2 text-gray-500">
                                    No locations found.
                                </li>
                            )}
                        </ul>
                    </ScrollArea>
                </div>

            </div>
        </div>
    );
}

interface BranchSettingsProps {
    exportDisabled?: boolean,
    customer: ICustomer,
    branch: IBranch,
    startDateTs: number,
    endDateTs: number,
    selectedDevices: ILocal[],
    dates: { startDate: number, endDate: number }
}
export function ExportModal({ exportDisabled, customer, branch, endDateTs, startDateTs, selectedDevices, dates }: BranchSettingsProps) {
    const [exportedData, setExportedData] = useState<IExportData>({
        format: "pdf",
        branch: branch.toName,
        customer: customer.name,
        currency: branch.settings.currency,
        img: customer.img,
        selectedDevices: selectedDevices,
        units: branch.settings.units,
        rate: branch.settings.rate,
        sendEmail: false,
        startDateTs,
        endDateTs
    })
    useEffect(() => {
        setExportedData(prev => ({
            ...prev,
            selectedDevices,
            startDateTs: dates.startDate,
            endDateTs: dates.endDate
        }))
    }, [selectedDevices, dates])

    const [currentStep, setCurrentStep] = useState(0);
    const steps: Step[] = [
        {
            id: 0,
            name: "Select Format",
            status: currentStep > 0 ? "complete" : currentStep === 0 ? "current" : "upcoming",
        },
        {
            id: 1,
            name: "Export Settings",
            status: currentStep > 1 ? "complete" : currentStep === 1 ? "current" : "upcoming",
        },
        {
            id: 2,
            name: "Export",
            status: currentStep > 2 ? "complete" : currentStep === 2 ? "current" : "upcoming",
        },
    ];



    const handleClose = () => {
        setCurrentStep(0);
        setExportedData({
            format: "pdf",
            branch: branch.toName,
            customer: customer.name,
            currency: branch.settings.currency,
            img: customer.img,
            selectedDevices: selectedDevices,
            units: branch.settings.units,
            rate: branch.settings.rate,
            sendEmail: false,
            startDateTs,
            endDateTs
        })
    }

    const [urlExport, setUrlExport] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    async function handleExportData() {
        if (exportedData.selectedDevices.length === 0) {
            return toast.error("Select at least one site to export");
        }
        setIsExporting(true);
        setCurrentStep(prev => prev + 1);
        console.log(exportedData)
        const response = await exportDataService(exportedData);

        if (response.success) {
            toast.success("Exported successfully");
            setUrlExport(response.data?.url!);
        } else {
            toast.error("Failed to export");
        }
        setIsExporting(false);

    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild className="hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full">
                    <Button variant="outline" className="md:ml-auto rounded-md" disabled={exportDisabled}>
                        Export
                    </Button>
                </DialogTrigger>
                <DialogContent className="h-full md:h-auto sm:max-w-[850px]" onCloseAction={handleClose}>
                    <DialogHeader>
                        <DialogTitle>Export Data</DialogTitle>
                        <DialogDescription>
                            Export data in PDF, Excel or Support format
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col md:flex-row md:border-t">

                        {/* {activeOption == 'general' && <ExportDataSettings  />} */}
                        <div className="flex flex-col gap-[40px] w-full px-2 py-5">
                            <div className="relative  p-2 md:px-10 md:py-">
                                <ProcessStepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
                            </div>
                            <ScrollArea className="w-full  h-[400px] md:h-[300px]  p-2 md:px-10  ">
                                {currentStep === 0 && <SelectFormat exportData={exportedData} setExportData={setExportedData} />}
                                {currentStep === 1 && <ExportSettings exportData={exportedData} setExportData={setExportedData} />}
                                {currentStep === 2 && (
                                    <>
                                        {isExporting && <div className="flex flex-col gap-4 w-full items-center justify-center h-full px-2 pt-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <Settings className="h-6 w-6 text-accent animate-spin" />
                                                <span>Exporting data...</span>
                                            </div>
                                        </div>}
                                        {
                                            (urlExport && !isExporting) && (
                                                <div className="flex flex-col gap-4 w-full items-center justify-center h-full px-2 pt-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Info className="h-6 w-6 " />
                                                        <span>Exported successfully</span>
                                                    </div>

                                                    <Button>
                                                        {/* download file */}
                                                        <a
                                                            className="flex items-center gap-2"
                                                            href={urlExport} download={`export-${exportedData.format}.${getExtension(exportedData.format)}`}>
                                                            <FileDown className="h-6 w-6" />
                                                            Download</a>
                                                    </Button>
                                                    <small className="text-neutral-400 text-xs">Download the exported file</small>
                                                </div>
                                            )
                                        }
                                    </>
                                )}
                            </ScrollArea>
                        </div>

                    </div>
                    <DialogFooter className="border-t py-2 gap-2">


                        {currentStep !== steps.length - 1 &&
                            <>
                                <DialogClose asChild>
                                    <Button
                                        onClick={handleClose}
                                        variant="ghost">Cancel</Button>
                                </DialogClose>
                                {/*Back  */}
                                {(currentStep !== 0 && currentStep !== 2)
                                    && <Button
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                    >Back</Button>}
                                {/*Next */}
                                <Button
                                    onClick={
                                        () => {
                                            if (currentStep !== steps.length - 2) {
                                                setCurrentStep(prev => prev + 1)
                                            } else {
                                                handleExportData()
                                            }
                                        }
                                    }
                                >{currentStep === steps.length - 2 ? "Export" : "Next"}</Button>
                            </>
                        }
                        {/* Close */}
                        {currentStep === steps.length - 1 && <DialogClose asChild>
                            <Button
                                onClick={handleClose}
                                variant="ghost">Close</Button>
                        </DialogClose>}



                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}