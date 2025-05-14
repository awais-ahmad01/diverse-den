import React, { useRef, useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCreditCard,
  FaMotorcycle,
  FaChartBar,
  FaStore
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminSideBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  toggleSidebar,
  hamburgerRef,
}) => {
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
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navItems = [
    // {
    //   to: "",
    //   label: "Dashboard",
    //   icon: <FaHome className="text-xl" />,
    // },
    {
      to: "manageUsers",
      label: "Manage Users",
      icon: <FaUsers className="text-xl" />,
      activePaths: ["/adminPanel/manageUsers"],
    },
    {
      to: "manageBusinesses",
      label: "Manage Businesses",
      icon: <FaStore className="text-xl" />,
      activePaths: [
        "/adminPanel/manageBusinesses",
        "/adminPanel/businessProducts",
        "/adminPanel/viewProduct",
      ],
    },
    {
      to: "manageRiders",
      label: "Manage Riders",
      icon: <FaMotorcycle className="text-xl" />,
      activePaths: ["/adminPanel/manageRiders"],
    },
    {
      to: "manageSubscriptionPlans",
      label: "Manage Subscriptions",
      icon: <FaCreditCard className="text-xl" />,
      activePaths: ["/adminPanel/manageSubscriptionPlans"],
    },
    {
      to: "analytics",
      label: "Analytics",
      icon: <FaChartBar className="text-xl" />,
      activePaths: ["/adminPanel/analytics"],
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`${
        isSidebarOpen ? "w-64" : "hidden"
      } sm:w-64 bg-gradient-to-b from-[#603F26] to-[#4a2e18] text-white h-full fixed top-10 left-0 transition-all duration-300 border-r-4 border-[#8e6c4f] z-40 shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Header with logo */}
        <div className="text-center py-6 border-b border-[#8e6c4f]/50">
          {/* <div className="flex items-center justify-center mb-2">
            <FaCoffee className="text-4xl text-[#f0c78a]" />
          </div> */}
          <div className="bg-[#8e6c4f] mx-auto w-4/5 rounded-lg p-2 mt-9 shadow-md">
            <h1 className="font-bold text-2xl text-[#f9e9d5]">Admin</h1>
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
                        ? "bg-[#8e6c4f] shadow-md text-white font-medium"
                        : "hover:bg-[#8e6c4f]/70 text-[#f0c78a]"
                    }`}
                    onClick={handleSideBar}
                  >
                    <div className="w-6 flex justify-center">{icon}</div>
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {/* <div className="p-4 text-center text-sm text-[#f0c78a]/70 border-t border-[#8e6c4f]/50">
          © 2025 Admin Dashboard
        </div> */}
      </div>
    </div>
  );
};

export default AdminSideBar;
