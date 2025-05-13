


import React, { useRef, useEffect, useState } from 'react';
import { 
  FaHome, 
  FaStore, 
  FaUserTie, 
  FaBoxes, 
  FaShoppingCart, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaStar,
  FaCoffee
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

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
    { 
      to: '', 
      label: 'Dashboard', 
      icon: <FaHome className="text-xl" />
    },
    {
      to: 'branchesList',
      label: 'Manage Branches',
      icon: <FaStore className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/branchesList',
        '/branchOwnerPanel/branchOwnerDashboard/addBranch',
        '/branchOwnerPanel/branchOwnerDashboard/updatebranch',
        '/branchOwnerPanel/branchOwnerDashboard/viewbranch',
        '/branchOwnerPanel/branchOwnerDashboard/viewBranchProduct'
      ],
    },
    { 
      to: 'salespersonsList', 
      label: 'Manage Salespersons',
      icon: <FaUserTie className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/salespersonsList',
        '/branchOwnerPanel/branchOwnerDashboard/addSalesperson'
      ]
    },
    { 
      to: 'productsList', 
      label: 'Manage Products',
      icon: <FaBoxes className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/productsList',
        '/branchOwnerPanel/branchOwnerDashboard/addProduct',
        '/branchOwnerPanel/branchOwnerDashboard/viewProduct',
        '/branchOwnerPanel/branchOwnerDashboard/updateProduct'
      ]
    },
    { 
      to: 'ordersList', 
      label: 'Manage Orders',
      icon: <FaShoppingCart className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/ordersList',
        '/branchOwnerPanel/branchOwnerDashboard/OrdersPaymentHistory'
      ]
    },
    { 
      to: 'saleEventsList', 
      label: 'Manage Sale Events',
      icon: <FaCalendarAlt className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/saleEventsList', 
        '/branchOwnerPanel/branchOwnerDashboard/createSaleEvent', 
        '/branchOwnerPanel/branchOwnerDashboard/updateSaleEvent'
      ]
    },
    { 
      to: 'manageSubscriptions', 
      label: 'Manage Subscriptions',
      icon: <FaCreditCard className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/manageSubscriptions'
      ]
    },
    { 
      to: 'manageProductReviews', 
      label: 'Manage Product Reviews',
      icon: <FaStar className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/manageProductReviews'
      ]
    },
    { 
      to: 'manageGiftCards', 
      label: 'Manage Gift Cards',
      icon: <FaStar className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/manageGiftCards'
      ]
    },
    { 
      to: 'analytics', 
      label: 'Analytics',
      icon: <FaStar className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/branchOwnerDashboard/analytics'
      ]
    },
  
  ];

  return (
    <div
      ref={sidebarRef}
      className={`${
        isSidebarOpen ? 'w-64' : 'hidden'
      } sm:w-64 bg-gradient-to-b from-[#603F26] to-[#4a2e18] text-white h-full fixed top-10 left-0 transition-all duration-300 border-r-4 border-[#8e6c4f] z-40 shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Header with logo */}
        <div className="text-center py-6 border-b border-[#8e6c4f]/50">
          {/* <div className="flex items-center justify-center mb-2">
            <FaCoffee className="text-4xl text-[#f0c78a]" />
          </div> */}
          <div className="bg-[#8e6c4f] mx-auto w-4/5 rounded-lg p-2 shadow-md mt-9">
            <h1 className="font-bold text-2xl text-[#f9e9d5]">Branch Owner</h1>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon, activePaths }, index) => {
              const isActive = activePaths
                ? activePaths.some((path) => activeLink.startsWith(path))
                : activeLink === `/${to}`;
              
              return (
                <li key={index}>
                  <Link
                    to={to}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#8e6c4f] shadow-md text-white font-medium'
                        : 'hover:bg-[#8e6c4f]/70 text-[#f0c78a]'
                    }`}
                    onClick={handleSideBar}
                  >
                    <div className="w-6 flex justify-center">
                      {icon}
                    </div>
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 text-center text-sm text-[#f0c78a]/70 border-t border-[#8e6c4f]/50">
          © 2025 Branch Management
        </div>
      </div>
    </div>
  );
};

export default SideBar;