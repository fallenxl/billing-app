import { ILocal, ILocalCharges, ILocalUpdate } from "@/interfaces";
import { updateLocalNameService, updateLocalService } from "@/services";
import { useBranchStore, useCustomerStore } from "@/stores";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface LocalSettingsProps {
  local: ILocal
}
export function LocalSettings({ local }: LocalSettingsProps) {
  const [updatedBranch, setUpdatedBranch] = useState<ILocal>(local);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el texto del input
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [optionSelected, setOptionSelected] = useState<"properties" | "charges">("properties");
  const { branchRelations, setBranchRelations } = useBranchStore((state) => state);
  const { customer } = useCustomerStore((state) => state);

  // Carga la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB-sJdJ4Z2FkoE9ie7apoudxePMDl8ikrs", // Reemplaza con tu API Key
    libraries: ["places"],
  });

  const [selectedPosition, setSelectedPosition] = useState({

    lat: local.latitude || 15.537768238877776,
    lng: local.longitude || -88.03784159016449,
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
      charges: updatedBranch.charges,
      buildingOwner: updatedBranch.buildingOwner,
      latitude: updatedBranch.latitude,
      longitude: updatedBranch.longitude,
    };
    if (local.label !== updatedBranch.label) {
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
            <SheetTitle>{updatedBranch.label} / Edit Local</SheetTitle>
            <SheetDescription> Update the information of this local </SheetDescription>
          </SheetHeader>

          { <div className="flex flex-col items-start space-y-4 py-5">
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
          </div>}
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