const express = require("express");
const router = express.Router();
const userloginModel = require("../Models/userlogin");

router.post("/usersignin", async (req, res) => {
    try {
        const signin = req.body;

        const checkuser = await userloginModel.findOne({ email: signin.email });
        if (checkuser) {
            return res.status(600).json({ error: "Email is Already Exists" });
        } else {
            signin.access = "user";
            signin.createAt = new Date()

            await userloginModel
                .create(signin)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    res.status(500).json({ error: err.message });
                });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/logincheck", async (req, res) => {
    try {
        const logincheck = req.body;
        const usercheck = await userloginModel.findOne({ email: logincheck.email, password: logincheck.password });

        if (usercheck) {
            return res.status(200).json({ message: "Login Success", user: { email: usercheck.email, username: usercheck.username, _id: usercheck._id } });
        } else {
            return res.status(500).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// In your backend route file
router.get("/getnewuser", async (req, res) => {
    try {
        const users = await userloginModel.find();

        const currentDate = new Date();
        const startOfCurrentDay = new Date(currentDate);
        startOfCurrentDay.setHours(0, 0, 0, 0);

        const endOfCurrentDay = new Date(currentDate);
        endOfCurrentDay.setHours(23, 59, 59, 999);

        const startOfPrevDay = new Date(startOfCurrentDay);
        startOfPrevDay.setDate(startOfPrevDay.getDate() - 1);

        // Filter users for current and previous day
        const currentDayUsers = users.filter(user => {
            const userDate = user.createdAt ? new Date(user.createdAt) : null;
            return userDate && userDate >= startOfCurrentDay && userDate <= endOfCurrentDay;
        });

        const prevDayUsers = users.filter(user => {
            const userDate = user.createdAt ? new Date(user.createdAt) : null;
            return userDate && userDate >= startOfPrevDay && userDate < startOfCurrentDay;
        });

        const currentDayCount = currentDayUsers.length;
        const prevDayCount = prevDayUsers.length;

        // Calculate increase percentage
        const increasePercentage = prevDayCount
            ? ((currentDayCount - prevDayCount) / prevDayCount) * 100
            : 100;

        // Send the results back to the frontend
        res.json({
            currentDayCount,
            prevDayCount,
            increasePercentage,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




module.exports = router;
