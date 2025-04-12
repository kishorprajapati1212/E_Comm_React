const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require("../Models/Payment");

router.post("/checkout", async (req, res) => {
    try {
        const url = "https://user-ecom.netlify.app";
        const url2 = "https://9000-idx-ecomcustomerp1-1730199568780.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev";
        const { amount, userid, orderproduct, orderdetails } = req.body;

        const savepayment = await Payment.create({
            userid: userid,
            product: orderdetails,
            payment_status: "pending",
            payment_time: new Date(),
            amount: amount,
        })

        // Mapping over the orderproduct array to create Stripe line items
        const productItems = orderproduct.map((item) => ({
            price_data: {
                currency: 'inr', // Set currency to INR
                product_data: {
                    name: item.product_name, // Name of the product
                    description: `Product ID: ${item.productid}`, // Optional: Add more details like product ID
                },
                unit_amount: item.withoutcharges * 100, // Stripe expects the amount in paise (INR smallest unit)
            },
            quantity: item.qty, // Quantity of the product
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: productItems, // Add the mapped product items to line_items
            mode: 'payment',
            success_url: `${url}/payment-success?paymentId=${savepayment._id}`,  // Successful payment redirect URL
            cancel_url: `${url}/placeorder`, // Canceled payment redirect URL
            billing_address_collection: 'required', // Collect billing address
            shipping_address_collection: { allowed_countries: ['IN'] }, // Restrict shipping to India
            metadata: {
                customerName: "Jhon Dev", // Add customer's name
                customerAddress: "1234", // Add customer's address
            },
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/fetchpayment", async (req, res) => {
    try {
        paymentId = req.query.paymentId;
        // console.log(paymentId)

        const getpaymentdetail = await Payment.findById({ _id: paymentId });
        if (!getpaymentdetail) {
            return res.status(404).json({ error: "Payment not found" });
        }

        getpaymentdetail.payment_status = "compelete";

        await getpaymentdetail.save();

        // Return the payment details as a JSON response
        return res.json(getpaymentdetail);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

})

router.get("/getallpayment", async(req,res) =>{
    try {
        const getallpayment = await Payment.find();
        return res.json(getallpayment);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
