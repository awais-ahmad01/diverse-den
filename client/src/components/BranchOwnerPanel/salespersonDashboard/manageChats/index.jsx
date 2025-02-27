import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Paper,
  Button,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Mock Data for Chats
const mockChats = [
  {
    id: "chat1",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "JD",
    },
    messages: [
      { id: "msg1", sender: "customer", text: "Hi, I have a question about my order." },
      { id: "msg2", sender: "salesperson", text: "Sure, how can I help you?" },
    ],
  },
  {
    id: "chat2",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "JS",
    },
    messages: [
      { id: "msg1", sender: "customer", text: "When will my order be delivered?" },
      { id: "msg2", sender: "salesperson", text: "It's scheduled for delivery tomorrow." },
    ],
  },
];

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Chat Section Component
const ChatSection = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedChat = {
        ...selectedChat,
        messages: [
          ...selectedChat.messages,
          { id: `msg${selectedChat.messages.length + 1}`, sender: "salesperson", text: newMessage },
        ],
      };
      setSelectedChat(updatedChat);
      setNewMessage("");
    }
  };

  // Mobile View: Customer List Screen
  if (isMobile && !selectedChat) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
          <Typography
            variant="h6"
            sx={{ p: 2, color: "#603F26", fontWeight: "bold", bgcolor: "white" }}
          >
            Ongoing Chats
          </Typography>
          <List>
            {mockChats.map((chat) => (
              <ListItem
                key={chat.id}
                button
                onClick={() => setSelectedChat(chat)}
                sx={{
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#603F26" }}>
                    {chat.customer.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.customer.name}
                  secondary={chat.customer.email}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </ThemeProvider>
    );
  }

  // Mobile View: Chat Screen
  if (isMobile && selectedChat) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => setSelectedChat(null)}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "#603F26", mr: 2 }}>
              {selectedChat.customer.avatar}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {selectedChat.customer.name}
            </Typography>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#fafafa",
            }}
          >
            {selectedChat.messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "salesperson" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor:
                      message.sender === "salesperson" ? "#603F26" : "white",
                    color:
                      message.sender === "salesperson" ? "white" : "text.primary",
                    maxWidth: "70%",
                    borderRadius:
                      message.sender === "salesperson"
                        ? "20px 20px 0 20px"
                        : "20px 20px 20px 0",
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Desktop View
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)", bgcolor: "#f5f5f5" }}>
        {/* Chat List */}
        <Box
          sx={{
            width: "300px",
            borderRight: "1px solid #e0e0e0",
            bgcolor: "white",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{ p: 2, color: "#603F26", fontWeight: "bold", bgcolor: "#f5f5f5" }}
          >
            Ongoing Chats
          </Typography>
          <List>
            {mockChats.map((chat) => (
              <ListItem
                key={chat.id}
                button
                selected={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  "&:hover": { bgcolor: "#f5f5f5" },
                  "&.Mui-selected": { bgcolor: "#603F26", color: "white" },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#603F26" }}>
                    {chat.customer.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.customer.name}
                  secondary={chat.customer.email}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                    },
                    "& .MuiListItemText-secondary": {
                      color: selectedChat?.id === chat.id ? "white" : "text.secondary",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Window */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "#603F26", mr: 2 }}>
              {selectedChat?.customer.avatar}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {selectedChat?.customer.name}
            </Typography>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#fafafa",
            }}
          >
            {selectedChat?.messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "salesperson" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor:
                      message.sender === "salesperson" ? "#603F26" : "white",
                    color:
                      message.sender === "salesperson" ? "white" : "text.primary",
                    maxWidth: "70%",
                    borderRadius:
                      message.sender === "salesperson"
                        ? "20px 20px 0 20px"
                        : "20px 20px 20px 0",
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatSection;