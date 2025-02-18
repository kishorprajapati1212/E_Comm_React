import { Typography, Grid, Paper, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios";

const Placeorder = () => {
    const Backend_url =  import.meta.env.VITE_REACT_BACKEND_URL 

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);
    const product = useSelector((state) => state.order.product);
    const formData = useSelector((state) => state.order.orderform);
    const [charges, setCharges] = useState();
    const [payment, setPayment] = useState({ payment: formData?.payment || "Other" });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!product || !formData) {
            navigate('/');
        }

        if (product && product.totalcartitems) {
            setCharges(50);
        }
    }, [navigate, product, formData]);

    const totalAmount = () => {
        let totalPrice = 0;

        if (product && product.totalcartitems) {
            product.totalcartitems.forEach((item) => {
                totalPrice += item.price + charges;
            });
        }
        return totalPrice;
    };

    const handlePaymentChange = (e) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (product && product.totalcartitems) {
            const updatedItems = product.totalcartitems.map((item) => ({
                ...item,
                singleprice: item.price / item.qty,
                withoutcharges: item.price,
                withcharges: item.price + charges
            }));

            const updatedProduct = { ...product };
            updatedProduct.totalcartitems = updatedItems;

            const orderdetails = {
                product: updatedProduct,
                formdata: formData,
                payment: payment,
                charges: charges,
                totalamount: totalAmount()
            };

            const totalPayment = orderdetails.totalamount;
            // console.log(orderdetails)
            const userid = orderdetails.product.userid;
            // console.log("User:" + userid)
            const orderproduct = orderdetails.product.totalcartitems;
            // console.log(orderproduct)


            if (payment.payment === "Other") {

                // console.log("helo")

                const response = await axios.post(`${Backend_url}/checkout`, {
                    amount: totalPayment, userid, orderproduct, orderdetails
                });
                // console.log("helo")

                const { sessionId } = response.data;
                console.log(sessionId)
                // Redirect to Stripe checkout page
                const stripe = await loadStripe("pk_test_51P8h7jSDGOWUAXLsRdTR8F8Gk7FedhP8idXcIZIBgtUB7AtBsfjH2hmi9YCthmsfD2P6tmAkdCk90U48jELjhrei00ozfSuae4");
                const { error } = await stripe.redirectToCheckout({
                    sessionId: sessionId
                });
                // console.log("This is the after payment counter")
                if (error) {
                    console.error('Error redirecting to checkout:', error);
                    // Handle error
                }
                // console.log(orderdetails);
                navigate("/");
            }
        }
    };

    return (
        <Container>
            <Typography variant='h1'>Order Details</Typography>
            <Box sx={{ backgroundColor: "black", mb: 6 }}>
                <Grid container spacing={3} style={{ backgroundColor: `${colors.primary[6000]}` }}>
                    {/* Product Details Column */}
                    <Grid item xs={8}>
                        <Paper elevation={3} style={{ padding: '20px', backgroundColor: `${colors.primary[8000]}` }}>
                            <Typography variant='h4'>Product Details</Typography>
                            <Typography variant='h6' sx={{ mb: 1 }}>Total Items: {product?.totalcartitems?.length}</Typography>
                            {product &&
                                product.totalcartitems.map((item, index) => (
                                    <Grid container key={index} alignItems='center' style={{ marginBottom: '10px', borderBottom: '3px solid #ddd', backgroundColor: `${colors.primary[6000]}` }}>
                                        <Grid item>
                                            <img src={item.img1} alt={item.name} style={{ width: '30vh', height: '20vh', marginRight: '10px' }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography fontSize='20px'>Product Name: {item.product_name}</Typography>
                                            <Typography>Price: ₹{item.price}</Typography>
                                            <Typography>Charges: {charges}</Typography>
                                            <Typography>Quantity: {item.qty}</Typography>
                                            <Typography>Total Price: ₹{item.price + charges}</Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                        </Paper>
                    </Grid>

                    {/* Form Information and Payment Status Column */}
                    <Grid item xs={4}>
                        <Paper elevation={3} style={{ padding: '20px', backgroundColor: `${colors.primary[8000]}` }} sx={{ mr: 2 }}>
                            <Typography variant="h4" gutterBottom>Form Information</Typography>

                            <Grid container spacing={2}>
                                {/* Grid for Labels */}
                                <Grid item xs={6}>
                                    <Typography>First Name:</Typography>
                                    <Typography>Last Name:</Typography>
                                    <Typography>Email:</Typography>
                                    <Typography>Mobile No:</Typography>
                                    <Typography>Country:</Typography>
                                    <Typography>State:</Typography>
                                    <Typography>City:</Typography>
                                    <Typography>Street:</Typography>
                                    <Typography>Total Price:</Typography>
                                </Grid>

                                {/* Grid for Values */}
                                <Grid item xs={6} sx={{ }}>
                                    <Typography>{formData?.fname}</Typography>
                                    <Typography>{formData?.lname}</Typography>
                                    <Typography>{formData?.email}</Typography>
                                    <Typography>{formData?.mobile_no}</Typography>
                                    <Typography>{formData?.country}</Typography>
                                    <Typography>{formData?.state}</Typography>
                                    <Typography>{formData?.city}</Typography>
                                    <Typography>{formData?.street}</Typography>
                                    <Typography>₹{totalAmount()}</Typography>
                                </Grid>
                            </Grid>

                            {/* Payment Status */}
                            <Typography variant="h6" sx={{ mt: 2 }}>Payment Status</Typography>
                            <RadioGroup row name="payment" value={payment.payment} onChange={handlePaymentChange}>
                                <FormControlLabel
                                    value="Other"
                                    control={
                                        <Radio sx={{ color: `${colors.primary[100]}`, '&.Mui-checked': { color: `${colors.primary[100]}` } }} />
                                    }
                                    label="Card Payment"
                                />
                            </RadioGroup>

                            {/* Process Payment Button */}
                            <Button
                                variant="contained"
                                style={{ marginTop: '10px', backgroundColor: `${colors.primary[600]}` }}
                                onClick={handleSubmit}
                            >
                                Process Payment
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Placeorder;
