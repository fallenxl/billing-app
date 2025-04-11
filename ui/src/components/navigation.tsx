"use client"
import { LogOut, Settings, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthStore } from "@/stores";
import Link from "next/link";
import { ROLES } from "@/constants";
import { useRouter } from "next/navigation";

export function Navigation() {
    const router = useRouter()
    const { user, logout } = useAuthStore()
    const handleLogout = () => {
        logout()
        router.push('/auth/login')
    }

    return (
        <header className="sticky top-0 z-10 bg-white border-b">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                <div className="flex items-center gap-5">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md"></div>
                        <h1 className="text-xl font-bold hidden md:block">Lumen Billing</h1>
                    </div>
                    {user?.scopes.includes(ROLES.TENANT_ADMIN) && <nav className="flex items-center space-x-6 ">
                        <Link href="/" className=" hover:text-neutral-600 transition-colors duration-200 text-neutral-500 font-medium text-sm">Customers </Link>
                    </nav>}
                </div>

                <div className="flex items-center space-x-4">

                    {/* <button className="p-2 rounded-full hover:bg-gray-100">
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
                    </button> */}
                    <p className=" text-gray-600 block">
                        Hi, <strong>
                            {user?.firstName} {user?.lastName}
                        </strong>
                    </p>
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
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-600 focus:text-red-600">
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