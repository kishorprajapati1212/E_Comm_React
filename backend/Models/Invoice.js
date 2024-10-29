const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    products: mongoose.Schema.Types.Mixed,
    paymentId:String,
})

const invoicemodel = new mongoose.model("Invoice", InvoiceSchema);
module.exports = invoicemodel;