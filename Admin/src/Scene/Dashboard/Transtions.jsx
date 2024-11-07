import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Ensure you have the theme available
import { Theme } from "../../Theme";
import axios from 'axios';

const Transactions = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchPayment = async () => {
            const res = await axios.get(`${Backend_url}/getallpayment`);
            setTransactions(res.data);
        }
        fetchPayment();
    }, []);

    // Sort the transactions array to show the most recent ones first
    const sortedTransactions = transactions.sort((a, b) => new Date(b.payment_time) - new Date(a.payment_time));

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
            >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                    Recent Transaction
                </Typography>
            </Box>

            {sortedTransactions.map((transaction, index) => (
                <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                >
                    <Box>
                        <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                            {transaction.product?.formdata?.fname || "No name available"}
                        </Typography>
                        <Typography color={colors.grey[100]}>
                            {transaction._id.slice(0, 8)}...
                        </Typography>
                    </Box>

                    <Box color={colors.grey[100]}>
                        {new Date(transaction.payment_time).toLocaleString('en-US', {
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                        })}
                    </Box>

                    <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                        ${transaction.amount}
                    </Box>
                </Box>
            ))}
        </>
    );
};

export default Transactions;
