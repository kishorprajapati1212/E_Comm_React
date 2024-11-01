import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { saveorderdeatil } from '../Store/Orderslice';
import { useDispatch } from 'react-redux';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';

const PaymentSuccess = () => {
  const Backend_url =  import.meta.env.VITE_REACT_BACKEND_URL 

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('paymentId');
  const [orderdata, setorderdata] = useState(null);
  const [invoicevalue, setinvoice] = useState(null);
  const [invoiceData, setinvoiceData] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = Theme(theme.palette.mode);

  // Fetch payment details once paymentId is available
  useEffect(() => {
    const paymentdetail = async () => {
      try {
        const response = await axios.get(`${Backend_url}/fetchpayment`, {
          params: { paymentId },
        });
        console.log(response.data);

        if (response.data && response.data.product) {
          setorderdata(response.data.product);
          setinvoice(response.data); // Set the invoice value here
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    if (paymentId) {
      paymentdetail();
    }
  }, [paymentId]);

  useEffect(() => {
    if (orderdata) {
      dispatch(saveorderdeatil({ orderdata, paymentId }));
    }
  }, [orderdata, paymentId, dispatch]);

  useEffect(() => {
    const addInvoice = async () => {
      try {
        if (invoicevalue) {
          const response = await axios.post(`${Backend_url}/addinvoice`, invoicevalue);
          const response2 = await axios.get(`${Backend_url}/getInvoice`, {
            params: { paymentId },
          });
          setinvoiceData(response2.data);
        }
      } catch (error) {
        console.error("Error adding or fetching invoices:", error);
      }
    };

    addInvoice();

  }, [invoicevalue, paymentId]); // Depend on invoicevalue and paymentId

  console.log("Invoice value" + invoiceData)

  return (
    <div style={{ padding: '40px', backgroundColor: `${colors.primary[500]}` }}>
      <h1 style={{ color: `${colors.greenAccent[500]}`, textAlign: "center", fontSize: '2em' }}>Payment Successful!</h1>
      {invoiceData && (
        <div style={{ border: '1px solid white', borderRadius: '8px', padding: '20px', backgroundColor: `${colors.primary[400]}`, maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: `${colors.primary[900]}`, textAlign: 'center', marginBottom: '20px' }}>Invoice Details</h2>
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: `${colors.grey[200]}`, borderRadius: '5px' }}>
            <h3 style={{ color: `${colors.primary[800]}` }}>Payment Summary:</h3>
            <p><strong>Payment ID:</strong> {invoiceData.paymentId}</p>
            <p><strong>Amount:</strong> ${invoiceData.products.amount}</p>
            <p><strong>Payment Status:</strong> {invoiceData.products.payment_status}</p>
            <p><strong>Payment Time:</strong> {new Date(invoiceData.products.payment_time).toLocaleString()}</p>
          </div>
          <h3 style={{ color: `${colors.primary[900]}` }}>Product Details:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {invoiceData.products.product.product.totalcartitems.map((product, index) => (
              <div key={index} style={{ border: '1px solid #c2c2c2', borderRadius: '8px', padding: '10px', backgroundColor: `${colors.primary[400]}` }}>
                <h4 style={{ color: `${colors.primary[800]}` }}>{product.product_name}</h4>
                <p><strong>Product ID:</strong> {product.productid}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Quantity:</strong> {product.qty}</p>
                <p><strong>Total:</strong> ${(product.price * product.qty)}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: `${colors.grey[200]}`, borderRadius: '5px' }}>
            <h3 style={{ color: `${colors.primary[800]}` }}>Customer Information:</h3>
            <p><strong>First Name:</strong> {invoiceData.products.product.formdata.fname}</p>
            <p><strong>Last Name:</strong> {invoiceData.products.product.formdata.lname}</p>
            <p><strong>Email:</strong> {invoiceData.products.product.formdata.email}</p>
            <p><strong>Mobile:</strong> {invoiceData.products.product.formdata.mobile_no}</p>
            <p><strong>Country:</strong> {invoiceData.products.product.formdata.country}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
