import { useState } from "react";

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { useSelector } from "react-redux";
import { AppState } from "../../interfaces/app-state/app-state";

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    button?: boolean;
}
export default function Layout({ children, title, button }: LayoutProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isLoading = useSelector((state: AppState) => state.isLoading);
    function handleBack() {
        navigate(-1);
    }
    return (
        <>
            {isLoading.isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-70 z-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-md shadow-md w-72 text-center">
                        <p>{isLoading.message}</p>
                        <span className="loader"></span>
                    </div>
                </div>
            )}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="w-full  ">
                <Header isOpen={isOpen} setIsOpen={setIsOpen} />
                <main className=" h-[calc(100vh-113px)] overflow-y-auto bg-gray-100 relative">
                    {title && (
                        <>
                            <div className="flex items-center gap-5 mb-10 pt-10 px-10">
                                {button && <button onClick={handleBack} className="h-8 w-8 flex items-center rounded-md justify-center border bg-white"> <ChevronLeft size={20} className="text-gray-500 " />
                                </button>}
                                <h1 className="text-2xl font-semibold text-gray-600">{title}</h1>
                            </div>
                        </>
                    )}
                    <div className="px-10 overflow-auto">
                    {children}
                    </div>
                    <footer className="bg-white p-4 border-t border-gray-200 text-center fixed w-full bottom-0">
                    <p className="text-gray-500 text-xs">© 2024 Lumen Billing. All rights reserved.</p>
                </footer>
                </main>
                
            </div>
        </>
    )
}