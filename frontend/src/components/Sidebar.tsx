import { memo, useCallback, useMemo } from 'react';
import { LogOut, ChevronDown, Notebook, LucideHome, StarIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useContentStore } from '../store/useContentStore';

const Sidebar = memo(() => {
  const { activePage, setActivePage } = useContentStore();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('Authorization');
    toast.success("Logged out!");
    navigate('/signin');
  }, [navigate]);

  const navigationItems = useMemo(() => [
    {
      id: 'home',
      icon: <LucideHome className="w-5 h-5" />,
      label: 'Home'
    },
    {
      id: 'favorites',
      icon: <StarIcon className="w-5 h-5" />,
      label: 'Favorites'
    }
  ], []);

  const getItemClassName = useCallback((itemId: string) => {
    return `flex items-center gap-2 px-3 py-2 rounded-lg hover:cursor-pointer transition-colors ${
      activePage === itemId
        ? 'text-purple-600 bg-purple-50'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  }, [activePage]);

  return (
    <div className="w-full h-screen bg-white border-r border-gray-200 flex flex-col position-fixed">

      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <Notebook className='text-purple-500 size-6' />
        <div className="text-xl text-black font-semibold">AI Note</div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map(item => (
          <div
            key={item.id}
            className={getItemClassName(item.id)}
            onClick={() => setActivePage(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-gray-100 transition-colors">
            <div className='flex justify-center items-center bg-black rounded-full p-1 size-6'>{authUser?.username.at(0)}</div>
            <span className="flex-1 text-left text-black ml-1">{authUser?.username}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;