const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userid: String,
    payment_status:String,
    payment_time: Date,
    amount: String,
    product: mongoose.Schema.Types.Mixed,
});

const paymentmodel = new mongoose.model("payment", paymentSchema);
module.exports = paymentmodel;