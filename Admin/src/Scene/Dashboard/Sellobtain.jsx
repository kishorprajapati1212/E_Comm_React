import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { Theme } from "../../Theme";
import { useState, useEffect } from "react";
import axios from "axios";
import Statebox from "../../chart/Statebox";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useRef } from "react";
// import axios from "axios";

const Sellobtain = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;
    const theme = useTheme();
    const colors = Theme(theme.palette.mode);

    const [todayOrderCount, setTodayOrderCount] = useState(0);
    const [increase, setIncrease] = useState("0%");
    const [progress, setProgress] = useState(0);
    const [iconColor, setIconColor] = useState(colors.greenAccent[600]);

    // Ref to track if the API has been called
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchEmails = async () => {
            if (hasFetched.current) return; // Skip if already fetched
            try {
                const res = await axios.get(`${Backend_url}/getallemail`);
                const currentDate = new Date();

                // Filter today's orders
                const todayOrders = res.data.orders.filter(order => {
                    const orderDate = new Date(order.time);
                    return (
                        orderDate.getFullYear() === currentDate.getFullYear() &&
                        orderDate.getMonth() === currentDate.getMonth() &&
                        orderDate.getDate() === currentDate.getDate()
                    );
                });

                // Calculate today's and previous day's order counts
                const todayCount = todayOrders.length;
                const previousCount = res.data.orders.length - todayCount;  // Total orders minus today's orders

                setTodayOrderCount(todayCount);

                // Calculate increase percentage and progress
                const calculatedIncrease = previousCount
                    ? ((todayCount - previousCount) / previousCount) * 100
                    : 100;  // Default to 100% if there were no previous orders

                setIncrease(`${calculatedIncrease.toFixed(2)}%`);
                setProgress(Math.min(1, Math.max(0, calculatedIncrease / 100))); // Limit progress between 0 and 1

                // Set icon color based on increase or decrease
                setIconColor(calculatedIncrease < 0 ? colors.redAccent[600] : colors.greenAccent[600]);

                hasFetched.current = true; // Mark as fetched
            } catch (error) {
                console.error("Error fetching email data:", error);
            }
        };

        fetchEmails();

    }, []);  // The empty array ensures this runs only once on component mount

    return (
        <>
            <Statebox
                title={todayOrderCount.toString()}
                subtitle="Sales Obtain"
                progress={progress}
                increase={`${increase}`}
                icon={<PointOfSaleIcon sx={{ color: iconColor, fontSize: "26px" }} />} />
        </>
    );
};

export default Sellobtain;
