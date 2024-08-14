import {
  Home,
  ChevronRight,
  ChevronLeft,
  Settings
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../interfaces/app-state/app-state';


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const customer = useSelector((state: AppState) => state.customer);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  

  const links = [
    {
      title: 'Dashboard',
      icon: Home,
      path: `/dashboard?customer=${customer?.id?.id}`,
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
    }
  ]
  return (
    <div className={`${!isOpen && ' -left-[10rem]'} md:left-0 absolute top-[4rem] md:relative md:top-0 bg-white md:flex flex-col h-[calc(100vh-64px)] md:h-screen   border-r   text-gray-600 ${isOpen ? 'w-72 ' : 'w-20 items-center '} transition-width duration-300 `}>
      <div className="flex items-center justify-center py-2  mb-6 border-b relative h-[4rem]">
        {customer?.img && <img src={customer?.img} alt="logo" className={`${!isOpen ? 'block' : 'rounded-md w-12 h-12 '} duration-300`} />}
   
        {customer && !customer.img && (
          <div className={`w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center duration-300`}>
            <span className="text-gray-400 text-2xl">{customer.name?.charAt(0)}</span>
          </div>

        )}

      </div>
      <button onClick={toggleSidebar} className="hidden lg:block absolute -right-[1.1rem] bg-white top-[2.75rem] p-2 border rounded-full text-gray-500 z-10">
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      <nav>
        <ul className='flex flex-col gap-2 px-4'>
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <li key={index} className="flex items-center space-x-4 py-2  text-nowrap cursor-pointer hover:bg-gray-50 px-2 rounded-md">
                <Link to={link.path} className="flex items-center gap-2">
                  <Icon className='w-5 h-5 text-gray-400 ' />
                  <span className={`text-sm duration-200 text-gray-500 ${!isOpen && 'scale-0 absolute'}`}>
                    {link.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
