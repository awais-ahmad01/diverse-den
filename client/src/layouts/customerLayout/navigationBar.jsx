import React, { useState } from "react";
import { Link } from "react-router-dom"; // Make sure to import if using React Router

const NavigationBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const navItems = {
    clothing: {
      label: "CLOTHING",
      type: "complex",
      link: "/clothing",
      submenu: {
        men: {
          label: "MEN",
          link: "/clothing/men",
          items: [
            { name: "T-Shirts", link: "subCategory/clothing/men/t-shirts" },
            { name: "Shirts", link: "subCategory/clothing/men/shirts" },
            { name: "Pants", link: "subCategory/clothing/men/pants" },
            { name: "Jackets", link: "subCategory/clothing/men/jackets" },
            { name: "Suits", link: "subCategory/clothing/men/suits" },
            { name: "Activewear", link: "subCategory/clothing/men/activewear" }
          ]
        },
        women: {
          label: "WOMEN",
          link: "/clothing/women",
          items: [
            { name: "Dresses", link: "subCategory/clothing/women/dresses" },
            { name: "Tops", link: "subCategory/clothing/women/tops" },
            { name: "Skirts", link: "subCategory/clothing/women/skirts" },
            { name: "Pants", link: "subCategory/clothing/women/pants" },
            { name: "Jackets", link: "subCategory/clothing/women/jackets" },
            { name: "Activewear", link: "subCategory/clothing/women/activewear" }
          ]
        },
        kids: {
          label: "KIDS",
          link: "/clothing/kids",
          items: [
            { name: "Boys", link: "subCategory/clothing/kids/boys" },
            { name: "Girls", link: "subCategory/clothing/kids/girls" },
            { name: "Infants", link: "subCategory/clothing/kids/infants" },
            { name: "Teenagers", link: "subCategory/clothing/kids/teenagers" },
            { name: "School Wear", link: "subCategory/clothing/kids/school-wear" }
          ]
        }
      }
    },
    shoes: {
      label: "SHOES",
      type: "complex",
      link: "/shoes",
      submenu: {
        men: {
          label: "MEN",
          link: "/shoes/men",
          items: [
            { name: "Casual", link: "subCategory/shoes/men/casual" },
            { name: "Formal", link: "subCategory/shoes/men/formal" },
            { name: "Sports", link: "subCategory/shoes/men/sports" },
            { name: "Sandals", link: "subCategory/shoes/men/sandals" },
            { name: "Boots", link: "subCategory/shoes/men/boots" }
          ]
        },
        women: {
          label: "WOMEN",
          link: "/shoes/women",
          items: [
            { name: "Heels", link: "subCategory/shoes/women/heels" },
            { name: "Flats", link: "subCategory/shoes/women/flats" },
            { name: "Sneakers", link: "subCategory/shoes/women/sneakers" },
            { name: "Boots", link: "subCategory/shoes/women/boots" },
            { name: "Sandals", link: "subCategory/shoes/women/sandals" }
          ]
        },
        kids: {
          label: "KIDS",
          link: "/shoes/kids",
          items: [
            { name: "School Shoes", link: "subCategory/shoes/kids/school" },
            { name: "Sports", link: "subCategory/shoes/kids/sports" },
            { name: "Casual", link: "subCategory/shoes/kids/casual" },
            { name: "Sandals", link: "subCategory/shoes/kids/sandals" }
          ]
        }
      }
    },
    furniture: {
      label: "FURNITURE",
      type: "simple",
      link: "/furniture",
      submenu: [
        { name: "Living Room", link: "subCategory/furniture/living-room/" },
        { name: "Bedroom", link: "subCategory/furniture/bedroom" },
        { name: "Office", link: "subCategory/furniture/office" },
        { name: "Dining", link: "subCategory/furniture/dining" },
        { name: "Outdoor", link: "subCategory/furniture/outdoor" }
      ]
    },
    decoration: {
      label: "DECORATION",
      type: "simple",
      link: "/decoration",
      submenu: [
        { name: "Wall Art", link: "subCategory/decoration/wall-art" },
        { name: "Lighting", link: "subCategory/decoration/lighting" },
        { name: "Textiles", link: "subCategory/decoration/textiles" },
        { name: "Plants", link: "subCategory/decoration/plants" },
        { name: "Mirrors", link: "subCategory/decoration/mirrors" }
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