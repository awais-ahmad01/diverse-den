import React, { useRef, useEffect, useState } from 'react';
import { FaHome, FaBox } from 'react-icons/fa';
import { Link, useLocation, useMatch } from 'react-router-dom';

const SideBar = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, hamburgerRef }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  

  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleSideBar = () => {
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 640) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navItems = [
    { to: '', label: 'Dashboard', icon: <FaHome /> },
    {
      to: 'branchesList',
      label: 'Manage Branches',
      icon: <FaBox />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/branchesList',
      '/branchOwnerPanel/branchOwnerDashboard/addBranch',
      '/branchOwnerPanel/branchOwnerDashboard/updatebranch',
      ],
    },
    { to: 'salespersonsList', label: 'Manage Salespersons', icon: <FaHome/>,
      activePaths:[
        '/branchOwnerPanel/branchOwnerDashboard/salespersonsList',
        '/branchOwnerPanel/branchOwnerDashboard/addSalesperson'
      ]
     },
    { to: 'productsList', label: 'Manage Products', icon: <FaBox />,
      activePaths:[
        '/branchOwnerPanel/branchOwnerDashboard/productsList',
        '/branchOwnerPanel/branchOwnerDashboard/addProduct',
      ]
     },
    // Add other items as needed
  ];

  return (
    <div
      ref={sidebarRef}
      className={`${
        isSidebarOpen ? 'w-64' : 'hidden'
      } sm:w-64 bg-[#603F26] text-white h-full p-5 fixed top-10 left-0 transition-all duration-300 border-r-4 border-[#8e6c4f] z-40`}
    >
      <nav className="my-2">
        <ul>
          {navItems.map(({ to, label, icon, activePaths }, index) => (
            <li key={index} className="mb-2">
              <Link
                to={to}
                className={`flex items-center gap-3 p-2 rounded transition-colors ${
                  activePaths
                    ?.some((path) => activeLink.startsWith(path))
                      ? 'bg-[#8e6c4f]'
                      : 'hover:bg-[#8e6c4f]'
                    
                }`}
                onClick={handleSideBar}
              >
                {icon} {isSidebarOpen && <span className="font-bold">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
