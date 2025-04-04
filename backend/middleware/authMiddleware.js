import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication failed!" });
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { 
            userId: decodedToken.userId,
            role: decodedToken.role  // ✅ اضافه کردن نقش کاربر
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
};

// 📌 محدود کردن فقط برای ادمین‌ها
export const adminMiddleware = (req, res, next) => {
    if (req.userData.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required!" });
    }
    next();
};



// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ message: "Authentication failed!" });
//         }
        
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         req.userData = { userId: decodedToken.userId };
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Authentication failed!" });
//     }
// };

// // 📌 محدود کردن فقط برای ادمین‌ها
// export const adminMiddleware = (req, res, next) => {
//     if (req.userData.role !== 'admin') {
//         return res.status(403).json({ message: "Admin access required!" });
//     }
//     next();
// };

// // 📌 محدود کردن فقط برای کارب
// // ر
// export const moderatorMiddleware = (req, res, next) => {
//     if (req.user.role !== "moderator") {
//         return res.status(403).json({ error: "Access denied" });
//         }
//         next();
//         };
//         // 📌 محدود کردن فقط برای کارب
//         // 
//         // ر
//         export const userMiddleware = (req, res, next) => {     
//             if (req.user.role !== "user") {
//                 return res.status(403).json({ error: "Access denied" });
//                 }
//                 next();
//                 };

export default authMiddleware;
