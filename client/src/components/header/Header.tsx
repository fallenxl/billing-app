import { ChevronDown, Menu } from "lucide-react";
import React, { useEffect } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface HeaderProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ isOpen, setIsOpen }: HeaderProps) => {
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const [userName, setUserName] = React.useState<string>("");
    useEffect(() => {
        const localUser = localStorage.getItem("user.data");
        if (localUser) {
            const { name } = JSON.parse(localUser);
            setUserName(name);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("user.data");
        localStorage.removeItem("jwt");
        window.location.reload();
      };
    return (
        <header className="w-full h-[4rem] border-b flex items-center justify-between md:justify-end text-gray-500 px-5 md:px-10 gap-6 ">
            <div className="md:hidden cursor-pointer" onClick={toggleSidebar}>
                <Menu size={30} />
            </div>
            <div className="flex items-center gap-2">
                <div className=" flex items-center gap-4 ">
                    <span >Hi, <strong>{userName}</strong></span>
                    <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${userName}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                        variant={'ghost'}
                        className="p-0 hover:bg-transparent"
                        >
                            <span className="sr-only">menu</span>
                            <ChevronDown className="w-6 h-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                            className="text-red-500 hover:text-red-600"
                            onClick={logout}
                        >
                            Logout
                        </DropdownMenuCheckboxItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default React.memo(Header);
