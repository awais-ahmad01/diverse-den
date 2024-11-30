import React, { useRef, useEffect } from 'react';
import { FaHome, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

const SideBar = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, hamburgerRef }) => {
  const sidebarRef = useRef(null); 


  const handleSideBar = () => {
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };



  
  const handleClickOutside = (event) => {

    console.log("SideBArRef: ", sidebarRef)

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
      } else {
        document.removeEventListener('mousedown', handleClickOutside);  
      }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[isSidebarOpen])

  return (
    <div
      ref={sidebarRef}
      className={`${
        isSidebarOpen ? 'w-64' : 'hidden'
      } sm:w-64 bg-[#603F26] text-white h-full p-5 fixed top-10
         left-0 transition-all duration-300 border-r-4 border-[#8e6c4f] z-40`}
    >

      {/* <div className='mb-2'>
        <h1 className='text-2xl font-bold p-2'>Branch Owner</h1>
      </div> */}
      <nav className='my-2'>
        <ul>
          <li className='mb-2'>
            <Link 
              to="" 
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaHome /> {isSidebarOpen && <span className='font-bold'>Dashboard</span>}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              to="branchesList"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaBox /> {isSidebarOpen && <span className='font-bold'>Manage Branches</span>}
            </Link>
          </li>

          

          <li className='mb-2'>
            <Link 
              to="" 
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaHome /> {isSidebarOpen && <span className='font-bold'>Manage Salespersons</span>}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              to="branchesList"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaBox /> {isSidebarOpen && <span className='font-bold'>Manage Products</span>}
            </Link>
          </li>

          <li className='mb-2'>
            <Link 
              to="" 
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaHome /> {isSidebarOpen && <span className='font-bold'>Manage Orders</span>}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              to="branchesList"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaBox /> {isSidebarOpen && <span className='font-bold'>Reports and Analytics</span>}
            </Link>
          </li>

          <li className='mb-2'>
            <Link 
              to="" 
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaHome /> {isSidebarOpen && <span className='font-bold'>Product Reviews</span>}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              to="branchesList"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaBox /> {isSidebarOpen && <span className='font-bold'>Gift Cards</span>}
            </Link>
          </li>

          <li className='mb-2'>
            <Link 
              to="" 
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaHome /> {isSidebarOpen && <span className='font-bold'>Sale Events</span>}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              to="branchesList"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaBox /> {isSidebarOpen && <span className='font-bold'>Chat</span>}
            </Link>
          </li>

          <li className='mb-2'>
            <Link
              to="branchesList"
              className="flex items-center gap-3 p-2 rounded hover:bg-[#8e6c4f] transition-colors"
              onClick={() => handleSideBar()}  
            >
              <FaBox /> {isSidebarOpen && <span className='font-bold'>Subscriptions</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
