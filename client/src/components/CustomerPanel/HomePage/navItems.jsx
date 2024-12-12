export const navItems = {
    clothing: {
      label: "Clothing",
      type: "complex",
      link: "/clothing",
      submenu: {
        men: {
          label: "Men",
          link: "/clothing/men",
          items: [
            { name: "T-Shirts", link: "/clothing/men/t-shirts" },
            { name: "Shirts", link: "/clothing/men/shirts" },
            { name: "Pants", link: "/clothing/men/pants" },
            { name: "Jackets", link: "/clothing/men/jackets" },
            { name: "Suits", link: "/clothing/men/suits" },
            { name: "Activewear", link: "/clothing/men/activewear" }
          ]
        },
        women: {
          label: "Women",
          link: "/clothing/women",
          items: [
            { name: "Dresses", link: "/clothing/women/dresses" },
            { name: "Tops", link: "/clothing/women/tops" },
            { name: "Skirts", link: "/clothing/women/skirts" },
            { name: "Pants", link: "/clothing/women/pants" },
            { name: "Jackets", link: "/clothing/women/jackets" },
            { name: "Activewear", link: "/clothing/women/activewear" }
          ]
        },
        kids: {
          label: "Kids",
          link: "/clothing/kids",
          items: [
            { name: "Boys", link: "/clothing/kids/boys" },
            { name: "Girls", link: "/clothing/kids/girls" },
            { name: "Infants", link: "/clothing/kids/infants" },
            { name: "Teenagers", link: "/clothing/kids/teenagers" },
            { name: "School Wear", link: "/clothing/kids/school-wear" }
          ]
        }
      }
    },
    shoes: {
      label: "Shoes",
      type: "complex",
      link: "/shoes",
      submenu: {
        men: {
          label: "Men",
          link: "/shoes/men",
          items: [
            { name: "Casual", link: "/shoes/men/casual" },
            { name: "Formal", link: "/shoes/men/formal" },
            { name: "Sports", link: "/shoes/men/sports" },
            { name: "Sandals", link: "/shoes/men/sandals" },
            { name: "Boots", link: "/shoes/men/boots" }
          ]
        },
        women: {
          label: "Women",
          link: "/shoes/women",
          items: [
            { name: "Heels", link: "/shoes/women/heels" },
            { name: "Flats", link: "/shoes/women/flats" },
            { name: "Sneakers", link: "/shoes/women/sneakers" },
            { name: "Boots", link: "/shoes/women/boots" },
            { name: "Sandals", link: "/shoes/women/sandals" }
          ]
        },
        kids: {
          label: "Kids",
          link: "/shoes/kids",
          items: [
            { name: "School Shoes", link: "/shoes/kids/school" },
            { name: "Sports", link: "/shoes/kids/sports" },
            { name: "Casual", link: "/shoes/kids/casual" },
            { name: "Sandals", link: "/shoes/kids/sandals" }
          ]
        }
      }
    },
    furniture: {
      label: "Furniture",
      type: "simple",
      link: "/furniture",
      submenu: [
        { name: "Living Room", link: "/furniture/living-room" },
        { name: "Bedroom", link: "/furniture/bedroom" },
        { name: "Office", link: "/furniture/office" },
        { name: "Dining", link: "/furniture/dining" },
        { name: "Outdoor", link: "/furniture/outdoor" }
      ]
    },
    decoration: {
      label: "Decoration",
      type: "simple",
      link: "/decoration",
      submenu: [
        { name: "Wall Art", link: "/decoration/wall-art" },
        { name: "Lighting", link: "/decoration/lighting" },
        { name: "Textiles", link: "/decoration/textiles" },
        { name: "Plants", link: "/decoration/plants" },
        { name: "Mirrors", link: "/decoration/mirrors" }
      ]
    }
  };