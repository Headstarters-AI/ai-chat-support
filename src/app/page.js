"use client";
import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HistorySidebar from "./components/HistorySidebar";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

// Firebase imports
import { firestore } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const drawerWidth = 280;

export default function ChatBot() {
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
  const handleSubmit = async () => {
    if (question.trim() === "") return;

    const newChat = { type: "user", text: question };
    const updatedHistory = [...history];

    if (currentChatIndex !== null) {
      updatedHistory[currentChatIndex].chat.push(newChat);
    }

    setHistory(updatedHistory);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: question }),
      });

      const data = await response.json();
      const botResponse = { type: "bot", text: data.message };

      const updatedHistoryWithResponse = [...updatedHistory];
      if (currentChatIndex !== null) {
        updatedHistoryWithResponse[currentChatIndex].chat.push(botResponse);
      }

      setHistory(updatedHistoryWithResponse);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = {
        type: "bot",
        text: "Sorry, something went wrong. Please try again later.",
      };

      const updatedHistoryWithError = [...updatedHistory];
      if (currentChatIndex !== null) {
        updatedHistoryWithError[currentChatIndex].chat.push(errorMessage);
      }

      setHistory(updatedHistoryWithError);
    }

    setQuestion("");
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
          >
            <MenuIcon />
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
            onSubmit={handleSubmit}
          />
        )}
      </Box>
    </Box>
  );
}
