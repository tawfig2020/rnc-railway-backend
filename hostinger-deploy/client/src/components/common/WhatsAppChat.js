import React, { useState } from 'react';
import { 
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, IconButton, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, Paper
} from '@mui/material';
import { WhatsApp, Close, Send } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const WhatsAppChat = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Hello! Welcome to the Refugee Network Center. How can we help you today?',
      time: '12:00 PM'
    }
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message. A team member will get back to you shortly.",
        "We're here to help! Could you provide more details about your question?",
        "That's a great question. Let me connect you with someone who can assist you better.",
        "We offer several services that might help with your situation. Would you like to learn more?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: chatHistory.length + 2,
        sender: 'bot',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* WhatsApp floating button */}
      <Fab
        color="primary"
        aria-label="whatsapp chat"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          bgcolor: '#25D366', // WhatsApp green
          '&:hover': {
            bgcolor: '#128C7E' // Darker WhatsApp green
          }
        }}
        onClick={handleOpen}
      >
        <WhatsApp />
      </Fab>
      
      {/* Chat dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            height: { xs: '80vh', sm: '60vh' },
            maxHeight: 500,
            width: { xs: '90vw', sm: 400 },
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#128C7E', // WhatsApp header color
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src="/logo192.png" 
              alt="RNC Logo"
              sx={{ mr: 1 }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                RNC Support
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Usually replies within an hour
              </Typography>
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: 2, 
            bgcolor: '#E5DDD5', // WhatsApp chat background
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <List sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            width: '100%',
            p: 0
          }}>
            {chatHistory.map((chat) => (
              <ListItem 
                key={chat.id}
                sx={{ 
                  justifyContent: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                  px: 0
                }}
              >
                <Paper 
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    borderRadius: 2,
                    bgcolor: chat.sender === 'user' ? '#DCF8C6' : 'white',
                    position: 'relative'
                  }}
                >
                  <Typography variant="body2">{chat.text}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: 'right',
                      color: 'text.secondary',
                      mt: 0.5
                    }}
                  >
                    {chat.time}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 1, 
          bgcolor: '#F0F0F0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <form 
            onSubmit={handleSendMessage} 
            style={{ 
              display: 'flex', 
              width: '100%',
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message"
              variant="outlined"
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <IconButton 
              type="submit" 
              color="primary"
              disabled={!message.trim()}
            >
              <Send />
            </IconButton>
          </form>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WhatsAppChat;
