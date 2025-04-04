const express = require("express");
const router = express.Router();
const User = require("../models/User"); // مدل یوزر

// 🟢 لاگین ادمین/کارمند
router.post("/login", async (req, res) => {
    const { email, pass } = req.body;

    try {
        // بررسی کاربر در دیتابیس
        const user = await User.findOne({ email, pass });
        if (!user) {
            return res.status(401).json({ message: "❌ Wrong email or password" });
        }

        // ارسال اطلاعات ادمین
        res.json({
            message: "✅ Login successful",
            user: {
                id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                status: user.status, // "Admin" یا "User"
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "❌ Server error" });
    }
});
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "❌ احراز هویت ناموفق!" });
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId); // دریافت اطلاعات کاربر از دیتابیس
        
        if (!user) {
            return res.status(401).json({ message: "❌ کاربر یافت نشد!" });
        }

        req.user = { id: user._id, role: user.role }; // ذخیره id و نقش کاربر
        next();
    } catch (error) {
        return res.status(401).json({ message: "❌ احراز هویت ناموفق!" });
    }
};
module.exports = router;
