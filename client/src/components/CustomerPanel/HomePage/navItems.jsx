const navItems = {
  Clothing: {
    label: "CLOTHING",
    type: "complex",
    link: "/customer/Clothing",
    submenu: {
      Men: {
        label: "MEN",
        link: "/customer/Clothing/Men",
        items: [
          { name: "T-shirts", link: "/customer/Clothing/Men/T-shirts" },
          { name: "Shirts", link: "/customer/Clothing/Men/Shirts" },
          { name: "Pants", link: "/customer/Clothing/Men/Pants" },
          { name: "Jackets", link: "/customer/Clothing/Men/Jackets" },
          { name: "Jeans", link: "/customer/Clothing/Men/Jeans" },
          { name: "Sweaters", link: "/customer/Clothing/Men/Sweaters" },
          { name: "Shorts", link: "/customer/Clothing/Men/Shorts" },
          { name: "Underwear", link: "/customer/Clothing/Men/Underwear" }
        ]
      },
      Women: {
        label: "WOMEN",
        link: "/customer/Clothing/Women",
        items: [
          { name: "T-shirts", link: "/customer/Clothing/Women/T-shirts"},
          { name: "Shirts", link: "/customer/Clothing/Women/Shirts"},
          { name: "Dresses", link: "/customer/Clothing/Women/Dresses" },
          { name: "Jeans", link: "/customer/Clothing/Women/Jeans" },
          { name: "Skirts", link: "/customer/Clothing/Women/Skirts" },
          { name: "Pants", link: "/customer/Clothing/Women/Pants" },
          { name: "Jackets", link: "/customer/Clothing/Women/Jackets" },
          { name: "Sweaters", link: "/customer/Clothing/Women/Sweaters" }
        ]
      },
      Kids: {
        label: "KIDS",
        link: "/customer/Clothing/Kids",
        items: [
          { name: "T-shirts", link: "/customer/Clothing/Kids/T-shirts" },
          { name: "Shirts", link: "/customer/Clothing/Kids/Shirts" },
          { name: "Pants", link: "/customer/Clothing/Kids/Pants" },
          { name: "jeans", link: "/customer/Clothing/Kids/Jeans" },
          { name: "Jackets", link: "/customer/Clothing/Kids/Jackets" },
          { name: "Sweaters", link: "/customer/Clothing/Kids/Sweaters" },
          { name: "Shorts", link: "/customer/Clothing/Kids/Shorts" }
        ]
      }
    }
  },
  Shoes: {
    label: "SHOES",
    type: "complex",
    link: "/customer/Shoes",
    submenu: {
      Men: {
        label: "MEN",
        link: "/customer/Shoes/Men",
        items: [
          { name: "Sneakers", link: "/customer/Shoes/Men/Sneakers" },
          { name: "Dress Shoes", link: "/customer/Shoes/Men/Dress Shoes" },
          { name: "Loafers", link: "/customer/Shoes/Men/Loafers" },
          { name: "Sandals", link: "/customer/Shoes/Men/Sandals" },
          { name: "Athletic Shoes", link: "/customer/Shoes/Men/Athletic Shoes" }
        ]
      },
      Women: {
        label: "WOMEN",
        link: "/customer/Shoes/Women",
        items: [
          { name: "Heels", link: "/customer/Shoes/Women/Heels" },
          { name: "Casual Shoes", link: "/customer/Shoes/Women/Casual Shoes" },
          { name: "Sneakers", link: "/customer/Shoes/Women/Sneakers" },
          { name: "Athletic Shoes", link: "/customer/Shoes/Women/Athletic Shoes" },
          { name: "Sandals", link: "/customer/Shoes/Women/Sandals" }
        ]
      },
      Kids: {
        label: "KIDS",
        link: "/customer/Shoes/Kids",
        items: [
          { name: "School Shoes", link: "/customer/Shoes/Kids/School Shoes" },
          { name: "Sneakers", link: "/customer/Shoes/Kids/Sneakers" },
          { name: "Athletic Shoes", link: "/customer/Shoes/Kids/Athletic Shoes" },
          { name: "Sandals", link: "/customer/Shoes/Kids/Sandals" }
        ]
      }
    }
  },
  Furniture: {
    label: "FURNITURE",
    type: "simple",
    link: "/customer/Furniture",
    submenu: [
      { name: "Sofas", link: "/customer/Furniture/Sofas" },
      { name: "Chairs", link: "/customer/Furniture/Chairs" },
      { name: "Tables", link: "/customer/Furniture/Tables" },
      { name: "Beds", link: "/customer/Furniture/Beds" },
      { name: "Cabinets", link: "/customer/Furniture/Cabinets" },
      { name: "Wardrobes", link: "/customer/Furniture/Wardrobes" },
      { name: "Shelving Units", link: "/customer/Furniture/Shelving Units" },
      { name: "Dinning Sets", link: "/customer/Furniture/Dinning Sets" }
    ]
  },
  Decoration: {
    label: "DECORATION",
    type: "simple",
    link: "/customer/Decoration",
    submenu: [
      { name: "Wall Art", link: "/customer/Decoration/Wall Art" },
      { name: "Sculptures", link: "/customer/Decoration/Sculptures" },
      { name: "Picture Frames", link: "/customer/Decoration/Picture Frames" },
      { name: "Mirrors", link: "/customer/Decoration/Mirrors" },
      { name: "Candle Holders", link: "/customer/Decoration/Candle Holders" }
    ]
  }
};