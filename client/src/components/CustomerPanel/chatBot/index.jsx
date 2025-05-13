import React, { useState } from 'react';
import { Send, ShoppingCart, LocalShipping, HelpOutline } from '@mui/icons-material';
import { IconButton, Button, Avatar } from '@mui/material';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your shopping assistant. How can I help?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock data
  const mockProducts = [
    { id: 1, name: "Wireless Headphones", price: "$99", category: "Electronics" },
    { id: 2, name: "Smart Watch", price: "$199", category: "Electronics" },
    { id: 3, name: "Running Shoes", price: "$59", category: "Fashion" },
  ];

  const mockOrder = {
    id: "ORD-12345",
    status: "Shipped",
    eta: "May 15, 2025",
    items: [{ name: "Wireless Headphones", quantity: 1 }],
  };

  // Quick replies
  const quickReplies = [
    { text: "Show products", icon: <ShoppingCart />, action: "products" },
    { text: "Track order", icon: <LocalShipping />, action: "track order" },
    { text: "Help", icon: <HelpOutline />, action: "help" },
  ];

  // Bot response logic
  const getBotResponse = (userText) => {
    userText = userText.toLowerCase();
    setIsTyping(true);

    setTimeout(() => {
      let response;
      if (userText.includes('hi') || userText.includes('hello')) {
        response = "Hello! Ask about products, orders, or returns.";
      } 
      else if (userText.includes('product') || userText === 'products') {
        response = (
          <div className="space-y-2">
            <p>Here are our top products:</p>
            {mockProducts.map((product) => (
              <div key={product.id} className="p-2 border rounded-lg">
                <p className="font-semibold">{product.name}</p>
                <p>{product.price} • {product.category}</p>
              </div>
            ))}
          </div>
        );
      } 
      else if (userText.includes('track') || userText.includes('order')) {
        response = (
          <div className="space-y-2">
            <p>Order #{mockOrder.id}:</p>
            <p>Status: <span className="font-semibold">{mockOrder.status}</span></p>
            <p>Estimated Delivery: {mockOrder.eta}</p>
            <p>Items: {mockOrder.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
          </div>
        );
      } 
      else if (userText.includes('return')) {
        response = "For returns, visit our FAQ page or email returns@example.com.";
      } 
      else {
        response = "I can help with products, orders, or returns. Choose an option below!";
      }

      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  // Send message handler
  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { text: input, sender: 'user' };
    setMessages([...messages, userMsg]);
    setInput('');

    // Get bot response
    getBotResponse(input);
  };

  // Quick reply handler
  const handleQuickReply = (action) => {
    const userMsg = { text: action, sender: 'user' };
    setMessages([...messages, userMsg]);
    getBotResponse(action);
  };

  return (
    <div className="flex flex-col h-[500px] w-[350px] border border-gray-200 rounded-xl shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-blue-500 text-white rounded-t-xl">
        <Avatar sx={{ bgcolor: 'white', color: 'blue', width: 32, height: 32 }}>B</Avatar>
        <div className="ml-3">
          <p className="font-semibold">Shopping Assistant</p>
          <p className="text-xs">{isTyping ? 'Typing...' : 'Online'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 p-3 bg-gray-100 border-t">
        {quickReplies.map((reply, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            startIcon={reply.icon}
            onClick={() => handleQuickReply(reply.action)}
            sx={{ textTransform: 'none', borderRadius: '20px' }}
          >
            {reply.text}
          </Button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center p-3 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IconButton
          onClick={handleSend}
          color="primary"
          sx={{ ml: 1 }}
          disabled={!input.trim()}
        >
          <Send />
        </IconButton>
      </div>
    </div>
  );
};

export default Chatbot;