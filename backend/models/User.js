import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
 id:{
  type: String
 },
  fname: { 
    type: String, 
    required: true 
  },
  lname: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  pass: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);