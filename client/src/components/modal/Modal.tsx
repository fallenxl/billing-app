import { XIcon } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title : string;
    children : React.ReactNode;
}
export function Modal({setIsOpen, title, children}: ModalProps){
    return <>
    
        <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(255,255,255,0.7)] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-screen-sm rounded-md border shadow-md">
                <div className="flex justify-between items-center mb-4 border-b py-4 px-10">
                    <h1 className="font-semibold text-2xl text-gray-600">{title}</h1>
                    <button 
                    className="p-2 rounded-full bg-gray-50 hover:bg-gray-200"
                    onClick={() => setIsOpen(false)}>
                    <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="px-10 py-4">
                    {children}
                </div>  
      
            </div>
        </div>
    </>
}