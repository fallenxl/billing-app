import { Menu } from "lucide-react";
import React, { useEffect } from "react";

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

    return (
        <header className="w-full h-[4rem] border-b flex items-center justify-between md:justify-end text-gray-500 px-5 md:px-10 gap-6 ">
            <div className="md:hidden cursor-pointer" onClick={toggleSidebar}>
                <Menu size={30} />
            </div>
            <div>
                <div className=" flex items-center gap-4 pr-2">
                    <span className="text-sm font-bold">{userName}</span>
                    <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${userName}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
