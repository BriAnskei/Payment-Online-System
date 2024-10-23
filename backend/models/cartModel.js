import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, requeried: true, ref: "users" },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const cartModel = mongoose.model.cart || mongoose.model("cart", cartSchema);
export default cartModel;
