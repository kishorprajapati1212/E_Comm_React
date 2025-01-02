import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';

const InvoicePDF = ({ invoiceData }) => {
  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const invoiceRef = useRef();

  // Function to download the PDF with custom background and font colors
  const downloadPDF = async () => {
    const invoiceElement = invoiceRef.current;

    // Render the invoice as a canvas (used for capturing the visual data)
    const canvas = await html2canvas(invoiceElement, {
      backgroundColor: 'white', // White background for the PDF
      useCORS: true,             // Allows cross-origin images if needed
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Add the image of the canvas to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF with a custom name
    pdf.save('invoice.pdf');
  };

  return (
    <div>
      {/* Invoice content for viewing */}
      <div ref={invoiceRef} style={{ padding: '20px', backgroundColor: colors.primary[8000] }}>
        <div style={{ border: '1px solid white', borderRadius: '8px', padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: colors.primary[400] }}>
          <h2 style={{ color: colors.primary[900], textAlign: 'center', marginBottom: '20px' }}>Invoice Details</h2>

          {/* Payment Summary */}
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: colors.primary[8000], borderRadius: '5px' }}>
            <h3 style={{ color: colors.primary[200] }}>Payment Summary:</h3>
            <p><strong>Payment ID:</strong> {invoiceData?.paymentId || 'N/A'}</p>
            <p><strong>Payment Status:</strong> {invoiceData?.products?.payment_status || 'N/A'}</p>
            <p><strong>Payment Time:</strong> {invoiceData?.products?.payment_time ? new Date(invoiceData.products.payment_time).toLocaleString() : 'N/A'}</p>
          </div>

          {/* Product Details */}
          <h3 style={{ color: colors.primary[200] }}>Product Details:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {invoiceData?.products?.product?.product?.totalcartitems?.map((product, index) => (
              <div key={index} style={{ border: '1px solid #c2c2c2', borderRadius: '8px', padding: '10px', backgroundColor: colors.primary[400] }}>
                <h4>{product.product_name}</h4>
                <p><strong>Product ID:</strong> {product.productid}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Quantity:</strong> {product.qty}</p>
                <p><strong>Total:</strong> ${(product.price * product.qty).toFixed(2)}</p>
              </div>
            )) || <p>No products available</p>}
          </div>

          {/* Customer Information */}
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: colors.primary[8000], borderRadius: '5px' }}>
            <h3 style={{ color: colors.primary[200] }}>Customer Information:</h3>
            <p><strong>First Name:</strong> {invoiceData?.products?.product?.formdata?.fname || 'N/A'}</p>
            <p><strong>Last Name:</strong> {invoiceData?.products?.product?.formdata?.lname || 'N/A'}</p>
            <p><strong>Email:</strong> {invoiceData?.products?.product?.formdata?.email || 'N/A'}</p>
            <p><strong>Mobile:</strong> {invoiceData?.products?.product?.formdata?.mobile_no || 'N/A'}</p>
            <p><strong>Country:</strong> {invoiceData?.products?.product?.formdata?.country || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Button to trigger PDF download */}
      <button
        onClick={downloadPDF}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: colors.greenAccent[500],
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Download Invoice as PDF
      </button>
    </div>
  );
};

export default InvoicePDF;
