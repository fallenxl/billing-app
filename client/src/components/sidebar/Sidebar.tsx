import {
  Home,
  ChevronRight,
  ChevronLeft,
  Settings,
  LogOut
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../interfaces/app-state/app-state';
import { useState } from 'react';
import { Modal } from '../modal/Modal';


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
  ]
  const logout = () => {
    localStorage.removeItem("user.data");
    localStorage.removeItem("jwt");
    window.location.reload();
  };
  const branch = useSelector((state: AppState) => state.branch);

  const [isOpenSettings, setIsOpenSettings] = useState(false);

  return (
    <>
      {/* modal settings */}
      {isOpenSettings &&

        <Modal isOpen={isOpenSettings} setIsOpen={setIsOpenSettings} title="Settings">
          <div className="flex flex-col gap-4">
            <form className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor="branchName" className='font-medium text-sm text-gray-500'>Branch Name</label>
                <input
                  value={branch?.toName}
                  type="text" placeholder="Branch Name" className="w-full p-2 border rounded-md" />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="branchName" className='font-medium text-sm text-gray-500'>Currency</label>
                <select value={branch?.settings.currency} className="w-full p-2 border rounded-md ">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">LPS</option>
                  </select>
              </div>
              {/* rate */}
              <small className='text-gray-500 text-sm font-medium'>Tariff</small>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Energy Tariff</label>
                  <input
                    value={branch?.settings.rate.energy ?? 0}
                    type="number" placeholder="Energy Rate" className="w-full p-2 border rounded-md" />
                   <div className='flex items-center gap-2 mt-2'>
                   <input type='checkbox' className='' />
                   <small className='text-xs text-gray-500'>ENEE Tariff <span className='font-bold text-[0.6rem]'>(beta)</span></small>
                   </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Water Tariff</label>
                  <input
                    value={branch?.settings.rate.water ?? 0}
                    type="number" placeholder="Energy Rate" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Gas Tariff</label>
                  <input
                    value={branch?.settings.rate.gas ?? 0}
                    type="number" placeholder="Energy Rate" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Air Tariff</label>
                  <input
                    value={branch?.settings.rate.air ?? 0}
                    type="number" placeholder="Energy Rate" className="w-full p-2 border rounded-md" />
                </div>
              </div>
              {/* units */}
              <small className='text-gray-500 text-sm font-medium'>Units</small>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Energy Unit</label>
                  <input
                    value={branch?.settings.units.energy ?? ''}
                    type="text" placeholder="Energy Unit" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Water Unit</label>
                  <input
                    value={branch?.settings.units.water ?? ''}
                    type="text" placeholder="Water Unit" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Gas Unit</label>
                  <input
                    value={branch?.settings.units.gas ?? ''}
                    type="text" placeholder="Gas Unit" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Air Unit</label>
                  <input
                    value={branch?.settings.units.air ?? ''}
                    type="text" placeholder="Air Unit" className="w-full p-2 border rounded-md" />
                </div>
              </div>

              <div className='flex gap-4 mt-4'>
                <button className='flex-grow bg-gray-400 text-white p-2 rounded-md'>Cancel</button>
                <button className='flex-grow bg-blue-500 text-white p-2 rounded-md'>Save</button>
              </div>
            </form>
          </div>
        </Modal>
      }


      <div className={`${!isOpen ? '-left-[10rem]' : "z-[100]"} md:left-0 absolute top-[4rem] md:relative md:top-0 bg-white md:flex flex-col h-[calc(100vh-64px)]  md:h-screen   border-r   text-gray-600 ${isOpen ? 'w-72 ' : 'w-20 items-center '} transition-width duration-300 `}>
        <div className="flex items-center justify-center py-2  mb-6 border-b relative h-[4rem]">
          {customer?.img && <img src={customer?.img} alt="logo" className={`${!isOpen ? 'block ' : 'rounded-md w-12 h-12'} w-12 h-12 object-contain `} />}

          {customer && !customer.img && (
            <div className={`w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center duration-300`}>
              <span className="text-gray-400 text-2xl">{customer.name?.charAt(0)}</span>
            </div>

          )}

        </div>
        <button onClick={toggleSidebar} className="hidden lg:block absolute -right-[1.1rem] bg-white top-[2.75rem] p-2 border rounded-full text-gray-500 z-10">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <nav className='h-[calc(100vh-170px)] md:h-full flex flex-col'>
          <ul className='flex flex-col gap-2 px-4 flex-grow'>
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <li key={index} className="flex items-center space-x-4 py-2 text-nowrap cursor-pointer hover:bg-gray-50 px-2 rounded-md">
                  <Link to={link.path} className="flex items-center gap-2 w-full h-full">
                    <Icon className='w-5 h-5 text-gray-400 ' />
                    <span className={`text-sm duration-200 text-gray-500 ${!isOpen && 'scale-0 absolute'}`}>
                      {link.title}</span>
                  </Link>
                </li>
              );
            })}
            {branch && <li className="flex space-x-4 py-2 text-nowrap cursor-pointer hover:bg-gray-50 px-2 rounded-md">
              <button
                onClick={() => setIsOpenSettings(true)}
                className="flex items-center gap-2 w-full h-full">
                <Settings className='w-5 h-5 text-gray-400 ' />
                <span className={`text-sm duration-200 text-gray-500 ${!isOpen && 'scale-0 absolute'}`}>
                  Settings</span>
              </button>
            </li>}
          </ul>
          {/* logout */}
          <ul className='p-4'>
            <li className="flex space-x-4 py-2 text-nowrap cursor-pointer hover:bg-gray-50 px-2 rounded-md">
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full h-full">
                <LogOut className='w-5 h-5 text-red-400 ' />
                <span className={`text-sm duration-200 text-red-500 font-medium ${!isOpen && 'scale-0 absolute'}`}>
                  Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
