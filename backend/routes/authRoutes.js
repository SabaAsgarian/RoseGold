import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const router = express.Router();

// **📌 ثبت‌نام کاربر (User)**
router.post("/register", async (req, res) => {
    try {
        const { fname, lname, email, mobile, pass, img, city, street, age } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email: req.body.email }, { mobile: req.body.mobile }]
          });
        if (existingUser) return res.status(400).json({ error: "User already exists!" });

        const hashedPass = await bcrypt.hash(pass, 12);
        const newUser = new User({ fname, lname, email, mobile, pass: hashedPass, img, city, street, age });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
});

// **📌 ورود کاربر (User)**
router.post("/login", async (req, res) => {
    try {
        const { email, mobile, pass } = req.body;
        const identifier = email || mobile; // Use email if provided, otherwise mobile
        
        const user = await User.findOne({
          $or: [{ email: identifier }, { mobile: identifier }]
        });
        
        if (!user) {
          return res.status(404).json({ error: "User not found!" });
        }
        
        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // // Proceed if the user is authenticated
        // res.status(200).json({ message: "Authentication successful!" });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
          token,
          user: {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            age: user.age,     // <-- Make sure these fields are here
            city: user.city,   // <-- Make sure these fields are here
            street: user.street, // <-- Make sure these fields are here
          },
        });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });
    
  // **📌 ثبت‌نام ادمین (Admin)**
router.post("/admin/register", async (req, res) => {
    try {
      const { fname, lname, email, pass } = req.body;
  
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) return res.status(400).json({ error: "Admin already exists!" });
  
      const hashedPass = await bcrypt.hash(pass, 8);
      const newAdmin = new Admin({ fname, lname, email, pass: hashedPass });
  
      await newAdmin.save();
      res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });
  // **📌 ورود ادمین (Admin)**
router.post("/admin/login", async (req, res) => {
    try {
      const { email, pass } = req.body;
      const admin = await Admin.findOne({ email });
  
      if (!admin) return res.status(404).json({ error: "Admin not found!" });
  
      const isMatch = await bcrypt.compare(pass, admin.pass);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      
      console.log("Generated Token:", token);
  
      res.json({ token, admin: { fname: admin.fname, lname: admin.lname, email: admin.email } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });
  // authRoutes.js
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch user by ID
    
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Return the full user details
    res.json({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      age: user.age,
      city: user.city,
      street: user.street,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});
// **📌 گرفتن تمامی کاربران**
router.get("/user", async (req, res) => {
  console.log("GET /user called");
  try {
      const users = await User.find();
      console.log("Users fetched:", users);
      res.json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
  }
});
// **📌 حذف کاربر**
// Delete user by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  User.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: 'User deleted successfully' }))
    .catch((error) => res.status(500).json({ error: 'Failed to delete user', error }));
});

// POST Request to create new user
// POST Request to create new user
router.post('/user', async (req, res) => {
  try {
    const userData = req.body;
    // Validate and process user data here
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;