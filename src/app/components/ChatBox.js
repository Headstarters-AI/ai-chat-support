"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ChatBox({ currentChat }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        p: 2,
        backgroundColor: "#F9F5EB",
        borderRadius: 2,
        mb: 2,
      }}
    >
      {currentChat && currentChat.length > 0 ? (
        currentChat.map((message, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: message.role === "user" ? "#E8DFCA" : "#AACB73",
              color: "#1A4D2E",
              maxWidth: "80%",
              ml: message.role === "user" ? "auto" : 0,
              mr: message.role === "user" ? 0 : "auto",
              borderRadius: 2,
              height: message.content === "" ? "54px" : "auto",
            }}

          >
            <Typography variant="body1">{message.content}</Typography>
          </Paper>
        ))
      ) : (
        <Typography
          variant="body1"
          color="#1A4D2E"
          textAlign="center"
          justifyContent="center"
        >
          Start a new chat or select a chat from the history.
        </Typography>
      )}
    </Box>
  );
}
