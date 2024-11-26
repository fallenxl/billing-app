"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ILocal, ILocalUpdate } from "@/interfaces/local.interface"
import { updateLocalNameService, updateLocalService } from "@/services"
import { useBranchStore } from "@/stores"
import { useCustomerStore } from "@/stores/customer-store"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ColumnDef} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
interface EditRowProps {
  local: ILocal
}
function EditRow({ local }: EditRowProps) {
  const [updatedBranch, setUpdatedBranch] = useState<ILocal>(local);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el texto del input
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const { branchRelations, setBranchRelations, branch } = useBranchStore((state) => state);
  const { customer } = useCustomerStore((state) => state);

  // Carga la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB-sJdJ4Z2FkoE9ie7apoudxePMDl8ikrs", // Reemplaza con tu API Key
    libraries: ["places"],
  });

  const [selectedPosition, setSelectedPosition] = useState({
    lat: local.latitude || 0,
    lng: local.longitude || 0,
  });

  useEffect(() => {
    setHasChanges(JSON.stringify(updatedBranch) !== JSON.stringify(local));
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
  }, [updatedBranch, isLoaded]);

  function handleSave() {
    const payload: ILocalUpdate = {
      id: {
        entityType: local.to.entityType,
        id: local.to.id,
      },
      customerId: customer?.id!,
      name: updatedBranch.toName,
      label: updatedBranch.label,
      address: updatedBranch.address,
      phone: updatedBranch.phone,
      email: updatedBranch.email,
      buildingOwner: updatedBranch.buildingOwner,
      latitude: updatedBranch.latitude,
      longitude: updatedBranch.longitude,
    };
    if(local.label !== updatedBranch.label){
      updateLocalNameService({ data: payload }).then((response) => {
        if (response.success) {
          toast.success(response.message);
        }
      });
    }
    updateLocalService({ id: payload.id.id, data: payload }).then((response) => {
      if (response.success) {
        const updatedBranches = branchRelations.map((b) => {
          if (b.id === updatedBranch.id) {
            return updatedBranch;
          }
          return b;
        });
        setBranchRelations(updatedBranches as ILocal[]);
        document.getElementById("close-local-edit-sheet")?.click();
        toast.success(response.message);
      }
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedBranch({
      ...updatedBranch,
      [e.target.name]: e.target.value,
    });
  }
  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchQuery(query);

    if (query && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions({ input: query }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    }
  }
  function handleSuggestionClick(placeId: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry?.location;
        if (location) {
          const lat = location.lat();
          const lng = location.lng();
          setSelectedPosition({ lat, lng });
          setUpdatedBranch((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address: results[0].formatted_address,
          }));
          setSearchQuery(results[0].formatted_address || "");
          setSuggestions([]);
        }
      } else {
        toast.error("Error fetching place details");
      }
    });
  }


  function handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      setSelectedPosition({ lat, lng });
      setUpdatedBranch({
        ...updatedBranch,
        latitude: lat,
        longitude: lng,
      });

      // Usar la API de Geocoding para obtener la dirección
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setUpdatedBranch((prev) => ({ ...prev, address: results[0].formatted_address }));
        } else {
          toast.error("Error obteniendo la dirección");
        }
      });
    }
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-start items-center text-left p-0 px-2 rounded-sm text-sm font-normal">
            Edit site
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full md:min-w-[800px] overflow-auto" >
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-start space-y-4 py-5">
            {/* Inputs */}
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="label">Local name</Label>
              <Input name="label" placeholder="ex. Local name" value={updatedBranch.label || updatedBranch.toName} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="buildingOwner">Building owner</Label>
              <Input name="buildingOwner" placeholder="ex. Building owner" value={updatedBranch.buildingOwner} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" placeholder="ex. 1234567890" value={updatedBranch.phone} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="ex. example@lumenbilling.com" value={updatedBranch.email} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="address">Address</Label>
              <Input name="address" placeholder="ex. 1234 Main St, City, State, Zip" value={updatedBranch.address} onChange={handleInputChange} />
            </div>
            {/* Map Picker */}

            <div className="flex flex-col gap-2 w-full">
              <Label>Pick location</Label>
              <div className="flex md:hidden flex-col w-full  bg-white z-10">

                    <Input
                      name="search"
                      placeholder="Search for a place"
                      value={searchQuery}
                      className="rounded-none h-10"  
                      onChange={handleSearchInputChange}
                    />
                    {suggestions.length > 0 && (
                      <ul className="bg-white border border-gray-200 max-h-48 overflow-auto rounded-none">
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(suggestion.place_id)}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px", position: "relative", display: "flex", flexDirection: "row", justifyContent: "center" }}
                  center={selectedPosition}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  <div className="hidden md:flex flex-col w-2/3 md:w-2/3 absolute top-[2.4%]  left-[25%] bg-white z-10">

                    <Input
                      name="search"
                      placeholder="Search for a place"
                      value={searchQuery}
                      className="rounded-none h-10"  
                      onChange={handleSearchInputChange}
                    />
                    {suggestions.length > 0 && (
                      <ul className="bg-white border border-gray-200 max-h-48 overflow-auto rounded-none">
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(suggestion.place_id)}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Marker position={selectedPosition} />
                </GoogleMap>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="ghost" className="sr-only" id="close-local-edit-sheet">
                Cancel
              </Button>
            </SheetClose>
            <Button onClick={handleSave} type="button" className="w-full" disabled={!hasChanges}>
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function Columns(): ColumnDef<ILocal>[] {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
    ,
    {
      accessorKey: "toName",
      header: () => <></>,
      cell: () => <></>,
    },
    {
      accessorKey: "label",
      header: "Site",
      cell: ({ row }) => (
        <div className="capitalize min-w-[200px]">{row.getValue("label") ?? row.getValue("toName")}</div>),

    },
    {
      accessorKey: "buildingOwner",
      header: "Building owner",
      cell: ({ row }) => <div>{row.getValue("buildingOwner") || "-"}</div>,
      enableHiding: false,
    },    // email
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div
        title={row.getValue("email") || "-"}
        className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
      >{row.getValue("email") || "-"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone") || "-"}</div>,
    },
    {
      accessorKey: "address",
      header: () => <div className="hidden md:block">Address</div>,
      cell: ({ row }) => <div
        title={row.getValue("address") || "-"}
        className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
      >{row.getValue("address") || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => {
        const local = row.original as ILocal

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(local.label || local.toName)}
              >
                Copy local name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <EditRow local={local} />

            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}