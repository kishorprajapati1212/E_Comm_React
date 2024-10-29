const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")
const loginroute = require("./Approutes/loginroute")
const productroute = require("./Approutes/productroute")
const catproductroute = require("./Approutes/CatProductroute")
const Userloginroute = require("./Approutes/Userloginroute");
const Cartroute = require("./Approutes/Cartroute");
const Orderroute = require("./Approutes/Orderroute");
const Paymentroute = require("./Approutes/Payment");

const app = express();
// app.use(express.json())
app.use(cors())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect("mongodb://localhost:27017/clothes")

app.use(loginroute)
app.use(productroute)
app.use(catproductroute)
app.use(Userloginroute);
app.use(Cartroute)
app.use(Orderroute)
app.use(Paymentroute)

app.listen(1414, () =>{
    console.log("Backend is in Action fro the Admin")
})
