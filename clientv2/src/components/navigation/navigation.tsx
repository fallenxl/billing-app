"use client";

import { useUserStore } from "@/stores";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "../mode-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, clearUser } = useUserStore((state) => state);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleLogout() {
        clearUser();
        localStorage.removeItem("jwt");
        router.replace("/auth");
    }
    return (
        <header className="max-w-screen-2xl mx-auto w-full">
            <nav className="p-5 flex justify-between items-center">
                {/* Logo y enlaces de navegación */}
                <div className="flex items-center space-x-2 gap-2 text-sm font-normal">
                    <Link href="/">
                        <img src="/lumen.png" alt="Lumen Energy Solutions Logo" className="h-10" />
                    </Link>
                    <div className="hidden md:flex space-x-4">
                        {pathname !== "/" && (
                            <Link href="/">
                                Home
                            </Link>
                        ) }
                    </div>
                </div>

                {/* Menú móvil (hamburguesa) */}
                <div className="md:hidden flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`} />
                        <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="p-2 text-gray-700 dark:text-white focus:outline-none"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <MenuIcon size={24} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset={8} align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/">Customers</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={handleLogout}
                            asChild>
                                Logout 
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Avatar y menú de usuario */}
                <div className="hidden md:flex items-center space-x-2 gap-2 text-neutral-600 dark:text-white">
                    <p className="font-semibold">
                        <span className="text-neutral-500 font-normal dark:text-neutral-400">Hi,</span> {user?.name}
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`} />
                                <AvatarFallback>{user?.name[0]}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            onClick={handleLogout}
                            >
                                <LogOut size={16} className="text-neutral-500" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ModeToggle />
                </div>
            </nav>
        </header>
    );
}
