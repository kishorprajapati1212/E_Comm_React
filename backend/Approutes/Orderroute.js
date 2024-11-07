const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ordermodel = require("../Models/Order");

router.post("/addorder", async (req, res) => {
  const orderData = req.body.orderdata;
  const paymentId = req.body.paymentId;

  try {
    if (!orderData.product || !orderData.formdata || !orderData.payment || !orderData.charges || !orderData.totalamount) {
      return res.status(200).json({ error: "Incomplete order data" });
    }

    if (!orderData.product.totalcartitems || orderData.product.totalcartitems.length === 0) {
      return res.status(400).json({ error: "No products in the order" });
    }

    const orders = [];

    const existingOrder = await ordermodel.findOne({
      paymentId: paymentId
    });

    if (existingOrder) {
      // console.log("--------------------------------------- order is areday")
      return res.status(200).json({ error: "Order already exists for this payment ID" });
    }

    for (const product of orderData.product.totalcartitems) {
      const orderItem = {
        orderid: new mongoose.Types.ObjectId(), // Remove 'new' keyword
        product_id: product.productid,
        product_name: product.product_name,
        img1: product.img1,
        qty: product.qty,
        singleprice: product.price,
        withoutcharges: product.withoutcharges,
        withcharges: product.withcharges,
      };

      const order = {
        paymentId: paymentId,
        charges: orderData.charges,
        userid: orderData.product.userid,
        fname: orderData.formdata.fname,
        lname: orderData.formdata.lname,
        email: orderData.formdata.email,
        mobile_no: orderData.formdata.mobile_no,
        country: orderData.formdata.country,
        state: orderData.formdata.state,
        city: orderData.formdata.city,
        street: orderData.formdata.street,
        pincode: orderData.formdata.pincode,
        payment_status: "compelete",
        order_status: "Pending",
        payment_type: orderData.payment.payment,
        time: Date.now(),
        orderItems: [orderItem],
      };
      // console.log(order)
      const savedOrder = await ordermodel.create(order);
      // console.log("Saved Order:" + savedOrder)
      orders.push(savedOrder); // Collect orders
    }

    // Send response after all orders are saved
    res.status(200).json({ message: "Place Order Is Done", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/getorder/:userid", async (req, res) => {

  const useridparams = req.params.userid;

  try {
    console.log(useridparams)
    const orderdata = await ordermodel.find({ userid: useridparams })
    console.log(orderdata)
    if (orderdata) {
      res.status(200).json({ message: "Order Successfully", orderdata })
    } else {
      res.status(500).json({ message: "Not Any Order Yet" })

    }

  } catch (error) {
    res.status(500).json({ message: "Internal Error" })
  }
})

router.get("/getAllorders", async (req, res) => {
  try {
    const allorder = await ordermodel.find();

    if (allorder.length > 0) {
      const ordersWithProducts = allorder.filter(order => order.orderItems && order.orderItems.length > 0);

      if (ordersWithProducts.length > 0) {
        res.status(200).json({ message: "All orders retrieved successfully", orders: ordersWithProducts });
      } else {
        res.status(404).json({ message: "No orders with products found" });
      }
    } else {
      res.status(500).json({ message: "No Order Found" })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Error" });
  }
})


router.post("/updateorder/:orderid", async (req, res) => {
  try {
    const orderidparam = req.params.orderid;
    const { order_status } = req.body;
    console.log(orderidparam)
    console.log(order_status)

    // Find and update the order in the database
    const updatedOrder = await ordermodel.findOneAndUpdate(
      { 'orderItems.0.orderid': orderidparam }, // Assuming orderid is inside the first item of orderItems array
      { $set: { order_status } },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getallemail", async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the start of the previous day
    const previousDayStart = new Date();
    previousDayStart.setDate(currentDate.getDate() - 1);
    previousDayStart.setHours(0, 0, 0, 0); // Start of previous day at 00:00:00

    // Filter orders between previous day start and now
    const recentOrders = await ordermodel.find({
      order_status: { $exists: true }, // Assuming you want all orders with an order_status
      time: { $gte: previousDayStart, $lt: currentDate }
    });

    res.json({ orders: recentOrders });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
})


module.exports = router;
