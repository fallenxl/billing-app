import {
  Home,
  ChevronRight,
  ChevronLeft,
  Settings,
  LogOut,
  CircleX,
  CircleCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../interfaces/app-state/app-state';
import { useEffect, useState } from 'react';
import { Modal } from '../modal/Modal';
import { SetAssetAttributesService } from '../../services/assets/asset.services';
import { setBranch } from '../../store/slices/branch.slice';


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

}
interface IAlert {
  type: 'error' | 'success';
  message: string;
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
  const dispatch = useDispatch();
  const branch = useSelector((state: AppState) => state.branch);

  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [settings, setSettings] = useState({
    "currency": branch?.settings.currency ?? 'LPS',
    "rate": branch?.settings.rate,
    "units": branch?.settings.units,
    "eneeTariff": branch?.settings.eneeTariff
  });

  useEffect(() => {
    if (branch?.settings) {
      setSettings({
        "currency": branch.settings.currency,
        "rate": branch.settings.rate,
        "units": branch.settings.units,
        "eneeTariff": branch.settings.eneeTariff
      })
    }
  }, [branch])

  function handleSettingsChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, ariaChecked } = e.target;
    const [key, subKey] = name.split('.');
    if (subKey) {
      setSettings((prev: any) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [subKey]: type === 'number' ? parseFloat(value) : value
        }
      }))
    } else if (ariaChecked) {
      setSettings((prev: any) => ({
        ...prev,
        [key]: !prev[key]
      }))
    } else {
      setSettings((prev: any) => ({
        ...prev,
        [key]: type === 'number' ? parseFloat(value) : value
      }))
    }

  }

  function handleSettingsSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (branch) {
      SetAssetAttributesService(branch.id, {
        "settings": settings
      }).then((response) => {
        if (!response) {
          setAlert({
            type: 'error',
            message: 'Error saving settings'
          })
          return 
        }
        const payload = {
          ...branch,
          settings: settings
        }
        setAlert({
          type: 'success',
          message: 'Settings saved successfully'
        })
        dispatch(setBranch(payload))
      }
      )
    }
  }
  useEffect(() => {
    if (isOpenSettings) {
      setAlert(null)
    }
  }, [isOpenSettings])

  const [alert, setAlert] = useState<IAlert | null>(null);
  return (
    <>
      {/* modal settings */}
      {isOpenSettings &&

        <Modal isOpen={isOpenSettings} setIsOpen={setIsOpenSettings} title="Settings">
          <div className="flex flex-col gap-4">
            {
              alert && (
                <div className={`p-2 text-sm flex items-center gap-4 rounded-md text-white ${alert.type === 'error' ? 'bg-red-400' : 'bg-green-500'}`}>
                  {alert.type === 'error' ? <CircleX size={20} /> : <CircleCheck size={20} />}
                  {alert.message}
                </div>
              )
            }
            <form className='flex flex-col gap-4' onSubmit={handleSettingsSave}>
              <div className='flex flex-col gap-1'>
                <label htmlFor="branchName" className='font-medium text-sm text-gray-500'>Branch Name</label>
                <input
                  value={branch?.toName}
                  type="text" placeholder="Branch Name" className="w-full p-2 border rounded-md" />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="branchName" className='font-medium text-sm text-gray-500'>Currency</label>
                <select name='currency' value={settings.currency}
                  onChange={handleSettingsChange}
                  className="w-full p-2 border rounded-md ">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="LPS">LPS</option>
                </select>
              </div>
              {/* rate */}
              <small className='text-gray-500 text-sm font-medium'>Tariff</small>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Energy Tariff</label>
                  <input
                    name='rate.energy'
                    onChange={handleSettingsChange}
                    value={settings.rate?.energy ?? 0}
                    type="number" placeholder="Energy Rate" className="w-full p-2 border rounded-md" />
                  <div className='flex items-center gap-2 mt-2'>
                    <input type='checkbox' className='' checked={settings.eneeTariff} name='eneeTariff' onChange={handleSettingsChange} aria-checked={settings.eneeTariff} />
                    <small className='text-xs text-gray-500'>ENEE Tariff <span className='font-bold text-[0.6rem]'>(beta)</span></small>
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Water Tariff</label>
                  <input
                    name='rate.water'
                    onChange={handleSettingsChange}
                    value={settings.rate?.water ?? 0}
                    type="number" placeholder="Water Rate" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Gas Tariff</label>
                  <input
                    name='rate.gas'
                    value={settings.rate?.gas ?? 0}
                    onChange={handleSettingsChange}
                    type="number" placeholder="Gas Rate" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Air Tariff</label>
                  <input
                    name='rate.air'
                    onChange={handleSettingsChange}
                    value={settings.rate?.air ?? 0}
                    type="number" placeholder="Air Rate" className="w-full p-2 border rounded-md" />
                </div>
              </div>
              {/* units */}
              <small className='text-gray-500 text-sm font-medium'>Units</small>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Energy Unit</label>
                  <input
                    name='units.energy'
                    onChange={handleSettingsChange}
                    value={settings.units?.energy ?? ''}
                    type="text" placeholder="Energy Unit" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Water Unit</label>
                  <input
                    name='units.water'
                    onChange={handleSettingsChange}
                    value={settings.units?.water ?? ''}
                    type="text" placeholder="Water Unit" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Gas Unit</label>
                  <input
                    name='units.gas'
                    onChange={handleSettingsChange}
                    value={settings.units?.gas ?? ''}
                    type="text" placeholder="Gas Unit" className="w-full p-2 border rounded-md" />
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="energyRate" className='font-medium text-xs text-gray-500'>Air Unit</label>
                  <input

                    name='units.air'
                    onChange={handleSettingsChange}
                    value={settings.units?.air ?? ''}
                    type="text" placeholder="Air Unit" className="w-full p-2 border rounded-md" />
                </div>
              </div>

              <div className='flex gap-4 mt-4'>
                <span
                onClick={() => 
                  setIsOpenSettings(false)
                  }
                className='flex-grow bg-gray-400 text-white p-2 rounded-md text-center cursor-pointer'>Cancel</span>
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
