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
const invoiceroute = require("./Approutes/Invoiceroute")
const forgotpass = require("./Approutes/Forgotpass")

const app = express(); 
// app.use(express.json())
app.use(cors())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb+srv://one1010piece1111:LSkd8pbeNd7rY1n9@cluster1.wgfrk.mongodb.net/clothes?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);  // Log just the error message
});

// mongoose.connect("mongodb://localhost:27017/clothes", {
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

app.listen(1414, () =>{
    console.log("Backend is in Action fro the Admin")
})
