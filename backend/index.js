const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const loginroute = require("./Approutes/loginroute")
const productroute = require("./Approutes/productroute")
const catproductroute = require("./Approutes/CatProductroute")
const Userloginroute = require("./Approutes/Userloginroute");
const Cartroute = require("./Approutes/Cartroute");
const Orderroute = require("./Approutes/Orderroute");
const Paymentroute = require("./Approutes/Payment");
const invoiceroute = require("./Approutes/Invoiceroute")
const forgotpass = require("./Approutes/Forgotpass")

const app = express(); 
// app.use(express.json())
app.use(cors())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);  // Log just the error message
});

// mongoose.connect(process.env.DB_URL2, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // Adjust as needed
// })
// .then(() => {
//   console.log("Test connection to MongoDB successful");
//   mongoose.connection.close(); // Close the connection after the test
// })
// .catch((err) => {
//   console.error("Test connection to MongoDB failed:", err.message);
// });


app.use(loginroute)
app.use(productroute)
app.use(catproductroute)
app.use(Userloginroute);
app.use(Cartroute)
app.use(Orderroute)
app.use(Paymentroute)
app.use(invoiceroute)
app.use(forgotpass)


const PORT = process.env.PORT || 1414;
app.listen(PORT, () =>{
    console.log("Backend is in Action fro the Admin at port " + PORT);
})
