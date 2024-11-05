const express = require("express");
const router = express.Router();
const stripe = require('stripe')('sk_test_51P8h7jSDGOWUAXLshl5LG3IC8uWqOdRIVk04VGpywpmilckZTK6nhYVEVtAilUyYTlxgl5rnVibcnW2z2Z78tgEs00Rc5MKDOH');
const Payment = require("../Models/Payment");

router.post("/checkout", async (req, res) => {
    try {
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
                currency: 'usd', // Set currency to INR
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
            success_url: `https://9000-idx-ecomcustomerp1-1730199568780.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev/payment-success?paymentId=${savepayment._id}`,  // Successful payment redirect URL
            cancel_url: 'https://9000-idx-ecomcustomerp1-1730199568780.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev/placeorder', // Canceled payment redirect URL
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

    }

})

module.exports = router;
