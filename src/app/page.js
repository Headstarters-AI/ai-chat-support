"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Search";
import HistorySidebar from "./components/HistorySidebar";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

const drawerWidth = 280;

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')

  const [history, setHistory] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [question, setQuestion] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle input change in the chat input box
  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  // Handle form submission to send the user question to the API
  const sendMessage = async () => {
    const newMessage = { role: 'user', content: question };
    const assistantMessage = { role: 'assistant', content: '' };

    // Update current chat session with the user's new message and a placeholder for the assistant's response
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((chat, index) => {
        if (index === currentChatIndex) {
          return {
            ...chat,
            chat: [...chat.chat, newMessage, assistantMessage],
          };
        }
        return chat;
      });

      return updatedHistory;
    });

    // Clear the input field
    setQuestion('');

    // Send the user's message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...history[currentChatIndex].chat, newMessage]), // Send the current chat history with the new message
    }).then(async (res) => {
      const reader = res.body.getReader(); // Get a reader to read the response body
      const decoder = new TextDecoder(); // Create a decoder to decode the response text

      let assistantResponse = ''; // Initialize a string to accumulate the assistant's response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          // Update the assistant's final response when streaming is complete
          setHistory((prevHistory) => {
            const updatedHistory = prevHistory.map((chat, index) => {
              if (index === currentChatIndex) {
                let updatedChat = chat.chat.slice(0, -1); // Remove the assistant's placeholder
                updatedChat.push({ role: 'assistant', content: assistantResponse }); // Add the complete assistant response

                return {
                  ...chat,
                  chat: updatedChat,
                };
              }
              return chat;
            });

            return updatedHistory;
          });
          return assistantResponse;
        }

        const text = decoder.decode(value || new Uint8Array(), { stream: true }); // Decode the text
        assistantResponse += text; // Accumulate the chunks of the response

        // Update the assistant's message in real-time
        setHistory((prevHistory) => {
          const updatedHistory = prevHistory.map((chat, index) => {
            if (index === currentChatIndex) {
              let updatedChat = chat.chat.slice(0, -1); // Remove the assistant's placeholder
              updatedChat.push({ role: 'assistant', content: assistantResponse }); // Add the current accumulated response

              return {
                ...chat,
                chat: updatedChat,
              };
            }
            return chat;
          });

          return updatedHistory;
        });

        return reader.read().then(processText); // Continue reading the next chunk of the response
      });
    });
  };


  // Handle clicks on the chat history items
  const handleHistoryClick = (index) => {
    setCurrentChatIndex(index);
  };

  // Handle the creation of a new chat session
  const handleNewChat = () => {
    const newChat = { title: `New Chat ${history.length + 1}`, chat: [] };
    setHistory([...history, newChat]);
    setCurrentChatIndex(history.length);
  };

  // Save chat history to Firestore databse

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        bgcolor: "#1A4D2E",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#1A4D2E",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
            onChange={(e) => setMessage(e.target.value)}
          >
            <SendIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            AI Chat Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      <HistorySidebar
        history={history}
        onHistoryClick={handleHistoryClick}
        onNewChat={handleNewChat}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Toolbar /> {/* This is to offset the fixed AppBar */}
        {currentChatIndex !== null && (
          <ChatBox currentChat={history[currentChatIndex].chat} />
        )}
        {currentChatIndex !== null && (
          <ChatInput
            question={question}
            onChange={handleInputChange}
            onSubmit={sendMessage}
          />
        )}
      </Box>
    </Box>
  );
}
