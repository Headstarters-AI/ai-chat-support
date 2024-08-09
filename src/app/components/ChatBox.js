"use client";
import React, { useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatBox({ currentChat }) {
  const chatBoxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  return (
    <Box
      ref={chatBoxRef}
      sx={{
        flexGrow: 1,
        overflow: "auto",
        p: 2,
        backgroundColor: "#F9F5EB",
        borderRadius: 2,
        mb: 2,
        maxHeight: "80vh",
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
              wordWrap: "break-word", // Ensure long words break and don't overflow
            }}
          >
            <Typography variant="body1">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  ul: ({ children, ...props }) => (
                    <ul style={{ paddingLeft: "20px", margin: 0 }} {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol style={{ paddingLeft: "20px", margin: 0 }} {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li style={{ paddingLeft: "10px", marginBottom: "8px", listStyleType: "disc" }} {...props}>
                      {children}
                    </li>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </Typography>
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
      <div ref={messagesEndRef} />
    </Box>
  );
}
