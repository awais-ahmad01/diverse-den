import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";
import { io } from "socket.io-client";
import { getListOfSalesperson, getUserChats } from "../../../store/actions/rider";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Modal,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  InsertPhoto as InsertPhotoIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: { main: "#603F26" },
    secondary: { main: "#E8DED1" }
  }
});

const DeleteMessageDialog = ({ open, handleClose, handleConfirm }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Delete Message</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this message? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const ImagePreviewDialog = ({ open, handleClose, imageUrl }) => (
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

const NewChatModal = ({ open, handleClose, handleCreateChat, users }) => {
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUserId) {
      handleCreateChat(selectedUserId);
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1
      }}>
        <Typography variant="h6" gutterBottom>Start New Chat</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              label="Select User"
              required
            >
              {users.map(user => (
                <MenuItem key={user._id} value={user?.salespersonDetails?._id}>
                  {user?.salespersonDetails?.firstname } {user?.salespersonDetails?.lastname }
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create Chat</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const Message = ({ message, onDelete, onImageClick, currentUserId }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isSender = message.senderId === currentUserId;

  const handleMenuOpen = (event) => {
    if (isSender) setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchorEl(null);
  const handleDelete = () => {
    handleMenuClose();
    onDelete(message._id);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: isSender ? "flex-end" : "flex-start", mb: 2 }}>
      <Paper
        elevation={1}
        sx={{
          maxWidth: "70%",
          p: 2,
          borderRadius: 2,
          backgroundColor: isSender ? "#603F26" : "#E8DED1",
          color: isSender ? "white" : "black",
          position: "relative",
          "&:hover .message-actions": { opacity: 1 }
        }}
        onClick={handleMenuOpen}
      >
        <Typography variant="body1">{message.text}</Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
          {formatTime(message.createdAt)}
          {isSender && <span style={{ marginLeft: 8 }}>✓✓</span>}
        </Typography>
        {isSender && (
          <Box className="message-actions" sx={{ position: "absolute", top: -20, right: 0, opacity: 0 }}>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Paper>
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Message
        </MenuItem>
      </Menu>
    </Box>
  );
};

const RiderChatModule = () => {
  const dispatch = useDispatch();
  const { listOfSalespersons, userChats, isloading } = useSelector((state) => state.rider);
  const currentUser = useSelector(state => state.auth.user);

  // State declarations
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [contactsMenuAnchorEl, setContactsMenuAnchorEl] = useState(null);
  const [imagePreviewDialogOpen, setImagePreviewDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [showContactList, setShowContactList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

  // Helper functions
  const getOtherUser = (chat) => {
    if (!chat?.members) return null;
    return chat.members.find(member => member.userId !== currentUser._id);
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(" ").map(word => word[0]).join("").toUpperCase();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return formatTime(timestamp);
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredContacts = contacts?.filter(chat => {
    const otherUser = getOtherUser(chat);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Socket.IO setup function
  const setupSocket = useCallback(() => {
    if (currentUser?._id && !socketRef.current) {
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      // Connection events
      newSocket.on("connect", () => {
        console.log("Socket connected with ID:", newSocket.id);
        newSocket.emit("addNewUser", currentUser._id);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      newSocket.on("connect_error", (error) => {
        console.log("Socket connection error:", error);
      });

      // Message reception event
      newSocket.on("receiveMessage", (message) => {
        console.log("New message received:", message);
        console.log("Current selected chat:", selectedChat?._id);
        console.log("Message chatId:", message.chatId);
        
        // Update messages if in the same chat
        setMessages(prev => {
          // Check if this message is already in our list to prevent duplicates
          if (!prev.some(m => m._id === message._id || 
              (m.senderId === message.senderId && 
               m.text === message.text && 
               new Date(m.createdAt).getTime() === new Date(message.createdAt).getTime()))) {
            return [...prev, message];
          }
          return prev;
        });

        // Update last message in contacts list regardless of selected chat
        setContacts(prev => {
          return prev.map(contact => {
            if (contact._id === message.chatId) {
              return { 
                ...contact, 
                lastMessage: message.text, 
                updatedAt: message.createdAt || new Date() 
              };
            }
            return contact;
          });
        });
      });

      // Message sent confirmation
      newSocket.on("messageSent", (message) => {
        console.log("Message sent confirmation received:", message);
      });

      // Online users update
      newSocket.on("getOnlineUsers", (users) => {
        console.log("Online users updated:", users);
        setOnlineUsers(users);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
      
      return newSocket;
    }
    return socketRef.current;
  }, [currentUser?._id]);

  // Handlers
  const handleContactsMenuOpen = (event) => setContactsMenuAnchorEl(event.currentTarget);
  const handleContactsMenuClose = () => setContactsMenuAnchorEl(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const cancelImageUpload = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const openImagePreviewDialog = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setImagePreviewDialogOpen(true);
  };

  const toggleContactList = () => setShowContactList(!showContactList);

  const fetchUserChats = async () => {
    try {
      const userId = currentUser?._id;
      const response = await dispatch(getUserChats(userId)).unwrap();
      
      if(response){
        setContacts(response?.data);
      }
    } catch(error) {
      console.error("Error fetching chats:", error);
      showToast("ERROR", "Failed to load chats");
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/messages/${selectedChat._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showToast("ERROR", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const riderId = currentUser._id;
      const response = await dispatch(getListOfSalesperson(riderId)).unwrap();
      
      if (response) {
        const filteredUsers = response?.data?.filter(user => 
          user?.salespersonDetails?._id !== currentUser._id && 
          !contacts.some(chat => chat.members.some(m => m._id === user?.salespersonDetails?._id))
        );
     
        setUsers(filteredUsers || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleCreateChat = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/chats/', {
        firstId: currentUser?._id,
        secondId: userId
      });

      setContacts(prev => [response.data, ...prev]);
      setSelectedChat(response.data);
      showToast("SUCCESS", "Chat created successfully");
    } catch (error) {
      console.error("Error creating chat:", error);
      showToast("ERROR", "Failed to create chat");
    }
  };

  const findOrCreateChat = async (userId) => {
    try {
      const findResponse = await axios.get(`http://localhost:3000/api/chats/find/${currentUser._id}/${userId}`);
      if (findResponse.data) {
        setSelectedChat(findResponse.data);
      } else {
        await handleCreateChat(userId);
      }
    } catch (error) {
      console.error("Error finding/creating chat:", error);
      showToast("ERROR", "Failed to find/create chat");
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;
    if (!selectedChat) return;
  
    try {
      const recipient = getOtherUser(selectedChat);
      if (!recipient) {
        console.error("Recipient not found");
        return;
      }

      // Create a message object with a temporary ID for optimistic updates
      const tempId = `temp-${Date.now()}`;
      const timestamp = new Date();
      const messageData = {
        _id: tempId, // Temporary ID for local tracking
        chatId: selectedChat._id,
        senderId: currentUser._id,
        text: newMessage,
        recipientId: recipient.userId,
        createdAt: timestamp
      };
  
      // Optimistically add to UI
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");
  
      // Update last message in contacts
      setContacts(prev => prev.map(contact => 
        contact._id === messageData.chatId 
          ? { ...contact, lastMessage: messageData.text, updatedAt: timestamp } 
          : contact
      ));
  
      // Send via Socket.IO
      if (socketRef.current) {
        console.log("Sending message via socket:", messageData);
        socketRef.current.emit("sendMessage", messageData);
      } else {
        console.error("Socket not available");
      }
  
      // Also persist to database
      const savedMessage = await axios.post('http://localhost:3000/api/messages', {
        chatId: selectedChat._id,
        senderId: currentUser._id,
        text: newMessage
      });
      
      // Replace temporary message with saved one
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? savedMessage.data : msg
      ));
  
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("ERROR", "Failed to send message");
      // Rollback optimistic update
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    } finally {
      if (imageFile) {
        setImageFile(null);
        setImagePreview(null);
      }
    }
  };

  const confirmDeleteMessage = async () => {
    try {
      await axios.delete(`/api/messages/${messageToDelete}`);
      const updatedMessages = messages.filter(message => message._id !== messageToDelete);
      setMessages(updatedMessages);
      setDeleteDialogOpen(false);
      showToast("SUCCESS", "Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast("ERROR", "Failed to delete message");
    }
  };

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowContactList(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      fetchUserChats();
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    // Setup socket connection
    const socket = setupSocket();
    
    // Cleanup function
    return () => {
      if (socket) {
        console.log("Cleaning up socket listeners");
        socket.off("receiveMessage");
        socket.off("messageSent");
        socket.off("getOnlineUsers");
      }
    };
  }, [setupSocket]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      if (mobileView) setShowContactList(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col">
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, py: 3, backgroundColor: "#603F26", color: "white" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>Rider Messages</Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "calc(100vh - 80px)" }}>
          {(showContactList || !mobileView) && (
            <Paper sx={{ width: { xs: "100%", md: "350px" }, height: "100%", borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
                <TextField
                  placeholder="Search contacts..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={handleContactsMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={contactsMenuAnchorEl} open={Boolean(contactsMenuAnchorEl)} onClose={handleContactsMenuClose}>
                  <MenuItem onClick={() => { setNewChatModalOpen(true); handleContactsMenuClose(); }}>
                    <PersonAddIcon sx={{ mr: 1 }} /> New Chat
                  </MenuItem>
                </Menu>
              </Box>

              <List sx={{ overflowY: "auto", flex: 1 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map(chat => {
                    const otherUser = getOtherUser(chat);
                    const isOnline = onlineUsers.some(user => user.userId === otherUser?.userId);
                    
                    return (
                      <ListItem
                        key={chat._id}
                        button
                        selected={selectedChat?._id === chat._id}
                        onClick={() => setSelectedChat(chat)}
                        sx={{ backgroundColor: selectedChat?._id === chat._id ? "#f5f5f5" : "inherit" }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#603F26", position: 'relative' }}>
                            {getInitials(otherUser?.name)}
                            {isOnline && (
                              <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                backgroundColor: '#4CAF50',
                                borderRadius: '50%',
                                border: '2px solid white'
                              }} />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography>{otherUser?.name || 'Unknown User'}</Typography>
                              {isOnline && (
                                <Chip 
                                  label="Online" 
                                  size="small" 
                                  sx={{ 
                                    ml: 1, 
                                    height: 18, 
                                    fontSize: '0.65rem',
                                    backgroundColor: '#4CAF50',
                                    color: 'white'
                                  }} 
                                />
                              )}
                            </Box>
                          }
                          secondary={chat?.lastMessage || 'No messages yet'}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(chat?.updatedAt)}
                          </Typography>
                          {chat?.unreadCount > 0 && (
                            <Chip label={chat.unreadCount} color="primary" size="small" sx={{ height: 20, minWidth: 20, mt: 0.5 }} />
                          )}
                        </Box>
                      </ListItem>
                    );
                  })
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">No chats found</Typography>
                    <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}
                      onClick={() => setNewChatModalOpen(true)} sx={{ mt: 2 }}>
                      Start New Chat
                    </Button>
                  </Box>
                )}
              </List>
            </Paper>
          )}

          {(!showContactList || !mobileView) && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.default" }}>
              {selectedChat ? (
                <>
                  <Box sx={{ p: 2, backgroundColor: "#fafafa", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center" }}>
                    {mobileView && (
                      <IconButton onClick={toggleContactList} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                      </IconButton>
                    )}
                    <Avatar sx={{ bgcolor: "#603F26", mr: 1 }}>
                      {getInitials(getOtherUser(selectedChat)?.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        {getOtherUser(selectedChat)?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(selectedChat.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, overflowY: "auto", p: 2, backgroundColor: "#f5f5f5" }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : messages.length > 0 ? (
                      messages.map((message) => (
                        <Message 
                          key={message._id} 
                          message={message} 
                          onDelete={(id) => {
                            setMessageToDelete(id);
                            setDeleteDialogOpen(true);
                          }}
                          onImageClick={openImagePreviewDialog}
                          currentUserId={currentUser._id}
                        />
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Typography color="textSecondary">No messages yet</Typography>
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>

                  <Box component="form" onSubmit={handleMessageSubmit} sx={{ p: 2, backgroundColor: "#fafafa", borderTop: "1px solid #e0e0e0" }}>
                    {imagePreview && (
                      <Box sx={{ mb: 2, p: 2, backgroundColor: "#eaeaea", borderRadius: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="subtitle2">Image Preview</Typography>
                          <IconButton size="small" onClick={cancelImageUpload}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", mb: 2 }}>
                          <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }} />
                        </Box>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <input accept="image/*" style={{ display: 'none' }} id="image-upload" type="file" ref={fileInputRef} onChange={handleFileUpload} />
                      <label htmlFor="image-upload">
                        <IconButton component="span">
                          <InsertPhotoIcon />
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
                      <IconButton type="submit" color="primary" disabled={!newMessage.trim() && !imageFile}>
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              ) : !mobileView && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <ChatIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">Select a chat to start messaging</Typography>
                  <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}
                    onClick={() => setNewChatModalOpen(true)} sx={{ mt: 2 }}>
                    Start New Chat
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <NewChatModal
          open={newChatModalOpen}
          handleClose={() => setNewChatModalOpen(false)}
          handleCreateChat={handleCreateChat}
          users={users}
        />

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