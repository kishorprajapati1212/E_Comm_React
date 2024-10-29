const express = require("express");
const router = express.Router();
const Invoicemodel = require("../Models/Invoice");

router.post("/addinvoice", async (req, res) => {
    try {
        const invoicevalue = req.body;
        const Checkinvoice = await Invoicemodel.findOne({ paymentId: invoicevalue._id });
        // console.log(Checkinvoice)

        if (!Checkinvoice) {
            return res.json("Duplicate")
        }

        const invicecreat = await Invoicemodel.create({products:invoicevalue, paymentId:invoicevalue._id});

        if (invicecreat) {
            return res.status[200].json("Successfully added Invoice");
        }

    } catch (error) {
        return res.json("Internal Error")
    }
});

router.get("/getallinvoice", async(req,res) =>{
    try {
        const allinvoice = await Invoicemodel.find();
        console.log(allinvoice)
        if(allinvoice){
            res.json(allinvoice);
        }
        return res.json("Npt found At All");
        
    } catch (error) {
        return res.json("Internal Error")
    }
})


router.get("/getInvoice", async(req,res) =>{
    try {
        paymentId =  req.query.paymentId
        // console.log(paymentId);

        const oneInvoice = await Invoicemodel.findOne({paymentId: paymentId});
        
        // console.log(oneInvoice)
        if(oneInvoice){
            return res.json(oneInvoice);
        }
        return res.json("Npt found At All");
        
    } catch (error) {
        return res.json("Internal Error")
    }
})

module.exports = router;