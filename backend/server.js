import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import User from "./models/User.js";
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware Setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: [
    'https://rosegoldgalleryy.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}));

// Routes Setup
app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/products', productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
// MongoDB Connection
// // اتصال به MongoDB
mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("✅ Connected to MongoDB"))
     .catch((err) => {
       console.error("❌ MongoDB Connection Error:", err);
       process.exit(1); // Exit if cannot connect to database
     });

// Add error handler for MongoDB connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Test Server Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// File Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images stored in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Timestamp-based filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed!"), false);
    }
    cb(null, true);
  },
});

// **📌 Register a New User**
app.post("/api/register", async (req, res) => {
  try {
    console.log("Received registration request:", req.body);

    const { fname, lname, email, mobile, pass, img, city, street, age } = req.body;

    // Validate required fields
    if (!fname || !lname || !email || !mobile || !pass || !city || !street || !age) {
      console.log("Missing required fields:", { fname, lname, email, mobile, pass, city, street, age });
      return res.status(400).json({ 
        error: "All fields are required",
        missing: Object.entries({ fname, lname, email, mobile, pass, city, street, age })
          .filter(([_, value]) => !value)
          .map(([key]) => key)
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      console.log("User already exists:", { email, mobile });
      return res.status(400).json({ 
        error: existingUser.email === email ? "Email already exists" : "Mobile number already exists" 
      });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(pass, 10);

    // Create new user
    const newUser = new User({
      fname,
      lname,
      email,
      mobile,
      pass: hashedPass,
      img: img || '',
      city,
      street,
      age: Number(age),
      role: 'user'
    });

    // Validate the document before saving
    const validationError = newUser.validateSync();
    if (validationError) {
      console.log("Validation error:", validationError);
      return res.status(400).json({
        error: "Validation failed",
        details: validationError.errors
      });
    }

    await newUser.save();
    console.log("User registered successfully:", { email, mobile });
    
    res.status(201).json({ 
      success: true,
      message: "User registered successfully!" 
    });
  } catch (error) {
    console.error("Registration error:", error);
    // Send more detailed error information
    res.status(500).json({ 
      error: "Registration failed",
      details: error.message,
      code: error.code,
      name: error.name
    });
  }
});

// **📌 User Login**
app.post("/api/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    // اول کاربر رو پیدا میکنیم
    const user = await User.findOne({ email }).select('-__v');

    if (!user) return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // همه اطلاعات کاربر رو میفرستیم
    const userData = {
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      street: user.street,
      age: user.age,
      role: user.role,
      img: user.img
    };

    console.log("Sending user data:", userData); // برای دیباگ

    res.json({ 
      token, 
      user: userData
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// **📌 Authentication Middleware**
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(401).json({ error: "Token missing or malformed" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

// **📌 Admin-Only Access**
app.get("/api/admin", authMiddleware, (req, res) => {
  if (req.user.status !== "Main Admin") {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  res.json({ message: "Welcome to Admin Dashboard" });
});

// Get user profile
app.get("/api/login", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-pass');
    if (!user) {
      return res.status(404).json({ error: "کاربر یافت نشد" });
    }
    res.json(user);
  } catch (error) {
    console.error("خطا در دریافت پروفایل:", error);
    res.status(500).json({ error: "خطا در دریافت اطلاعات کاربر" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

export default app;








