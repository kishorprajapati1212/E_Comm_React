import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { Theme } from "../../Theme";
import { useState, useEffect } from "react";
import axios from "axios";

const Traffic = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);

    
    // Fetch the revenue using useEffect
    useEffect(() => {
       
    }, []);  // Empty dependency array ensures this runs only once on component mount

    return (
        <>
           
        </>
    );
};

export default Traffic;
