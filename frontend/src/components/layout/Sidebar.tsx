import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={'sidebar ' + className}>
      <div className="sidebar-header">
        <Link to="/" className="no-underline">
          <img 
            src="/urbano-logo-white.png" 
            alt="Urbano Logo" 
            className="sidebar-logo"
          />
        </Link>
      </div>
      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="sidebar-item text-white rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none hover:bg-white hover:bg-opacity-20"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
