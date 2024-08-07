'use client';
import React, { useState } from "react";
import { Box } from "@mui/material";
import HistorySidebar from "./components/HistorySidebar";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

export default function ChatBot() {
  const [history, setHistory] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [question, setQuestion] = useState("");

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    if (question.trim() === "") return;

    const newChat = { type: "user", text: question };
    const updatedHistory = [...history];

    if (currentChatIndex !== null) {
      updatedHistory[currentChatIndex].chat.push(newChat);
    }

    setHistory(updatedHistory);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      const errorMessage = { type: "bot", text: "Sorry, something went wrong. Please try again later." };

      const updatedHistoryWithError = [...updatedHistory];
      if (currentChatIndex !== null) {
        updatedHistoryWithError[currentChatIndex].chat.push(errorMessage);
      }

      setHistory(updatedHistoryWithError);
    }

    setQuestion("");
  };

  const handleHistoryClick = (index) => {
    setCurrentChatIndex(index);
  };

  const handleNewChat = () => {
    const newChat = { title: `New Chat ${history.length + 1}`, chat: [] };
    setHistory([...history, newChat]);
    setCurrentChatIndex(history.length);
  };

  return (
    <Box width="100vw" height="100vh" bgcolor={"#1A4D2E"} display={"flex"}>
      <HistorySidebar history={history} onHistoryClick={handleHistoryClick} onNewChat={handleNewChat} />
      <Box
        width="72%"
        height="100%"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        {currentChatIndex !== null && <ChatBox currentChat={history[currentChatIndex].chat} />}
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
