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
            { name: "T-shirts", link: "subCategory/Clothing/Men/T-shirts" },
            { name: "Shirts", link: "subCategory/Clothing/Men/Shirts" },
            { name: "Pants", link: "subCategory/Clothing/Men/Pants" },
            { name: "Jackets", link: "subCategory/Clothing/Men/Jackets" },
            { name: "Jeans", link: "subCategory/Clothing/Men/Jeans" },
            { name: "Sweaters", link: "subCategory/Clothing/Men/Sweaters" },
            { name: "Shorts", link: "subCategory/Clothing/Men/Shorts" },
            { name: "Underwear", link: "subCategory/Clothing/Men/Underwear" }
          ]
        },
        Women: {
          label: "WOMEN",
          link: "/clothing/women",
          items: [
            { name: "T-shirts", link: "subCategory/Clothing/Women/T-shirts"},
            { name: "Shirts", link: "subCategory/Clothing/Women/Shirts"},
            { name: "Dresses", link: "subCategory/Clothing/Women/Dresses" },
            { name: "Jeans", link: "subCategory/Clothing/Women/Jeans" },
            { name: "Skirts", link: "subCategory/Clothing/Women/Skirts" },
            { name: "Pants", link: "subCategory/Clothing/Women/Pants" },
            { name: "Jackets", link: "subCategory/clothing/Women/Jackets" },
            { name: "Sweaters", link: "subCategory/Clothing/Women/Sweaters" }
          ]
        },
        Kids: {
          label: "KIDS",
          link: "/clothing/kids",
          items: [
            { name: "T-shirts", link: "subCategory/Clothing/Kids/T-shirts" },
            { name: "Shirts", link: "subCategory/Clothing/Kids/Shirts" },
            { name: "Pants", link: "subCategory/Clothing/Kids/Pants" },
            { name: "jeans", link: "subCategory/Clothing/Kids/Jeans" },
            { name: "Jackets", link: "subCategory/Clothing/Kids/Jacktes"},
            { name: "Sweaters", link: "subCategory/Clothing/Kids/Sweaters" },
            { name: "Shorts", link: "subCategory/Clothing/Kids/Shorts" },
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
            { name: "Sneakers", link: "subCategory/Shoes/Men/Sneakers" },
            { name: "Dress Shoes", link: "subCategory/Shoes/Men/Dress Shoes" },
            { name: "Loafers", link: "subCategory/Shoes/Men/Loafers" },
            { name: "Sandals", link: "subCategory/Shoes/Men/Sandals" },
            { name: "Athletic Shoes", link: "subCategory/Shoes/Men/Athletic Shoes" },
         
          ]
        },
        Women: {
          label: "WOMEN",
          link: "/shoes/women",
          items: [
            { name: "Heels", link: "subCategory/Shoes/Women/Heels" },
            { name: "Casual Shoes", link: "subCategory/Shoes/Women/Casual Shoes" },
            { name: "Sneakers", link: "subCategory/Shoes/Women/Sneakers" },
            { name: "Athletic Shoes", link: "subCategory/Shoes/Women/Athletic Shoes" },
            { name: "Sandals", link: "subCategory/shoes/women/sandals" }
          ]
        },
        Kids: {
          label: "KIDS",
          link: "/shoes/kids",
          items: [
            { name: "School Shoes", link: "subCategory/Shoes/Kids/School Shoes" },
            { name: "Sneakers", link: "subCategory/Shoes/Kids/Sneakers" },
            { name: "Athletic Shoes", link: "subCategory/Shoes/kids/Atheltic Shoes" },
            { name: "Sandals", link: "subCategory/Shoes/Kids/Sandals" }
          ]
        }
      }
    },

    Furniture: {
      label: "FURNITURE",
      type: "simple",
      link: "/furniture",
      submenu: [
        { name: "Sofas", link: "subCategory/Furniture/Sofas" },
        { name: "Chairs", link: "subCategory/Furniture/Chairs" },
        { name: "Tables", link: "subCategory/Furniture/Tables" },
        { name: "Beds", link: "subCategory/Furniture/Beds" },
        { name: "Cabinets", link: "subCategory/Furniture/Cabinets" },
        { name: "Wardrobes", link: "subCategory/Furniture/Wardrobes" },
        { name: "Shelving Units", link: "subCategory/Furniture/Shelving Units" },
        { name: "Dinning Sets", link: "subCategory/Furniture/Dinning Sets" }
      ]
    },
    Decoration: {
      label: "DECORATION",
      type: "simple",
      link: "/decoration",
      submenu: [
        { name: "Wall Art", link: "subCategory/Decoration/Wall Art" },
        { name: "Sculptures", link: "subCategory/Decoration/Sculptures" },
        { name: "Picture Frames", link: "subCategory/Decoration/Picture Frames" },
        { name: "Mirrors", link: "subCategory/decoration/Mirrors" },
        { name: "Candle Holders", link: "subCategory/Decoration/Candle Holders" }
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