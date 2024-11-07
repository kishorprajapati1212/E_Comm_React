import { Box } from "@mui/material";
import Header from "./Header";
import Linechart from "../chart/Linechart";
import { useEffect, useState } from "react";
import axios from "axios";

const Line = ({ isDashboard = false }) => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchorder = async () => {
            const res = await axios.get(`${Backend_url}/getAllorders`);
            const order = res.data.orders;  // Ensure you're accessing the correct structure

            // console.log(order);  // Log the structure of the response

            if (Array.isArray(order)) {
                const currentyear = new Date().getFullYear();

                // Create an object to store monthly sales per category
                const deliverorder = order
                    .filter(order => order.order_status === "Deliver" && new Date(order.time).getFullYear() === currentyear)
                    .reduce((acc, order) => {
                        order.orderItems.forEach(item => {
                            const category = item.product_name;
                            const month = new Date(order.time).toLocaleString('default', { month: 'long' }); // Get the month name

                            if (!acc[category]) {
                                acc[category] = Array(12).fill(0); // Create an array of 12 months for each category
                            }

                            // Add the quantity sold to the corresponding month
                            const monthIndex = new Date(order.time).getMonth(); // Get the index of the month (0 = January, 11 = December)
                            acc[category][monthIndex] += item.qty;
                        });
                        return acc;
                    }, {});

                // Convert the object to an array of categories and monthly sales
                const formattedData = Object.keys(deliverorder)
                    .map(category => ({
                        id: category,
                        data: deliverorder[category].map((qty, index) => ({
                            x: new Date(0, index).toLocaleString('default', { month: 'short' }), // Get the month abbreviation
                            y: qty,
                        }))
                    }));

                // Sort the categories by total sales and select the top 5
                const sortedData = formattedData
                    .map(category => ({
                        ...category,
                        totalSales: category.data.reduce((sum, item) => sum + item.y, 0), // Calculate total sales for each category
                    }))
                    .sort((a, b) => b.totalSales - a.totalSales) // Sort by total sales in descending order
                    .slice(0, 5); // Select the top 5 categories

                setData(sortedData);  // Set the data state as an array
            } else {
                console.error("Expected an array, but received:", order);
            }
        };
        console.log(data)

        fetchorder();
    }, []);

    console.log(data);  // Log the final data structure before passing to the chart

    return (
        <Box ml="10px">
            {!isDashboard ? (
                <>
                    <Header title="Top 5 Categories by Month" subtitle="Monthly Sales Line Chart" />
                    <Box height="75vh">
                        <Linechart data={data} /> {/* Pass data to Linechart */}
                    </Box>
                </>
            ) : (
                <>
                    <Box height="220px">
                        <Linechart data={data} /> {/* Pass data to Linechart */}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Line;
