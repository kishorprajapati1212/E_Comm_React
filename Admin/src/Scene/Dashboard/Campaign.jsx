import ProgressCircle from "../../chart/Progresscircle"
import { Typography, Box, useTheme } from "@mui/material";
import { Theme } from "../../Theme";
import { useEffect, useState } from "react";
import axios from "axios";

export const fetchOrder = async () => {
    try {
        const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

        const res = await axios.get(`${Backend_url}/getAllorders`);
        const currentYear = new Date().getFullYear();

        const totalRevenue = res.data.orders
            .filter(order => order.order_status === "Deliver" && new Date(order.time).getFullYear() === currentYear)
            .reduce((acc, order) => acc + order.orderItems[0].withcharges, 0);

        return totalRevenue;
        // console.log("Total Revenue:", revenue);
        // console.log(res.data);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const Campaign = () => {
    const theme = useTheme();
    const colors = Theme(theme.palette.mode);

    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const getrevenue = async() =>{
            const totalrevenue = await fetchOrder();
            setRevenue(totalrevenue) 

        }
        getrevenue()

        
    }, []);

    return (
        <>
            <Typography variant="h5" fontWeight="600">
                Campaign
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <ProgressCircle size="125" />
                <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }} >
                    ${revenue.toLocaleString()} Revenue Generated
                </Typography>
                <Typography>
                    Include Extra Expansive and Costa
                </Typography>
            </Box>
        </>
    );
};

export default Campaign;
