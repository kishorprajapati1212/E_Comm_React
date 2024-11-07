import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { Theme } from "../../Theme";
import { useState, useEffect } from "react";
import axios from "axios";
import Statebox from "../../chart/Statebox";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Newuser = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);
    
    // State to hold the user data with default values
    const [user, setUser] = useState({
        currentDayCount: 0,
        increasePercentage: 0,
    });

    // Fetch the user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${Backend_url}/getnewuser`);
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, []); // Empty dependency array ensures this runs only once on component mount

    return (
        <Statebox
            title={user.currentDayCount.toLocaleString()}
            subtitle="New Client"
            progress={(user.increasePercentage / 100).toFixed(2)} // Assuming increasePercentage is a percentage
            increase={`${user.increasePercentage.toFixed(2)}%`}
            icon={
                <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
            }
        />
    );
};

export default Newuser;
