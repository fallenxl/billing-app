import { IExportData, ILocal, ILocalCharges } from "@/interfaces";
import React, { useEffect } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { set } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { PlusCircle, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { updateLocalService } from "@/services";
import { toast } from "sonner";
import { useBranchStore } from "@/stores";

interface ExportAdditionalChargesProps {
    local: ILocal;
    setExportData?: React.Dispatch<React.SetStateAction<IExportData>>;
    button?: React.ReactNode;
}
export function ExportAdditionalCharges({ local, setExportData, button }: ExportAdditionalChargesProps) {
    const [charges, setCharges] = React.useState<ILocalCharges[]>([]);
    const [newCharge, setNewCharge] = React.useState<ILocalCharges>({ name: "", description: "", amount: "" });
    const [isAdding, setIsAdding] = React.useState<boolean>(false);
    const { setBranchRelations, branchRelations} = useBranchStore();
    const [hasChanges, setHasChanges] = React.useState<boolean>(false);

    useEffect(() => {
        setHasChanges(JSON.stringify(charges) !== JSON.stringify(local.charges));
    }, [charges]);


    React.useEffect(() => {
        setCharges(local.charges ?? []);
    }, [local]);


    const addCharge = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCharges([...charges, newCharge]);
        setNewCharge({ name: "", description: "", amount: "" });
        setIsAdding(false);
    }

    const removeCharge = (index: number) => {
        setCharges(charges.filter((_, i) => i !== index));
    }

    const saveChanges = () => {

        if (setExportData) {
            setExportData((prev) => {
                const newSelectedDevices = prev.selectedDevices.map((device) => {
                    if (device.id === local.id) {
                        return { ...device, charges };
                    }
                    return device;
                });
                return { ...prev, selectedDevices: newSelectedDevices };
            });
            document.getElementById("close-charges")?.click();

        } else {
            updateLocalService({ id: local.id, data: { charges } }).then((response) => {
                if (response.success) {
                    toast.success(response.message);
                    const updatedBranches = branchRelations.map((branch) => {
                        if (branch.id === local.id) {
                            return { ...branch, charges };
                        }
                        return branch;
                    });
                    setBranchRelations(updatedBranches);
                    document.getElementById("close-charges")?.click();
                } else {
                    toast.error(response.message);
                }
            });
        }



    }

    return (
        <Sheet>
            <SheetTrigger asChild>

                {button ? button : <Button size={"sm"} variant="outline">Edit charges</Button>}

            </SheetTrigger>
            <SheetContent className="md:min-w-[600px]">
                <SheetHeader>

                    <SheetTitle>{local.label} / Edit charges</SheetTitle>
                    <SheetDescription>
                        Add or remove charges for this local
                    </SheetDescription>
                </SheetHeader>
                <div className="py-5 flex flex-col">
                    <div className="self-end flex items-center py-1">

                        {!isAdding && <Button onClick={() => setIsAdding(true)} variant="ghost" >
                            <PlusCircle size={24} />
                            Add charge</Button>}
                    </div>

                    {isAdding && (
                        <div className="flex flex-col gap-4 mt-5">
                            <form onSubmit={addCharge} className="flex flex-col gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        placeholder="ex. Maintenance fee"
                                        value={newCharge.name} onChange={(e) => setNewCharge((prev) => ({ ...prev, name: e.target.value }))} required />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="ex. Monthly maintenance fee"
                                        value={newCharge.description} onChange={(e) => setNewCharge((prev) => ({ ...prev, description: e.target.value }))} />
                                </div>
                                <div>
                                    <Label>Amount</Label>
                                    <Input
                                        min={0}
                                        placeholder="ex. 100"
                                        type="number"
                                        step={0.01}
                                        value={newCharge.amount} onChange={(e) => setNewCharge((prev) => ({ ...prev, amount: parseFloat(e.target.value)}))} required />
                                </div>

                                <div className="flex items-center gap-2">
                                    {isAdding && (
                                        <Button type="button" onClick={() => setIsAdding(false)} variant="secondary" className="self-end w-full">Cancel</Button>
                                    )}
                                    <Button className="w-full">Add charge</Button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className="py-4">
                        <Label>Charges</Label>
                    </div>
                    <ScrollArea className="max-h-60  ">

                        <form id="charges-form" onSubmit={(e) => { e.preventDefault(); saveChanges(); }} className="flex flex-col gap-2">
                            {charges?.map((charge, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">

                                        <Input
                                            value={charge.name}
                                            placeholder="ex. Maintenance fee"
                                            onChange={(e) => setCharges((prev) => {
                                                const newCharges = [...prev];
                                                newCharges[index].name = e.target.value;
                                                return newCharges;
                                            })}
                                            required
                                        />
                                        <Input
                                            className="text-ellipsis"
                                            title={charge.description}
                                            value={charge.description}
                                            placeholder="ex. Monthly maintenance fee"
                                            onChange={(e) => setCharges((prev) => {
                                                const newCharges = [...prev];
                                                newCharges[index].description = e.target.value;
                                                return newCharges;
                                            })}

                                        />
                                        <Input
                                            placeholder="ex. 3500"
                                            value={charge.amount}
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            onChange={(e) => setCharges((prev) => {
                                                const newCharges = [...prev];
                                                newCharges[index].amount = parseFloat(e.target.value);
                                                return newCharges;
                                            })}
                                            required
                                        />


                                    </div>
                                    <Button type="button" onClick={() => removeCharge(index)} variant="outline" className="ml-2"><Trash className="text-red-500" size={20} />
                                    </Button>
                                </div>
                            ))}
                        </form>
                        {charges.length === 0 && (
                            <div className="flex items-center justify-center">
                                <small
                                    className="text-gray-500 text-center self-center"
                                >No charges added yet</small>
                            </div>
                        )}
                    </ScrollArea>



                </div>
                <SheetFooter>

                    <SheetClose asChild id="close-charges">
                        <Button variant="secondary">Close</Button>
                    </SheetClose>
                    <Button
                        form="charges-form"
                        disabled={!hasChanges}
                        type="submit">Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )


}