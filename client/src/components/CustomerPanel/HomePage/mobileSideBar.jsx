import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { navItems } from './navItems';

const MobileSidebar = ({ open, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    setExpandedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setExpandedSubCategory(expandedSubCategory === subCategory ? null : subCategory);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'primary.main',
          color: 'white',
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List component="nav">
        {Object.entries(navItems).map(([key, category]) => (
          <Box key={key}>
            <ListItem
              button
              onClick={() => handleCategoryClick(key)}
            >
              <ListItemText primary={category.label} />
              {expandedCategory === key ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={expandedCategory === key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {category.type === 'complex' ? (
                  Object.entries(category.submenu).map(([subKey, subItem]) => (
                    <Box key={subKey}>
                      <ListItem
                        button
                        sx={{ pl: 4 }}
                        onClick={() => handleSubCategoryClick(subKey)}
                      >
                        <ListItemText primary={subItem.label} />
                        {expandedSubCategory === subKey ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>

                      <Collapse in={expandedSubCategory === subKey} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subItem.items.map((item, idx) => (
                            <ListItem
                              key={idx}
                              button
                              component={Link}
                              to={`${item.link}`}
                              onClick={onClose}
                              sx={{ pl: 6 }}
                            >
                              <ListItemText primary={item.name} />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </Box>
                  ))
                ) : (
                  category.submenu.map((item, idx) => (
                    <ListItem
                      key={idx}
                      button
                      component={Link}
                      to={item.link}
                      onClick={onClose}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))
                )}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileSidebar;








// import React, { useState } from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Collapse,
//   IconButton,
//   Box,
//   Typography,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import { Link } from 'react-router-dom';
// import { navItems } from './navItems';

// const MobileSidebar = ({ open, onClose }) => {
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [expandedSubCategory, setExpandedSubCategory] = useState(null);

//   const handleCategoryClick = (category) => {
//     setExpandedCategory(expandedCategory === category ? null : category);
//     setExpandedSubCategory(null);
//   };

//   const handleSubCategoryClick = (subCategory) => {
//     setExpandedSubCategory(expandedSubCategory === subCategory ? null : subCategory);
//   };

//   // Helper function to clean up link paths - this is the key fix
//   const getCleanPath = (path) => {
//     // If the path already has /customer/ prefix, use it directly without modification
//     if (path.startsWith('/customer/')) {
//       return path;
//     }
//     // Otherwise add the /customer/ prefix
//     return `/customer/${path}`;
//   };

//   return (
//     <Drawer
//       anchor="left"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: 280,
//           bgcolor: 'primary.main',
//           color: 'white',
//         }
//       }}
//     >
//       <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
//         <IconButton color="inherit" onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <List component="nav">
//         {Object.entries(navItems).map(([key, category]) => (
//           <Box key={key}>
//             <ListItem
//               button
//               onClick={() => handleCategoryClick(key)}
//             >
//               <ListItemText primary={category.label} />
//               {expandedCategory === key ? <ExpandLess /> : <ExpandMore />}
//             </ListItem>

//             <Collapse in={expandedCategory === key} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 {category.type === 'complex' ? (
//                   Object.entries(category.submenu).map(([subKey, subItem]) => (
//                     <Box key={subKey}>
//                       <ListItem
//                         button
//                         sx={{ pl: 4 }}
//                         onClick={() => handleSubCategoryClick(subKey)}
//                       >
//                         <ListItemText primary={subItem.label} />
//                         {expandedSubCategory === subKey ? <ExpandLess /> : <ExpandMore />}
//                       </ListItem>

//                       <Collapse in={expandedSubCategory === subKey} timeout="auto" unmountOnExit>
//                         <List component="div" disablePadding>
//                           {subItem.items.map((item, idx) => (
//                             <ListItem
//                               key={idx}
//                               button
//                               component={Link}
//                               to={item.link}
//                               onClick={onClose}
//                               sx={{ pl: 6 }}
//                             >
//                               <ListItemText primary={item.name} />
//                             </ListItem>
//                           ))}
//                         </List>
//                       </Collapse>
//                     </Box>
//                   ))
//                 ) : (
//                   category.submenu.map((item, idx) => (
//                     <ListItem
//                       key={idx}
//                       button
//                       component={Link}
//                       to={item.link}
//                       onClick={onClose}
//                       sx={{ pl: 4 }}
//                     >
//                       <ListItemText primary={item.name} />
//                     </ListItem>
//                   ))
//                 )}
//               </List>
//             </Collapse>
//           </Box>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default MobileSidebar;