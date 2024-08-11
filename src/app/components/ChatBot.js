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
import LogoutIcon from "@mui/icons-material/Logout";
import HistorySidebar from "./HistorySidebar";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";

const drawerWidth = 280;

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");

  const [history, setHistory] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);
  const [question, setQuestion] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");
    if (token) {
      setUser(username);
      fetch(`/api/auth/getHistory?username=${username}`)
        .then((response) => response.json())
        .then((data) => {
          const fetchedHistory = data.history || [];
          setHistory(fetchedHistory);
          if (fetchedHistory.length > 0) {
            setCurrentChatIndex(0);
          } else {
            handleNewChat();
          }
        })
        .catch((error) => {
          console.error("Error fetching history:", error);
        });
    } else {
      router.push("/login");
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle input change in the chat input box
  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  // Handle form submission to send the user question to the API
  const sendMessage = async () => {
    if (currentChatIndex === null || !history[currentChatIndex]) {
      console.error("No chat selected or invalid chat index.");
      return;
    }
    const newMessage = { role: "user", content: question };
    const assistantMessage = { role: "assistant", content: "" };

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
    setQuestion("");

    // Send the user's message to the server
    const response = fetch("/api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...history[currentChatIndex].chat, newMessage]), // Send the current chat history with the new message
    }).then(async (res) => {
      const reader = res.body.getReader(); // Get a reader to read the response body
      const decoder = new TextDecoder(); // Create a decoder to decode the response text

      let assistantResponse = ""; // Initialize a string to accumulate the assistant's response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          // Update the assistant's final response when streaming is complete
          setHistory((prevHistory) => {
            const updatedHistory = prevHistory.map((chat, index) => {
              if (index === currentChatIndex) {
                let updatedChat = chat.chat.slice(0, -1); // Remove the assistant's placeholder
                updatedChat.push({
                  role: "assistant",
                  content: assistantResponse,
                }); // Add the complete assistant response
                // console.log(`updated chat: ${JSON.stringify(updatedChat,null,2)}`)
                return {
                  ...chat,
                  chat: updatedChat,
                };
              }
              // console.log(`chat: ${JSON.stringify(chat, null, 2)}`);

              return chat;
            });
            //console.log(`update history: ${JSON.stringify(updatedHistory,null,2)}`)
            //store in data base here
            fetch("/api/auth/updateHistory", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: user,
                updatedHistory,
              }),
            })
              .then((response) => response.json())
              .then((data) => console.log(data))
              .catch((error) => console.error("Error:", error));
            return updatedHistory;
          });
          return assistantResponse;
        }

        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        }); // Decode the text
        assistantResponse += text; // Accumulate the chunks of the response

        // Update the assistant's message in real-time
        setHistory((prevHistory) => {
          const updatedHistory = prevHistory.map((chat, index) => {
            if (index === currentChatIndex) {
              let updatedChat = chat.chat.slice(0, -1); // Remove the assistant's placeholder
              updatedChat.push({
                role: "assistant",
                content: assistantResponse,
              }); // Add the current accumulated response

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
    if (index >= 0 && index < history.length) {
      setCurrentChatIndex(index);
    } else {
      console.error("Invalid chat index");
    }
  };

  // Handle the creation of a new chat session
  const handleNewChat = () => {
    const newChat = { title: `New Chat ${history.length + 1}`, chat: [] };
    setHistory((prevHistory) => [...prevHistory, newChat]);
    setCurrentChatIndex(history.length); // This will be the index of the new chat
  };

  // Delete a new chat session
  const deleteChat = (indexToDelete) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.filter(
        (_, index) => index !== indexToDelete
      );

      // Update currentChatIndex if necessary
      let newCurrentChatIndex = currentChatIndex;
      if (currentChatIndex === indexToDelete) {
        // If the current chat is deleted, reset the index
        newCurrentChatIndex = null;
      } else if (currentChatIndex > indexToDelete) {
        // Adjust the index if the deleted chat was before the current one
        newCurrentChatIndex -= 1;
      }

      setCurrentChatIndex(newCurrentChatIndex);
      // console.log(`new History:${JSON.stringify(newHistory,null,2)}`)
      fetch("/api/auth/updateHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          updatedHistory: newHistory,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      return newHistory;
    });
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("userId");
  //   localStorage.removeItem("username");

  //   setUser(null);
  //   setHistory([]);
  //   setCurrentChatIndex(null);

  //   window.location.href = "/login";
  // };

  // Save chat history to Firestore databse

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        bgcolor: "#1A4D2E",
        justifyContent: "space-between",
        alignItems: "center",
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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
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
          </div>
          <IconButton
            color="inherit"
            aria-label="logout"
            // onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <HistorySidebar
        history={history}
        onHistoryClick={handleHistoryClick}
        onNewChat={handleNewChat}
        onDeleteChat={deleteChat}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          p: 2,
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Toolbar /> {/* This is to offset the fixed AppBar */}
        {currentChatIndex !== null ? (
          <ChatBox currentChat={history[currentChatIndex].chat} />
        ) : (
          true
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
