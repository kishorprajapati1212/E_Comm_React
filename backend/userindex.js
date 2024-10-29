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
const Invoiceroute = require("./Approutes/Invoiceroute");

const app = express();
// app.use(express.json())
const corsOptions = {
    origin: 'https://5173-idx-ecomcustomerp1-1730199568780.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev', // or your Project IDX frontend URL
    credentials: true
  };
  app.use(cors(corsOptions));
  
// app.use(cors())

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
app.use(Invoiceroute)


app.listen(1415, () =>{
    console.log("Backend is in Action for the user")
})
