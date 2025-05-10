import express from "express";
import Order from "../models/Order.js";
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// **📌 دریافت همه سفارشات (فقط ادمین‌ها)**
router.get("/all", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "❌ دسترسی غیرمجاز" });
  }

  try {
    // Fetch orders and populate userId fields along with shippingAddress
    const orders = await Order.find()
      .populate("userId", "fname lname email street city") // Include user info
      .exec(); // Ensure the query executes correctly

    console.log("Orders fetched: ", orders); // Debugging output
    res.json(orders); // Send the data as response
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      error: "❌ دریافت سفارشات ادمین ناموفق بود.",
      details: error.message
    });
  }
});

// **📌 دریافت یک سفارش خاص**
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "fname lname email street city");
    if (!order) {
      return res.status(404).json({ error: "سفارش یافت نشد" });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: "❌ خطا در دریافت اطلاعات سفارش" });
  }
});

// **📌 ثبت سفارش جدید**
// **📌 ثبت سفارش جدید**
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body; // Include shippingAddress in the request body
    const userId = req.user.id;

    // Validate input data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'سبد خرید نامعتبر است' });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: 'مبلغ کل نامعتبر است' });
    }
    if (!shippingAddress || !shippingAddress.city || !shippingAddress.street) {
      return res.status(400).json({ error: 'آدرس حمل و نقل نامعتبر است' });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      items: items.map(item => ({
        id: item.productId,
        name: item.name, // Ensure name is passed correctly
        quantity: item.quantity,
        price: item.price,
        img: item.img
      })),
      totalAmount,
      shippingAddress, // Save the shipping address
      status: 'pending',
      trackingCode: Math.random().toString(36).substring(2, 15).toUpperCase()
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      orderId: newOrder._id,
      trackingCode: newOrder.trackingCode
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      error: 'خطا در ثبت سفارش',
      details: error.message
    });
  }
});

    



// **📌 دریافت سفارشات کاربر**
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: "❌ دریافت سفارشات ناموفق بود." });
  }
});

// **📌 بروزرسانی وضعیت سفارش (فقط برای ادمین)**
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "❌ دسترسی غیرمجاز" });

  try {
    const updateData = {};
    
    // Add status if provided
    if (req.body.status) {
      updateData.status = req.body.status;
    }
    
    // Add shipping address if provided
    if (req.body.shippingAddress) {
      // Validate shipping address
      if (!req.body.shippingAddress.city || !req.body.shippingAddress.street) {
        return res.status(400).json({ error: "آدرس حمل و نقل نامعتبر است" });
      }
      
      updateData.shippingAddress = {
        city: req.body.shippingAddress.city.trim(),
        street: req.body.shippingAddress.street.trim()
      };
    }

    // Validate if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "هیچ داده‌ای برای بروزرسانی ارسال نشده است" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, // Use $set operator to ensure proper update
      { new: true, runValidators: true } // Enable validation
    ).populate("userId", "fname lname email street city");

    if (!updatedOrder) {
      return res.status(404).json({ error: "سفارش یافت نشد" });
    }

    res.json({ 
      success: true,
      message: "✅ سفارش بروزرسانی شد", 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: "❌ خطا در بروزرسانی سفارش",
      details: error.message 
    });
  }
});

// **📌 به‌روزرسانی آدرس در تمام سفارش‌های کاربر**
router.put("/update-address/all", authMiddleware, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user.id;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.city || !shippingAddress.street) {
      return res.status(400).json({ error: "آدرس حمل و نقل نامعتبر است" });
    }

    // Update all orders for the user
    const result = await Order.updateMany(
      { userId },
      { 
        $set: { 
          shippingAddress: {
            city: shippingAddress.city.trim(),
            street: shippingAddress.street.trim()
          }
        }
      }
    );

    res.json({ 
      success: true,
      message: "✅ آدرس در تمام سفارش‌ها به‌روزرسانی شد",
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating shipping addresses:', error);
    res.status(500).json({ 
      error: "❌ خطا در به‌روزرسانی آدرس‌ها",
      details: error.message 
    });
  }
});

// دریافت سفارش‌های کاربر
// router.get('/user', authMiddleware, async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user.id })
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ error: 'خطا در دریافت سفارش‌ها' });
//   }
// });

// **📌 حذف سفارش (فقط برای ادمین)**
router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "❌ دسترسی غیرمجاز" });

  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ سفارش با موفقیت حذف شد" });
  } catch (error) {
    res.status(500).json({ error: "❌ حذف سفارش ناموفق بود." });
  }
});

export default router;
