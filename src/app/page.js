"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistorySidebar from "./components/HistorySidebar";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

export default function ChatBot() {
  // Options for sidebar history; just an example. Have to connect to database or some other technique to get history
  const history = [
    "How to do Javascript",
    "How to do Python",
    "How to do this",
    "How to do that",
  ];

  // Define the Q&A pairs
  const qAndA = {
    "Tell me more about JavaScript":
      "JavaScript is a versatile, high-level programming language primarily used to create interactive and dynamic content on websites. It runs in web browsers and enables features like animations, form validation, and responsive user interfaces. JavaScript is a core technology of the web, alongside HTML and CSS, and supports event-driven, functional, and object-oriented programming styles. It's widely used for both client-side and server-side development, with frameworks like Node.js, React, and Angular enhancing its capabilities for building complex applications.",
    "Tell me more about Python":
      "Python is a high-level, interpreted programming language known for its simplicity and readability, making it an excellent choice for beginners and experienced developers alike. Created by Guido van Rossum and first released in 1991, Python emphasizes code readability and uses significant whitespace, which helps developers write clean and maintainable code.",
  };

  const [question, setQuestion] = useState("");
  const [currentChat, setcurrentChat] = useState([]);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = () => {
    if (question.trim() === "") return;

    const answer =
      qAndA[question] || "Sorry, I don't have an answer for that question.";

    setcurrentChat((prevHistory) => [
      ...prevHistory,
      { type: "user", text: question },
      { type: "bot", text: answer },
    ]);

    setQuestion("");
  };

  return (
    <Box width="100vw" height="100vh" bgcolor={"#1A4D2E"} display={"flex"}>
      <HistorySidebar history={history}></HistorySidebar>
      <Box
        width="72%"
        height="100%"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <ChatBox currentChat={currentChat} />
        <ChatInput
          question={question}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
}
