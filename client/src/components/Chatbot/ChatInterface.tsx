import React, { useState, useEffect, useRef } from 'react';
import { format } from 'timeago.js';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  InputBase,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendChatMessage } from '../../services/apiClient';
import ReactMarkdown from 'react-markdown'; // Import react-markdown for markdown rendering

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your assistant. How can I help you today? 😊",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the user's message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send the message to the backend and get the bot's response
      const response = await sendChatMessage(input);

      // Add the bot's response to the chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chatbot Error:', error);

      // Handle errors and display an error message
      const errorText =
        error.response?.data?.error || error.message || JSON.stringify(error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Error: ${errorText}`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        bgcolor: 'background.default',
        borderRadius: 1,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      {/* Chat Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            💬 AI Assistant
          </Typography>
          <Typography variant="caption" color="inherit">
            Online
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              alignItems="flex-start"
              sx={{
                justifyContent:
                  message.sender === 'user' ? 'flex-start' : 'flex-end',
              }}
            >
              {message.sender === 'user' && (
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>😊</Avatar>
                </ListItemAvatar>
              )}
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor:
                    message.sender === 'user'
                      ? 'primary.main'
                      : message.isError
                      ? 'error.main'
                      : 'secondary.main',
                  color: 'primary.contrastText',
                }}
              >
                {/* Use ReactMarkdown to render the message text */}
                <ListItemText
                  primary={
                    <ReactMarkdown>
                      {message.text}
                    </ReactMarkdown>
                  }
                  secondary={format(message.timestamp)}
                />
              </Paper>
              {message.sender === 'bot' && (
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>🤖</Avatar>
                </ListItemAvatar>
              )}
            </ListItem>
          ))}
          {isLoading && (
            <ListItem alignItems="flex-start" sx={{ justifyContent: 'flex-end' }}>
              <CircularProgress size={24} />
            </ListItem>
          )}
          <div ref={messagesEndRef}></div>
        </List>
      </Box>

      {/* Chat Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <InputBase
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mr: 1 }}
        />
        <IconButton type="submit" disabled={isLoading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInterface;