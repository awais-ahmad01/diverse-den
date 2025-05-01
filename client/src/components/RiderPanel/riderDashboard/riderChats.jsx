import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Menu,
  MenuItem,
  Chip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
  CircularProgress,
  Tooltip,
  Switch,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedIcon from "@mui/icons-material/Verified";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26", // Brown color for theme
    },
    secondary: {
      main: "#E8DED1",
    },
  },
});

// Mock data for contacts (only salespersons and chatbot)
const mockContacts = [
  {
    id: "sales1",
    name: "Sales - Ali Ahmad",
    avatar: null,
    lastMessage: "New delivery assigned to you",
    timestamp: "10:30 AM",
    unread: 2,
    isOnline: true,
    type: "sales"
  },
  {
    id: "sales2",
    name: "Sales - Sara Khan",
    avatar: null,
    lastMessage: "Customer is waiting at location",
    timestamp: "9:15 AM",
    unread: 0,
    isOnline: false,
    type: "sales"
  },
  {
    id: "sales3",
    name: "Sales - Usman Malik",
    avatar: null,
    lastMessage: "Please confirm pickup",
    timestamp: "Yesterday",
    unread: 1,
    isOnline: true,
    type: "sales"
  },
  {
    id: "chatbot",
    name: "Rider Assistant",
    avatar: null,
    lastMessage: "How can I help you today?",
    timestamp: "Just now",
    unread: 0,
    isOnline: true,
    type: "chatbot"
  }
];

const chatbotResponses = [
  {
    text: "Hello Rider! How can I assist you today?",
    options: [
      "View my assigned deliveries",
      "Report a delivery issue",
      "Request day off",
      "Contact sales team"
    ]
  },
  {
    text: "You have 3 deliveries assigned today. Next delivery is to House #45, Street 10, North Karachi.",
    options: [
      "Get directions",
      "View customer details",
      "Report problem",
      "Contact sales"
    ]
  },
  {
    text: "To report a delivery issue, please describe the problem:",
    options: [
      "Customer not available",
      "Wrong address",
      "Item damaged",
      "Other issue"
    ]
  },
  {
    text: "Your day off request has been noted. Would you like to request a substitute rider?",
    options: [
      "Yes, find substitute",
      "No, just note my absence",
      "Cancel request",
      "Contact manager"
    ]
  },
  {
    text: "Connecting you to sales team. Please describe your issue:",
    options: [
      "Delivery instructions unclear",
      "Need additional information",
      "Customer complaint",
      "Other issue"
    ]
  }
];

// Sample messages for each conversation
const mockMessages = {
  "sales1": [
    {
      id: "msg1",
      sender: "sales1",
      text: "New delivery assigned to you - Order #4567",
      timestamp: "10:30 AM",
      status: "read",
      type: "text"
    },
    {
      id: "msg2",
      sender: "me",
      text: "Received. What's the delivery address?",
      timestamp: "10:31 AM",
      status: "sent",
      type: "text"
    },
    {
      id: "msg3",
      sender: "sales1",
      text: "House #45, Street 10, North Karachi. Customer phone: 0300-1234567",
      timestamp: "10:32 AM",
      status: "read",
      type: "text"
    },
    {
      id: "msg4",
      sender: "me",
      text: "On my way. ETA 20 minutes",
      timestamp: "10:33 AM",
      status: "sent",
      type: "text"
    },
    {
      id: "msg5",
      sender: "sales1",
      text: "Customer called, they're waiting. Please hurry.",
      timestamp: "10:34 AM",
      status: "read",
      type: "text"
    },
    {
      id: "msg6",
      sender: "me",
      image: "/api/placeholder/300/300",
      caption: "Traffic at this point",
      timestamp: "10:35 AM",
      status: "sent",
      type: "image"
    }
  ],
  "sales2": [
    {
      id: "msg7",
      sender: "sales2",
      text: "Customer is waiting at location - Order #7890",
      timestamp: "9:15 AM",
      status: "read",
      type: "text"
    },
    {
      id: "msg8",
      sender: "me",
      text: "Will be there in 10 minutes",
      timestamp: "9:17 AM",
      status: "sent",
      type: "text"
    }
  ],
  "chatbot": [
    {
      id: "bot1",
      sender: "chatbot",
      text: "Hello Rider! How can I assist you today?",
      timestamp: "Just now",
      options: [
        "View my assigned deliveries",
        "Report a delivery issue",
        "Request day off",
        "Contact sales team"
      ],
      type: "text"
    }
  ]
};

// Component for the delete message confirmation dialog
const DeleteMessageDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this message? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Component for the image preview dialog
const ImagePreviewDialog = ({ open, handleClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Image Preview
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <img 
            src={imageUrl} 
            alt="Message preview" 
            style={{ maxWidth: '100%', maxHeight: '70vh' }} 
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Message component
const Message = ({ message, onDelete, onImageClick }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isSender = message.sender === "me";

  const handleMenuOpen = (event) => {
    if (isSender) {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(message.id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isSender ? "flex-end" : "flex-start",
        mb: 2,
        position: "relative"
      }}
    >
      {message.type === "text" ? (
        <Paper
          elevation={1}
          sx={{
            maxWidth: "70%",
            p: 2,
            borderRadius: 2,
            backgroundColor: isSender ? "#603F26" : "#E8DED1",
            color: isSender ? "white" : "black",
            position: "relative",
            "&:hover .message-actions": {
              opacity: 1
            }
          }}
          onClick={handleMenuOpen}
        >
          <Typography variant="body1">{message.text}</Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
            {message.timestamp}
            {isSender && (
              <span style={{ marginLeft: 8 }}>
                {message.status === "sent" && "✓"}
                {message.status === "delivered" && "✓✓"}
                {message.status === "read" && (
                  <span style={{ color: isSender ? "#8fc9ff" : "#603F26" }}>✓✓</span>
                )}
              </span>
            )}
          </Typography>
          {isSender && (
            <Box
              className="message-actions"
              sx={{
                position: "absolute",
                top: -20,
                right: 0,
                opacity: 0,
                transition: "opacity 0.2s"
              }}
            >
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Paper>
      ) : message.type === "image" ? (
        <Paper
          elevation={1}
          sx={{
            maxWidth: "70%",
            p: 1,
            borderRadius: 2,
            backgroundColor: isSender ? "#603F26" : "#E8DED1",
            color: isSender ? "white" : "black",
            position: "relative",
            "&:hover .message-actions": {
              opacity: 1
            }
          }}
          onClick={handleMenuOpen}
        >
          <Box 
            sx={{ 
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => onImageClick(message.image)}
          >
            <img
              src={message.image}
              alt="Message image"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          </Box>
          {message.caption && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {message.caption}
            </Typography>
          )}
          <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
            {message.timestamp}
            {isSender && (
              <span style={{ marginLeft: 8 }}>
                {message.status === "sent" && "✓"}
                {message.status === "delivered" && "✓✓"}
                {message.status === "read" && (
                  <span style={{ color: isSender ? "#8fc9ff" : "#603F26" }}>✓✓</span>
                )}
              </span>
            )}
          </Typography>
          {isSender && (
            <Box
              className="message-actions"
              sx={{
                position: "absolute",
                top: -20,
                right: 0,
                opacity: 0,
                transition: "opacity 0.2s"
              }}
            >
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Paper>
      ) : message.options ? (
        // Bot message with options
        <Box sx={{ maxWidth: "90%", width: "90%" }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#E8DED1",
              mb: 1
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <SmartToyIcon sx={{ mr: 1, color: "#603F26" }} />
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                Rider Assistant
              </Typography>
            </Box>
            <Typography variant="body1">{message.text}</Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
              {message.timestamp}
            </Typography>
          </Paper>
          <Grid container spacing={1}>
            {message.options.map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  sx={{
                    textAlign: "left",
                    justifyContent: "flex-start",
                    whiteSpace: "normal",
                    height: "auto",
                    py: 1
                  }}
                >
                  {option}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Message
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Main Chat component for Riders
const RiderChatModule = () => {
    const [contacts, setContacts] = useState(mockContacts);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageCaption, setImageCaption] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [contactsMenuAnchorEl, setContactsMenuAnchorEl] = useState(null);
    const [imagePreviewDialogOpen, setImagePreviewDialogOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");
    const [currentTab, setCurrentTab] = useState(0);
    const [showChatbot, setShowChatbot] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [showContactList, setShowContactList] = useState(true);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
  
    const filteredContacts = contacts.filter(contact => {
      return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
    useEffect(() => {
      const handleResize = () => {
        setMobileView(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setShowContactList(true);
        }
      };
      
      handleResize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);
  
    useEffect(() => {
      if (selectedContact) {
        if (selectedContact.id === "chatbot") {
          setMessages(mockMessages.chatbot || []);
        } else {
          setMessages(mockMessages[selectedContact.id] || []);
        }
        
        if (mobileView) {
          setShowContactList(false);
        }
        
        if (selectedContact.unread > 0) {
          const updatedContacts = contacts.map(contact => 
            contact.id === selectedContact.id ? { ...contact, unread: 0 } : contact
          );
          setContacts(updatedContacts);
        }
      }
    }, [selectedContact]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !imageFile) {
      return;
    }
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Handle text message
    if (newMessage.trim()) {
      const textMessage = {
        id: `msg_${Date.now()}`,
        sender: "me",
        text: newMessage,
        timestamp,
        status: "sent",
        type: "text"
      };
      
      setMessages(prev => [...prev, textMessage]);
      setNewMessage("");
      
      // Update last message in contacts
      updateContactLastMessage(selectedContact.id, newMessage, timestamp);
      
      // If chatbot is selected, simulate a response
      if (selectedContact.id === "chatbot") {
        setTimeout(() => {
          const randomResponse = chatbotResponses[Math.floor(Math.random() * chatbotResponses.length)];
          const botReply = {
            id: `bot_${Date.now()}`,
            sender: "chatbot",
            text: randomResponse.text,
            options: randomResponse.options,
            timestamp: "Just now",
            type: "text"
          };
          setMessages(prev => [...prev, botReply]);
        }, 1000);
      } else {
        // Simulate received message for demo
        simulateReceivedMessage();
      }
    }
    
    // Handle image message
    if (imageFile) {
      const imageMessage = {
        id: `img_${Date.now()}`,
        sender: "me",
        image: imagePreview,
        caption: imageCaption,
        timestamp,
        status: "sent",
        type: "image"
      };
      
      setMessages(prev => [...prev, imageMessage]);
      
      // Update last message in contacts
      updateContactLastMessage(selectedContact.id, imageCaption || "Image", timestamp);
      
      // Reset image state
      setImageFile(null);
      setImagePreview(null);
      setImageCaption("");
      
      // Simulate received message for demo
      if (selectedContact.id !== "chatbot") {
        simulateReceivedMessage();
      }
    }
  };

  const simulateReceivedMessage = () => {
    // Simulate typing and response
    setTimeout(() => {
      const responses = [
        "Received. Will update the customer.",
        "Thanks for the update!",
        "Please proceed to next delivery.",
        "Customer has been notified.",
        "Please confirm when delivered."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const replyMessage = {
        id: `reply_${Date.now()}`,
        sender: selectedContact.id,
        text: randomResponse,
        timestamp,
        status: "received",
        type: "text"
      };
      
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  const updateContactLastMessage = (contactId, message, timestamp) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, lastMessage: message, timestamp } 
        : contact
    );
    setContacts(updatedContacts);
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMessage = () => {
    // Delete the message
    const updatedMessages = messages.filter(message => message.id !== messageToDelete);
    setMessages(updatedMessages);
    
    // Update last message in contact if needed
    if (messages.find(msg => msg.id === messageToDelete)?.sender === "me") {
      const lastMessageFromMe = updatedMessages
        .filter(msg => msg.sender === "me")
        .pop();
      
      if (lastMessageFromMe) {
        updateContactLastMessage(
          selectedContact.id, 
          lastMessageFromMe.text || "Image", 
          lastMessageFromMe.timestamp
        );
      }
    }
    
    // Close dialog
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
    
    // Show toast notification
    showToast("SUCCESS", "Message deleted successfully");
  };

  const handleContactsMenuOpen = (event) => {
    setContactsMenuAnchorEl(event.currentTarget);
  };

  const handleContactsMenuClose = () => {
    setContactsMenuAnchorEl(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo purposes, we'll use a placeholder image
      setImageFile(file);
      setImagePreview("/api/placeholder/400/300");
    }
  };

  const cancelImageUpload = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageCaption("");
  };

  const openImagePreviewDialog = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setImagePreviewDialogOpen(true);
  };

  const handleNewChat = () => {
    setShowChatbot(true);
    const chatbotContact = {
      id: "chatbot",
      name: "Rider Assistant",
      avatar: null,
      lastMessage: "How can I help you today?",
      timestamp: "Just now",
      unread: 0,
      isOnline: true,
      type: "chatbot"
    };
    
    // Check if chatbot already exists in contacts
    if (!contacts.find(contact => contact.id === "chatbot")) {
      setContacts(prev => [chatbotContact, ...prev]);
    }
    
    setSelectedContact(chatbotContact);
    handleContactsMenuClose();
  };

  const toggleContactList = () => {
    setShowContactList(!showContactList);
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  // Get appropriate icon based on contact type
  const getContactIcon = (type) => {
    switch(type) {
      case "sales":
        return <PersonIcon />;
      case "chatbot":
        return <SmartToyIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, py: 3, backgroundColor: "#603F26", color: "white" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Rider Messages
          </Typography>
        </Box>

        {/* Main Chat Interface */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            height: "calc(100vh - 80px)",
            position: "relative"
          }}
        >
          {/* Contact List - Hidden in mobile view when chat is open */}
          {(showContactList || !mobileView) && (
            <Paper 
              sx={{ 
                width: { xs: "100%", md: "350px" }, 
                height: { xs: "100%", md: "100%" },
                borderRadius: 0,
                display: "flex",
                flexDirection: "column",
                position: { xs: mobileView ? "absolute" : "relative", md: "relative" },
                zIndex: { xs: mobileView ? 10 : 1, md: 1 },
                top: 0,
                left: 0,
                backgroundColor: "white"
              }}
            >
              {/* Contact list header */}
              <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
                <TextField
                  placeholder="Search contacts..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={handleContactsMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={contactsMenuAnchorEl}
                  open={Boolean(contactsMenuAnchorEl)}
                  onClose={handleContactsMenuClose}
                >
                  <MenuItem onClick={handleNewChat}>
                    <SmartToyIcon sx={{ mr: 1 }} />
                    New Chat with Assistant
                  </MenuItem>
                </Menu>
              </Box>

              {/* Contact list */}
              <List 
                sx={{ 
                  overflowY: "auto", 
                  flex: 1,
                  '& .MuiListItem-root': {
                    borderBottom: '1px solid #f0f0f0'
                  }
                }}
              >
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <ListItem
                      key={contact.id}
                      button
                      selected={selectedContact && selectedContact.id === contact.id}
                      onClick={() => setSelectedContact(contact)}
                      sx={{
                        backgroundColor: selectedContact && selectedContact.id === contact.id ? "#f5f5f5" : "inherit"
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: contact.isOnline ? '#44b700' : '#bdbdbd',
                              boxShadow: `0 0 0 2px white`
                            }
                          }}
                        >
                          <Avatar sx={{ bgcolor: "#603F26" }}>
                            {getContactIcon(contact.type)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contact.name}
                        secondary={contact.lastMessage}
                        primaryTypographyProps={{
                          fontWeight: contact.unread > 0 ? "bold" : "normal"
                        }}
                        secondaryTypographyProps={{
                          noWrap: true,
                          fontWeight: contact.unread > 0 ? "bold" : "normal"
                        }}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="caption" color="textSecondary">
                          {contact.timestamp}
                        </Typography>
                        {contact.unread > 0 && (
                          <Chip
                            label={contact.unread}
                            color="primary"
                            size="small"
                            sx={{ height: 20, minWidth: 20, mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">No contacts found</Typography>
                  </Box>
                )}
              </List>
            </Paper>
          )}

          {/* Chat Area - Only shown when a contact is selected in mobile view */}
          {(!showContactList || !mobileView) && (
            <Box 
              sx={{ 
                flex: 1, 
                display: "flex", 
                flexDirection: "column", 
                height: "100%", 
                overflow: "hidden",
                bgcolor: "background.default"
              }}
            >
              {selectedContact ? (
                <>
                  {/* Chat header */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      backgroundColor: "#fafafa", 
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {mobileView && (
                        <IconButton onClick={toggleContactList} sx={{ mr: 1 }}>
                          <ArrowBackIcon />
                        </IconButton>
                      )}
                      <Avatar 
                        sx={{ 
                          bgcolor: "#603F26",
                          mr: 1 
                        }}
                      >
                        {getContactIcon(selectedContact.type)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            {selectedContact.name}
                          </Typography>
                          {selectedContact.isOnline && (
                            <Chip 
                              label="Online" 
                              size="small" 
                              sx={{ ml: 1, height: 20, bgcolor: "#44b700", color: "white" }} 
                            />
                          )}
                          {selectedContact.type === "chatbot" && (
                            <Chip 
                              label="Assistant" 
                              size="small" 
                              sx={{ ml: 1, height: 20 }} 
                              color="primary"
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {selectedContact.isOnline ? "Active now" : "Last seen at " + selectedContact.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box 
                    sx={{ 
                      flex: 1, 
                      overflowY: "auto", 
                      p: 2, 
                      backgroundColor: "#f5f5f5" 
                    }}
                  >
                    {messages.map((message) => (
                      <Message 
                        key={message.id} 
                        message={message} 
                        onDelete={handleDeleteMessage}
                        onImageClick={openImagePreviewDialog}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Message input */}
                  <Box 
                    component="form" 
                    onSubmit={handleMessageSubmit}
                    sx={{ 
                      p: 2, 
                      backgroundColor: "#fafafa", 
                      borderTop: "1px solid #e0e0e0",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {/* Image preview */}
                    {imagePreview && (
                      <Box sx={{ mb: 2, p: 2, backgroundColor: "#eaeaea", borderRadius: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="subtitle2">Image Preview</Typography>
                          <IconButton size="small" onClick={cancelImageUpload}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", mb: 2 }}>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }} 
                          />
                        </Box>
                        <TextField
                          fullWidth
                          placeholder="Add a caption..."
                          variant="outlined"
                          size="small"
                          value={imageCaption}
                          onChange={(e) => setImageCaption(e.target.value)}
                        />
                      </Box>
                    )}

                    {/* Input field and buttons */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="image-upload">
                        <IconButton component="span">
                          <ImageIcon />
                        </IconButton>
                      </label>
                      <TextField
                        fullWidth
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{ mx: 1 }}
                      />
                      <IconButton 
                        type="submit" 
                        color="primary"
                        disabled={!newMessage.trim() && !imageFile}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              ) : (
                /* Empty state when no contact is selected (only shown in desktop view) */
                !mobileView && (
                  <Box 
                    sx={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      height: "100%" 
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Select a contact to start chatting
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SmartToyIcon />}
                      onClick={handleNewChat}
                      sx={{ mt: 2 }}
                    >
                      Chat with Assistant
                    </Button>
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>

        {/* Dialogs */}
        <DeleteMessageDialog 
          open={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          handleConfirm={confirmDeleteMessage}
        />
        
        <ImagePreviewDialog 
          open={imagePreviewDialogOpen}
          handleClose={() => setImagePreviewDialogOpen(false)}
          imageUrl={previewImageUrl}
        />
      </div>
    </ThemeProvider>
  );
};

export default RiderChatModule; 