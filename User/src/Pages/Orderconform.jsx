import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { dispalyorder } from '../Store/Orderslice';
import { Box, Container, Typography, Card, CardContent, CardMedia, Select, MenuItem, Grid } from '@mui/material';
import { Orderskeleten } from '../Component/Loading/Skeletenloadning';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';

const Orderconform = () => {
  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const userid = useParams();
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.order.orderdata);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Default filter: all orders

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(dispalyorder(userid.userid));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, userid]);

  // console.log(orderData)
  // Filtered orders based on the selected filter
  const filteredOrders = orderData?.orderdata?.filter(item => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'pending') {
      return item.order_status === 'Pending';
    } else if (filter === 'delivered') {
      return item.order_status === 'Deliver';
    }
    return false;
  });

  // Sort orders by the time difference from the present in descending order (newest first)
  const sortedOrders = filteredOrders?.slice().sort((a, b) => {
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);

    // Check if timeA and timeB are valid date objects
    if (isNaN(timeA.getTime())) return 1; // Consider timeA as oldest if it's not a valid date
    if (isNaN(timeB.getTime())) return -1; // Consider timeB as oldest if it's not a valid date

    return timeB - timeA; // Sort in descending order (newest first)
  });


  return (
    <Container>
      <Box>
        <Typography variant='h1' sx={{ textAlign: "center", mb: 2, mt: 2, fontWeight:"600" }}>Order History</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m:"30px" }}>
        {/* Filter dropdown */}
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ mb: 2 }}>
          <MenuItem value="all">All Orders</MenuItem>
          <MenuItem value="pending">Pending Orders</MenuItem>
          <MenuItem value="delivered">Delivered Orders</MenuItem>
        </Select>
        {/* Render orders */}
        <Grid container spacing={3} justifyContent="center">
        {loading ? (
          // Render the skeleton loading component when loading
          Array.from({ length: 10 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Orderskeleten />
            </Grid>
          ))
        ) : (
          sortedOrders && sortedOrders.map((item) => (
            item.orderItems && item.orderItems.length > 0 && (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{
                  // border: "2px solid #ddd",
                  // boxShadow: `0px 4px 10px ${colors.primary[500]}`,
                  backgroundColor: colors.primary[6000],
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    // boxShadow: `0px 8px 15px ${colors.primary[500]}`,
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.orderItems[0].img1}
                    alt="Product Image"
                    sx={{
                      width: '100%',
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: colors.primary[100] }}>
                      Product: {item.orderItems[0].product_name}
                    </Typography>
                    <Typography variant="body2">Order ID: {item._id}</Typography>
                    <Typography variant="body2">Charges: {item.charges}</Typography>
                    <Typography variant="body2">Payment Status: {item.payment_status}</Typography>
                    <Typography variant="body2">Order Time: {new Date(item.time).toLocaleString()}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Total: {item.orderItems[0].withcharges}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          ))
        )}
      </Grid>
      </Box>
    </Container>
  );
};

export default Orderconform;
