import { Box } from "@mui/material";
import Header from "./Header";
import BarChart from "../chart/Barchart";
import React, { useEffect, useState } from "react";

const Bar = ({ isDashboard = false }) => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL

    const [barchartdata, setBarchartdata] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${Backend_url}/getAllorders`);
            const data = await response.json();
            // console.log(data)
            // Process fetched data and organize it
            const processedData = processData(data);
            setBarchartdata(processedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const processData = (data) => {
        const today = new Date();
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const processedData = [];
        const productTotals = {};

        // Helper function to format date as "dd-mm-yyyy"
        const formatDate = (date) => {
            return date.toLocaleDateString('en-GB');
        };

        // Flag to track if any orders are within the last 5 days
        let hasRecentOrders = false;

        // Iterate over each order
        data.orders.forEach(order => {
            const orderDate = new Date(order.time);
            // Check if the order is within the last 5 days
            if (orderDate >= fiveDaysAgo && orderDate <= today) {
                hasRecentOrders = true;
                const formattedDate = formatDate(orderDate);
                processOrderData(order, formattedDate, processedData, productTotals);
            }
        });

        // If no recent orders found, process all data
        if (!hasRecentOrders) {
            console.warn("No recent orders found, processing all data.");
            data.orders.forEach(order => {
                const formattedDate = formatDate(new Date(order.time));
                processOrderData(order, formattedDate, processedData, productTotals);
            });
        }

        return filterTopProducts(processedData, productTotals);
    };

    // Helper function to process order data
    const processOrderData = (order, formattedDate, processedData, productTotals) => {
        // Find existing date entry
        const existingDateIndex = processedData.findIndex(item => item.date === formattedDate);
        if (existingDateIndex === -1) {
            // Create new date entry if it doesn't exist
            const dateEntry = { date: formattedDate };
            order.orderItems.forEach(item => {
                dateEntry[item.product_name] = item.qty;
                productTotals[item.product_name] = (productTotals[item.product_name] || 0) + item.qty;
            });
            processedData.push(dateEntry);
        } else {
            // Update existing date entry
            const existingDate = processedData[existingDateIndex];
            order.orderItems.forEach(item => {
                if (existingDate[item.product_name]) {
                    existingDate[item.product_name] += item.qty;
                } else {
                    existingDate[item.product_name] = item.qty;
                }
                productTotals[item.product_name] = (productTotals[item.product_name] || 0) + item.qty;
            });
        }
    };

    // Filter to include only the top 4 products
    const filterTopProducts = (processedData, productTotals) => {
        const topProducts = Object.keys(productTotals)
            .sort((a, b) => productTotals[b] - productTotals[a])
            .slice(0, 4);

        const filteredProcessedData = processedData.map(entry => {
            const filteredEntry = { date: entry.date };
            topProducts.forEach(product => {
                filteredEntry[product] = entry[product] || 0;
            });
            return filteredEntry;
        });


        // console.log(filteredProcessedData);

        return filteredProcessedData;
    };


    // console.log(barchartdata)

    return (
        <Box m="20px">
            {!isDashboard ?
                <>
                    <Header title="Bar Chart" subtitle="Simple Bar Chart" />
                    <Box height="75vh">
                        <BarChart data={barchartdata} />
                    </Box>
                </> :
                <>
                    <Box height="250px">
                        <BarChart data={barchartdata} />
                    </Box>
                </>}

        </Box>
    );
};

export default Bar;
