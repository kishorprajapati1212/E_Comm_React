import React, { useState, useContext } from "react";
import { Box, IconButton, Badge, useTheme, InputBase } from "@mui/material";
import { ColorModeContext, Theme } from "../../Theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // State for notifications
  const [notifications, setNotifications] = useState("0");
  const navigate = useNavigate();

  // Logout functionality 
  const handleLogout = () => {
    // Clear localStorage or any user session data
    localStorage.clear();
    // alert("You have been logged out.");
    // Redirect to login page (replace with your route)
    navigate('/login');
  };
  const currentDate = new Date().toLocaleString();

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* Uncomment for search functionality */}
       <InputBase sx={{ml: 2, flex: 1, fontWeight: 'bold', fontSize: '1rem'}}
        placeholder={currentDate} // Display the date and time as placeholder
        readOnly // Make it non-interactive (not editable)
      />
       
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <Badge badgeContent={notifications} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={handleLogout}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
