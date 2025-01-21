import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { dispalyorder } from '../Store/Orderslice';
import { Box, Container, Typography, Card, CardContent, CardMedia, Select, MenuItem, Grid, Button } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
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
  const [popup, setPopup] = useState(false);
  const [selectedorder, setSelectedorder] = useState(null);

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

  const close = () => {
    setPopup(!popup)
    setSelectedorder(null);
  }

  const SelectButtonClick = (item) => {
    setSelectedorder(item);
    setPopup(!popup)
  }
  console.log(selectedorder)

  return (
    <Container>
      <Box>
        <Typography variant='h1' sx={{ textAlign: "center", mb: 2, mt: 2, fontWeight: "600" }}>Order History</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: "30px" }}>
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
                  <Card
                    onClick={() => SelectButtonClick(item)}
                    sx={{
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
                      {/* <Typography variant="body2">Order ID: {item._id}</Typography> */}
                      {/* <Typography variant="body2">Payment Status: {item.payment_status}</Typography> */}
                      <Typography variant="body2">Order Time: {new Date(item.time).toLocaleString()}</Typography>
                      {/* <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Total: {item.orderItems[0].withcharges}
                    </Typography> */}
                    </CardContent>
                  </Card>
                </Grid>
              )
            ))
          )}
        </Grid>
      </Box>
      {popup && selectedorder && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "black",
          }}
        >
          <Box
            sx={{
              backgroundColor: `${colors.primary[500]}`,
              borderRadius: "12px",
              boxShadow: 4,
              width: "500px",
              padding: 4,
              textAlign: "center",
            }}
          >
            <Typography sx={{  fontWeight: "bold", color: "#4CAF50", fontSize: "1.5rem" }}>
              Products
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                padding: 0,
                textAlign: "left",
                mt: 1,
                // border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: `${colors.primary[400]}`,
              }}
            >
              {selectedorder.orderItems.map((item, index) => (
                <li
                  key={index}
                  style={{
                    padding: "8px 16px",
                    color:`${colors.primary[100]}`,
                    borderBottom: index < selectedorder.orderItems.length - 1 ? "1px solid #ddd" : "none",
                  }}
                >
                  <li> Product Name :- {item.product_name} </li>
                  <li> Product Quantity :- {item.qty} </li>
                  <li style={{ fontSize: "1.2rem" }}> Total Amount :- {item.withcharges} </li>
                </li>
              ))}
            </Box>

            {/* Horizontal Timeline */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontSize: "1.4rem", color:`${colors.greenAccent[100]}` }}>
              Order Status
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                padding: "0 16px",
              }}
            >
              {[
               { status: "Pending", icon: "⏳" },
               { status: "Process", icon: "✅" },
               { status: "Accept", icon: "🚚" },
               { status: "Deliver", icon: "📦" }, 
               { status: "complete", icon: "🎉" },
              ].map((step, index, steps) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor:
                          selectedorder.order_status === step.status || index <= steps.findIndex(s => s.status === selectedorder.order_status)
                            ? `${colors.greenAccent[600]}`  // Green if status matches or it's before the current status
                            : "#ddd",    // Gray if it's after the current status
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "18px",
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: selectedorder.order_status === step.status ? "bold" : "normal",
                        mt: 1,
                        color: selectedorder.order_status === step.status || index <= steps.findIndex(s => s.status === selectedorder.order_status)
                        ? `${colors.greenAccent[500]}`
                         : `${colors.greenAccent[100]}`,
                      }}
                    >
                      {step.status}
                    </Typography>
                  </Box>
                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        flex: 1,
                        height: "4px",
                        backgroundColor:
                          index < steps.findIndex(s => s.status === selectedorder.order_status) || selectedorder.order_status === steps[index].status
                            ? "#4CAF50"  // Green if it's before the current or on the current status
                            : "#ddd",    // Gray if it's after the current status
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={close}
              sx={{ mt: 3 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Orderconform;
