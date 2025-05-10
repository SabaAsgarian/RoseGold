import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        id: String,
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        img: String
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending","shipped","delivered", "processing", "completed", "cancelled"],
      default: "pending"
    },
    shippingAddress: {
      city: String,
      street: String
    },
    trackingCode: {
      type: String,
      default: () => Math.random().toString(36).substring(2, 15).toUpperCase()
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

