import React, { useState } from "react";
import { Link } from "react-router-dom"; // Make sure to import if using React Router

const NavigationBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const navItems = {
    Clothing: {
      label: "CLOTHING",
      type: "complex",
      link: "/clothing",
      submenu: {
        Men: {
          label: "MEN",
          link: "/clothing/men",
          items: [
            { name: "T-shirts", link: "/Clothing/Men/T-shirts" },
            { name: "Shirts", link: "/Clothing/Men/Shirts" },
            { name: "Pants", link: "/Clothing/Men/Pants" },
            { name: "Jackets", link: "/Clothing/Men/Jackets" },
            { name: "Jeans", link: "/Clothing/Men/Jeans" },
            { name: "Sweaters", link: "/Clothing/Men/Sweaters" },
            { name: "Shorts", link: "/Clothing/Men/Shorts" },
            { name: "Underwear", link: "/Clothing/Men/Underwear" }
          ]
        },
        Women: {
          label: "WOMEN",
          link: "/clothing/women",
          items: [
            { name: "T-shirts", link: "/Clothing/Women/T-shirts"},
            { name: "Shirts", link: "/Clothing/Women/Shirts"},
            { name: "Dresses", link: "/Clothing/Women/Dresses" },
            { name: "Jeans", link: "/Clothing/Women/Jeans" },
            { name: "Skirts", link: "/Clothing/Women/Skirts" },
            { name: "Pants", link: "/Clothing/Women/Pants" },
            { name: "Jackets", link: "/clothing/Women/Jackets" },
            { name: "Sweaters", link: "/Clothing/Women/Sweaters" }
          ]
        },
        Kids: {
          label: "KIDS",
          link: "/clothing/kids",
          items: [
            { name: "T-shirts", link: "/Clothing/Kids/T-shirts" },
            { name: "Shirts", link: "/Clothing/Kids/Shirts" },
            { name: "Pants", link: "/Clothing/Kids/Pants" },
            { name: "jeans", link: "/Clothing/Kids/Jeans" },
            { name: "Jackets", link: "/Clothing/Kids/Jacktes"},
            { name: "Sweaters", link: "/Clothing/Kids/Sweaters" },
            { name: "Shorts", link: "/Clothing/Kids/Shorts" },
          ]
        }
      }
    },
    Shoes: {
      label: "SHOES",
      type: "complex",
      link: "/shoes",
      submenu: {
        Men: {
          label: "MEN",
          link: "/shoes/men",
          items: [
            { name: "Sneakers", link: "/Shoes/Men/Sneakers" },
            { name: "Dress Shoes", link: "/Shoes/Men/Dress Shoes" },
            { name: "Loafers", link: "/Shoes/Men/Loafers" },
            { name: "Sandals", link: "/Shoes/Men/Sandals" },
            { name: "Athletic Shoes", link: "/Shoes/Men/Athletic Shoes" },
         
          ]
        },
        Women: {
          label: "WOMEN",
          link: "/shoes/women",
          items: [
            { name: "Heels", link: "/Shoes/Women/Heels" },
            { name: "Casual Shoes", link: "/Shoes/Women/Casual Shoes" },
            { name: "Sneakers", link: "/Shoes/Women/Sneakers" },
            { name: "Athletic Shoes", link: "/Shoes/Women/Athletic Shoes" },
            { name: "Sandals", link: "/shoes/women/sandals" }
          ]
        },
        Kids: {
          label: "KIDS",
          link: "/shoes/kids",
          items: [
            { name: "School Shoes", link: "/Shoes/Kids/School Shoes" },
            { name: "Sneakers", link: "/Shoes/Kids/Sneakers" },
            { name: "Athletic Shoes", link: "/Shoes/kids/Atheltic Shoes" },
            { name: "Sandals", link: "/Shoes/Kids/Sandals" }
          ]
        }
      }
    },

    Furniture: {
      label: "FURNITURE",
      type: "simple",
      link: "/furniture",
      submenu: [
        { name: "Sofas", link: "/Furniture/Sofas" },
        { name: "Chairs", link: "/Furniture/Chairs" },
        { name: "Tables", link: "/Furniture/Tables" },
        { name: "Beds", link: "/Furniture/Beds" },
        { name: "Cabinets", link: "/Furniture/Cabinets" },
        { name: "Wardrobes", link: "/Furniture/Wardrobes" },
        { name: "Shelving Units", link: "/Furniture/Shelving Units" },
        { name: "Dinning Sets", link: "/Furniture/Dinning Sets" }
      ]
    },
    Decoration: {
      label: "DECORATION",
      type: "simple",
      link: "/decoration",
      submenu: [
        { name: "Wall Art", link: "/Decoration/Wall Art" },
        { name: "Sculptures", link: "/Decoration/Sculptures" },
        { name: "Picture Frames", link: "/Decoration/Picture Frames" },
        { name: "Mirrors", link: "/decoration/Mirrors" },
        { name: "Candle Holders", link: "/Decoration/Candle Holders" }
      ]
    }
  };
  

  const handleMouseEnter = (category) => {
    setActiveCategory(category);
  };

  const handleSubMenuEnter = (subCategory) => {
    setActiveSubCategory(subCategory);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setActiveSubCategory(null);
  };

  const renderSubmenu = () => {
    const category = navItems[activeCategory];
    if (!category) return null;

    return (
      <div className="absolute w-full bg-[#8e6c4f] shadow-lg">
        <div className="flex items-start gap-8 px-10 py-4">
          {category.type === "complex" ? (
            
            Object.entries(category.submenu).map(([subKey, subItem]) => (
              <div 
                key={subKey}
                className="relative"
                onMouseEnter={() => handleSubMenuEnter(subKey)}
              >
                <Link 
                  // to={subItem.link}
                  className="text-white hover:text-[#fffcf2] transition-colors 
                           duration-200 font-medium mb-2 text-sm block"
                >
                  {subItem.label}
                </Link>
                
                {activeSubCategory === subKey && (
                  <div className="absolute left-0 mt-1 bg-[#8e6c4f] shadow-lg 
                                rounded-md p-2 min-w-[160px]">
                    {subItem.items.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.link}
                        className="block w-full text-left px-3 py-2 text-sm
                                 text-white hover:bg-[#704f37] rounded-md
                                 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            // Simple submenu (Furniture and Decoration)
            category.submenu.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="text-white hover:bg-[#704f37] px-4 py-2 rounded-md
                         transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <nav 
      className="fixed top-[85px] w-full z-50"
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Navigation Bar */}
      <div className="bg-[#8e6c4f] py-[2px] px-8 hidden md:flex justify-start items-center gap-6 shadow-lg">
        {Object.entries(navItems).map(([key, item]) => (
          <Link
            key={key}
            // to={item.link}
            className="text-white hover:bg-[#704f37] px-4 py-2 rounded-md 
                     transition-colors duration-200 font-medium text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#704f37]"
            onMouseEnter={() => handleMouseEnter(key)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Submenu Container */}
      {activeCategory && (
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(activeCategory)}
        >
          {renderSubmenu()}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;