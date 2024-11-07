import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { Theme } from "../../Theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { fetchOrder } from "./Campaign";  // Import the fetchOrder function
import { useState, useEffect } from "react";
import axios from "axios";

const ProfitDashboard = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);

    // Use state to store the revenue
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProfit, settotalProfit] = useState(0);

    // Fetch the revenue using useEffect
    useEffect(() => {
        const getRevenue = async () => {
            const revenue = await fetchOrder();  
            setTotalRevenue(revenue);  
    
            const res = await axios.get(`${Backend_url}/getAllorders`);
            const currentYear = new Date().getFullYear();
    
            const sell = res.data.orders
                .filter(order => order.order_status === 'Deliver' && new Date(order.time).getFullYear() === currentYear)
                .reduce((acc, order) => acc + order.orderItems[0].withoutcharges, 0);
    
            // console.log("Total Revenue:", revenue);   // should log 1540
            // console.log("Total Sell:", sell);         // should log 1390
    
            const calculatedProfit = revenue - sell;
            // console.log("Calculated Profit (Revenue - Sell):", calculatedProfit); // Expect 150
    
            settotalProfit(calculatedProfit);  // Set the calculated profit
        };
    
        getRevenue();  
    }, []);
     // Empty dependency array ensures this runs only once on component mount

    return (
        <>
            <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                        Profit Generated
                    </Typography>
                    {/* Use the revenue from the state */}
                    <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                        ${totalProfit.toLocaleString()} {/* Format number as currency */}
                    </Typography>
                </Box>
                <Box>
                    <IconButton>
                        <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
};

export default ProfitDashboard;
