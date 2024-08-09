"use client";
import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";

export default function HistorySidebar({ history, onHistoryClick, onNewChat }) {
  return (
    <Box
      id="history-box"
      height="100%"
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      borderRight={"1px solid black"}
      width="28%"
    >
      <Box
        id="history-container"
        width="100%"
        padding="20px"
        height="100%"
        bgcolor="#E8DFCA"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        overflow="auto"
      >
        <Typography
          color={"#1A4D2E"}
          variant="h3"
          width="72%"
          borderBottom={"3px solid #1A4D2E"}
          textAlign={"center"}
          marginBottom="20px"
        >
          <b>Chat History</b>
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1A4D2E",
            color: "#E8DFCA",
            border: "1px solid #E8DFCA",
            "&:hover": {
              backgroundColor: "#E8DFCA",
              color: "#1A4D2E",
            },
            textTransform: "none",
            width: "90%",
            alignSelf: "center",
            marginBottom: "20px",
          }}
          onClick={onNewChat}
        >
          New Chat
        </Button>

        <Stack spacing={2} width="100%">
          {history.map((item, index) => (
            <Button
              key={index}
              variant="contained"
              sx={{
                backgroundColor: "#1A4D2E",
                color: "#E8DFCA",
                border: "1px solid #E8DFCA",
                "&:hover": {
                  backgroundColor: "#E8DFCA",
                  color: "#1A4D2E",
                },
                textTransform: "none",
                width: "90%",
                alignSelf: "center",
              }}
              onClick={() => onHistoryClick(index)}
            >
              {item.title}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
