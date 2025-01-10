import React, { useState, useEffect } from 'react';
import Header from '../../S-Comp/Header';
import { Box } from '@mui/material';
import { Theme } from '../../Theme';
import { useTheme } from '@emotion/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined';
import { Typography, Fade, Modal, Backdrop, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const Allorder = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [status, setStatus] = useState({ order_status: "" });

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'fname', headerName: 'FIRST_NAME', flex: 0.5 },
        { field: 'lname', headerName: 'LAST_NAME', flex: 0.5 },
        { field: 'mobile_no', headerName: 'PHONE_NO', flex: 0.5 },
        // ADDRESS
        {
            field: 'address',
            headerName: 'Address',
            flex: 1,
            renderCell: ({ row }) => (
                <div key={row.id}>
                    <div>{`${row.street}`}</div>
                    <div>{`${row.city}`}</div>
                    <div>{`${row.state}`}</div>
                    <div>{`${row.country}`}</div>
                </div>
            ),
        },
        // Product
        {
            field: 'productDetails',
            headerName: 'Product Details',
            flex: 1,
            renderCell: ({ row }) => (
                <div key={row.id}>
                    <div>{`Product Name: ${row.orderItems[0].product_name}`}</div>
                    <div>{`Price: ${row.orderItems[0].singleprice}`}</div>
                    <div>{`Quantity: ${row.orderItems[0].qty}`}</div>
                    <div>{`Charges: ${row.charges}`}</div>
                    <div>{`Total Amount: ${row.orderItems[0].withcharges}`}</div>
                </div>
            ),
        },
        // payment
        {
            field: 'payment',
            headerName: 'Payment',
            flex: 1,
            renderCell: ({ row }) => (
                <div key={row.id}>
                    <div>{`Payment Type: ${row.payment_type}`}</div>
                    <div>{`Payment Status: ${row.payment_status}`}</div>
                </div>
            ),
        },
        // OrderStatus
        {
            field: 'order_status',
            headerName: 'Order Status',
            flex: 1,
            renderCell: ({ row }) => (
                <div key={row.id}>{row.order_status}</div>
            ),
        },
        // Actions
        {
            field: 'actions',
            headerName: 'ACTIONS',
            flex: 1,
            renderCell: (params) => (
                <div key={params.row.orderItems._id}>
                    <UpgradeOutlinedIcon
                        style={{ cursor: 'pointer', marginRight: '10px', fontSize: '30px', color: colors.greenAccent[500] }}
                        onClick={() => handleUpdate(params.row)}
                    />UPDATE
                </div>
            ),
        },
    ];

    const handleUpdate = (row) => {
        setSelectedOrder({
            orderId: row.orderItems[0].orderid,
            productId: row.orderItems[0].product_id,
        });
        setStatus({ order_status: row.order_status });
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const getRowId = (row) => row._id;

    const getRowHeight = () => 100; // Adjust this value according to your needs

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${Backend_url}/getAllorders`);
                const orderData = res.data.orders.map((order, index) => ({ ...order, id: index + 1 }));
                console.log(orderData);
                setOrders(orderData);
            } catch (error) {
                console.error('Error fetching order details', error);
            }
        };

        fetchOrder();
    }, []);

    const handleChanges = (e) => {
        setStatus({ ...status, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${Backend_url}/updateorder/${selectedOrder.orderId}`, {
                order_status: status.order_status
            });

            // After successful update, you may want to refresh the orders
            const res = await axios.get(`${Backend_url}/getAllorders`);
            const orderData = res.data.orders.map((order, index) => ({ ...order, id: index + 1 }));
            setOrders(orderData);

            handleClose();
        } catch (error) {
            console.error('Error updating order:', error);
            // Handle error, show a message to the user, etc.
        }
    };

    return (
        <>
            <Box m="20px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* Header */}
                    <Header title="Order" subtitle="You can Update the Order status" />
                </Box>
                <Box
                    m="40px 0 0 0"
                    height="90vh"
                    overflow="auto"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: 'none',
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: 'none',
                        },
                        "& .name-column--cell": {
                            color: colors.greenAccent[300],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.blueAccent[700],
                            borderBottom: 'none',
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: 'none',
                            backgroundColor: colors.blueAccent[700],
                        },
                        "& .MuiCheckbox-root": {
                            color: `${colors.greenAccent[200]} !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${colors.grey[100]} !important`,
                        }
                    }}
                >
                    {orders.length > 0 ? (
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            className="datagrid-container"
                            headerClassName="datagrid-header"
                            cellClassName="datagrid-cell"
                            getRowId={getRowId}
                            getRowHeight={getRowHeight}
                        />
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </Box>
            </Box>

            {selectedOrder && (
                <Modal open={openModal} onClose={handleClose} BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                    <Fade in={openModal}>
                        <Box sx={{
                            backgroundColor: colors.grey[500], padding: '20px', borderRadius: '8px', textAlign: 'center', position: 'absolute',
                            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        }}>
                            <h2>{`Update Order: ${selectedOrder.orderId}`}</h2>
                            
                            {/* Order Status Radio Group */}
                            <Typography variant="h5">ORDER_STATUS</Typography>
                            <RadioGroup
                                aria-label="order-status"
                                name="order_status"
                                value={status.order_status}
                                onChange={handleChanges}
                            >
                                <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
                                <FormControlLabel value="Process" control={<Radio />} label="Process" />
                                <FormControlLabel value="Accept" control={<Radio />} label="Accept" />
                                <FormControlLabel value="Deliver" control={<Radio />} label="Deliver" />
                                <FormControlLabel value="Cancel" control={<Radio />} label="Cancel" />
                            </RadioGroup>

                            {/* Save Changes Button */}
                            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mr: 3 }}>
                                Save Changes
                            </Button>

                            {/* Close Button */}
                            <Button variant="contained" onClick={handleClose}>
                                Close
                            </Button>
                        </Box>
                    </Fade>
                </Modal>
            )}
        </>
    );
};

export default Allorder;
