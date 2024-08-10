"use client";
import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 280;

export default function HistorySidebar({
  history,
  onHistoryClick,
  onNewChat,
  mobileOpen,
  handleDrawerToggle,
  onDeleteChat
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawer = (
    <Box
      id="history-container"
      width="100%"
      height="100%"
      bgcolor="#E8DFCA"
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="auto"
      px={3}
      py={4}
    >
      <Typography
        color="#1A4D2E"
        variant="h4"
        fontWeight="bold"
        width="100%"
        borderBottom="3px solid #1A4D2E"
        textAlign="center"
        mb={3}
      >
        Chat History
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
          width: "100%",
          mb: 3,
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
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => onHistoryClick(index)}
          >
            {item.title}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the button click from triggering the chat selection
                onDeleteChat(index);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Button>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
