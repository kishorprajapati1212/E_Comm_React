import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { saveorderdeatil } from '../Store/Orderslice';
import { useDispatch } from 'react-redux';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';
import InvoicePDF from './InvoicePDF';

const PaymentSuccess = () => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('paymentId');
  const [orderdata, setorderdata] = useState(null);
  const [invoicevalue, setinvoice] = useState(null);
  const [invoiceData, setinvoiceData] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = Theme(theme.palette.mode);

  useEffect(() => {
    const paymentdetail = async () => {
      try {
        const response = await axios.get(`${Backend_url}/fetchpayment`, {
          params: { paymentId },
        });
        if (response.data && response.data.product) {
          setorderdata(response.data.product);
          setinvoice(response.data);
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
           // console.log("Adding invoice with value:", invoicevalue);
          const response = await axios.post(`${Backend_url}/addinvoice`, invoicevalue);
          // console.log("Invoice added:", response.data);
          const response2 = await axios.get(`${Backend_url}/getInvoice`, {
            params: { paymentId },
          });
          setinvoiceData(response2.data);
        }
      } catch (error) {
        console.error("Error adding or fetching invoices:", error);
      }
    };

    if (invoicevalue) {
      addInvoice();
    }
  }, [invoicevalue, paymentId]);

  return (
    <div style={{ padding: '40px', backgroundColor: `${colors.primary[8000]}`, borderTop:"1px solid grey" }}>
      <h1 style={{ color: `${colors.greenAccent[500]}`, textAlign: "center", fontSize: '2em' }}>Payment Successful!</h1>
      {invoiceData ? (
        <InvoicePDF invoiceData={invoiceData} />
      ) : (
        <p style={{ color: colors.primary[800], textAlign: "center", fontSize: '1.2em' }}>Invoice data not found.</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
