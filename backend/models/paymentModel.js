import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: [], required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  date: { type: Date, default: Date.now() },
  currency: { type: String, required: true },
  payment: { type: Boolean, default: false },
});

const paymentModel =
  mongoose.model.payments || mongoose.model("payments", paymentSchema);
export default paymentModel;
