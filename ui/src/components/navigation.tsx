"use client"
import { LogOut, Settings, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthStore } from "@/stores";

export function Navigation() {
    const { user } = useAuthStore()
    return (
        <header className="sticky top-0 z-10 bg-white border-b">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md"></div>
                    <h1 className="text-xl font-bold">Lumen Billing</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-sm font-medium">
                        Dashboard
                    </a>
                    <a href="#" className="text-sm font-medium text-blue-600">
                        Customers
                    </a>
                    <a href="#" className="text-sm font-medium">
                        Invoices
                    </a>
                    <a href="#" className="text-sm font-medium">
                        Reports
                    </a>
                </nav>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <span className="sr-only">Notifications</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-bell"
                        >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className=" overflow-hidden rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.firstName}`} alt="User avatar" width={32} height={32} />
                                    <AvatarFallback className="bg-gray-200 text-gray-500">U</AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Mi perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configuración</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>

    )
}