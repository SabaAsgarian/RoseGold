import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    img: { type: String, default: '' },  // مسیر عکس ذخیره می‌شود
    title: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String, default: 0 },
    description: { type: String, default: '' },
    category: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;  // ❗ این خط رو تغییر دادم
