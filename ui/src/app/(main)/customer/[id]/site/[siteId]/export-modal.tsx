"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import Image from "next/image"
import { ICustomer, IExportData, ILocal, ISite } from "@/interfaces"
import { Icon } from "@/icons/icons"
import { useLocalsStore } from "@/stores"
import { useParams } from "next/navigation"
import { useExportStore } from "@/stores/export.store"

interface ExportModalProps {
    site: ISite,
    customer: ICustomer
    exportData: {
        startDate: Date
        endDate: Date,
    }
}
export default function ExportModal({  site, customer, exportData }: ExportModalProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [format, setFormat] = useState< "excel" | "support">("excel")
    const { localsSelected } = useLocalsStore()
    const {startExport} = useExportStore()
    const [exportPayload, setExportPayload] = useState<IExportData>({
        customer : customer,
        site : site,
        localsSelected: localsSelected,
        format: format,
        startDate: exportData.startDate,
        endDate: exportData.endDate,
        settings: {
            tariff: site.tariff,
            globalCharges: site.globalCharges,
            currency: site.currency,
        }
    })

    useEffect(() => {
        setExportPayload({
            ...exportPayload,
            localsSelected: localsSelected,
            format: format,
            customer: customer,
            site: site,
            startDate: exportData.startDate,
            endDate: exportData.endDate,
        })
    },[localsSelected])

    const handleNext = () => {
        const nextStep = step + 1
        setStep(nextStep)
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    const handleCancel = () => {
        setOpen(false)
        setStep(1)
    }

    const handleExport = () => {
        setStep(2)
        startExport(exportPayload).then(() => {
            
        }).catch((error) => {
            console.error("Export failed:", error)
        })
    }


    return (
        <div className="p-4">
            <Button onClick={() => setOpen(true)}
                variant={"outline"}
                disabled={localsSelected?.length === 0}
            >Export Data</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Export Data</DialogTitle>
                        <DialogDescription>Export data in PDF, Excel or Support format</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {/* Progress indicator */}
                        <div className="relative mb-8">

                            <div className="relative flex justify-center  items-center z-10">
                                <div className="flex flex-col items-center justify-center mt-4">
                                    <div
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${step >= 1 ? "bg-black text-white" : "bg-white"}`}
                                    >
                                        {step > 1 ? <Check className="h-4 w-4" /> : 1}
                                    </div>
                                    <span className="mt-2 text-xs text-center">
                                        Select Format
                                    </span>
                                </div>
                                <div className="w-full h-[0.1em] mb-5 bg-gray-200"></div>
                                <div className="flex flex-col items-cente ml-4">
                                    <div
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${step >= 2 ? "bg-black text-white" : "bg-white"}`}
                                    >
                                        {step > 2 ? <Check className="h-4 w-4" /> : 2}
                                    </div>
                                    <span className="mt-2 text-xs text-center">
                                        Export
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Step 1: Select Format */}
                        {step === 1 && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Select Format</h3>
                                <RadioGroup value={format} onValueChange={(value: string) => setFormat(value as  "excel" | "support")} className="grid grid-cols-3 gap-4">
                                    <div className={`border rounded-md p-4 ${format === "excel" ? "ring-2 ring-black" : ""}`}>
                                        <div className="flex items-start space-x-2">
                                            <RadioGroupItem value="excel" id="excel" />
                                            <Label htmlFor="excel">Excel</Label>
                                        </div>
                                        <div className="mt-2">
                                            <div className="bg-gray-100 rounded-md p-2 h-32 flex items-center justify-center">
                                                <Icon.Excel />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`border rounded-md p-4 ${format === "support" ? "ring-2 ring-black" : ""}`}>
                                        <div className="flex items-start space-x-2">
                                            <RadioGroupItem value="support" id="support" />
                                            <Label htmlFor="support">Support</Label>
                                        </div>
                                        <div className="mt-2">
                                            <div className="bg-gray-100 rounded-md p-2 h-32 flex items-center justify-center">
                                                <Icon.Support />
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {/* Step 3: Export Confirmation */}
                        {step === 2 && (
                            <div className="py-8 text-center">
                                <h3 className="text-lg font-medium mb-2">Ready to Export</h3>
                                <p className="text-gray-500 mb-4">Your data will be exported in {format.toUpperCase()} format</p>
                            </div>
                        )}

                        {/* Footer buttons */}
                        <div className="flex justify-end gap-2 mt-8">
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>

                            {step > 1 && (
                                <Button variant="outline" onClick={handleBack}>
                                    Back
                                </Button>
                            )}

                            {step < 1 ? <Button onClick={handleNext}>Next</Button> : <Button onClick={handleExport}>Export</Button>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
