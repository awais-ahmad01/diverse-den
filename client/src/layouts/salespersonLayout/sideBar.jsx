// import React, { useRef, useEffect, useState } from 'react';
// import { FaHome, FaBox } from 'react-icons/fa';
// import { Link, useLocation, useMatch } from 'react-router-dom';

// const SideBar = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, hamburgerRef }) => {
//   const sidebarRef = useRef(null);
//   const location = useLocation();

  

//   const [activeLink, setActiveLink] = useState(location.pathname);

//   const handleSideBar = () => {
//     if (window.innerWidth < 640) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (
//       isSidebarOpen &&
//       sidebarRef.current &&
//       !sidebarRef.current.contains(event.target) &&
//       !hamburgerRef.current.contains(event.target)
//     ) {
//       setIsSidebarOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isSidebarOpen && window.innerWidth < 640) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }
//   }, [isSidebarOpen]);

//   useEffect(() => {
//     setActiveLink(location.pathname);
//   }, [location]);
//   console.log('active', activeLink)

//   const navItems = [
//     { to: '', label: 'Dashboard'},
//     {
//       to: 'manageOrders',
//       label: 'Manage Orders',
      
//       activePaths: [
//         '/branchOwnerPanel/salespersonDashboard/manageOrders',
//       ],
//     },
//     {
//       to: 'manageInventory',
//       label: 'Manage Inventory',
      
//       activePaths: [
//         '/branchOwnerPanel/salespersonDashboard/manageInventory',
//       ],
//     },
//     {
//       to: 'manageChats',
//       label: 'Chats',
      
//       activePaths: [
//         '/branchOwnerPanel/salespersonDashboard/manageChats',
//       ],
//     },

   
   
//   ];

//   return (
//     <div
//       ref={sidebarRef}
//       className={`${
//         isSidebarOpen ? 'w-64' : 'hidden'
//       } sm:w-64 bg-[#603F26] text-white h-full p-5 py-10 fixed top-10 left-0 transition-all duration-300 border-r-4 border-[#8e6c4f] z-40`}
//     >
//       <nav className="my-2">
        
//         <ul>
//           {navItems.map(({ to, label, icon, activePaths }, index) => (
//             <li key={index} className="mb-2">
//               <Link
//                 to={to}
//                 className={`flex items-center gap-3 p-2 rounded transition-colors ${
//                   activePaths
//                     ?.some((path) => activeLink.startsWith(path))
//                       ? 'bg-[#8e6c4f]'
//                       : 'hover:bg-[#8e6c4f]'
                    
//                 }`}
//                 onClick={handleSideBar}
//               >
//                 {icon} {isSidebarOpen && <span className="font-bold">{label}</span>}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );

// };

// export default SideBar;



import React, { useRef, useEffect, useState } from 'react';
import { 
  FaHome, 
  FaShoppingCart, 
  FaBoxOpen, 
  FaComments,
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
      to: 'manageOrders',
      label: 'Manage Orders',
      icon: <FaShoppingCart className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/salespersonDashboard/manageOrders',
      ],
    },
    {
      to: 'manageInventory',
      label: 'Manage Inventory',
      icon: <FaBoxOpen className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/salespersonDashboard/manageInventory',
      ],
    },
    {
      to: 'businessInventory',
      label: 'Business Inventory',
      icon: <FaBoxOpen className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/salespersonDashboard/businessInventory',
        '/branchOwnerPanel/salespersonDashboard/viewProduct'
      ],
    },
    {
      to: 'branchesInventory',
      label: 'Branches Inventory',
      icon: <FaBoxOpen className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/salespersonDashboard/branchesInventory',
        '/branchOwnerPanel/salespersonDashboard/viewBranchProduct',
        '/branchOwnerPanel/salespersonDashboard/viewBranchProducts'
      ],
    },
    {
      to: 'manageChats',
      label: 'Chats',
      icon: <FaComments className="text-xl" />,
      activePaths: [
        '/branchOwnerPanel/salespersonDashboard/manageChats',
      ],
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
            <h1 className="font-bold text-2xl text-[#f9e9d5]">Salesperson</h1>
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

     
      </div>
    </div>
  );
};

export default SideBar;