import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  role: { type: String, default: "admin" } // نقش پیش‌فرض ادمین است
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
