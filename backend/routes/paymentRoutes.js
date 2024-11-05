import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  paidPayments,
  paymentsData,
  placePayment,
  verifyPayment,
} from "../controller/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/placeorder", authMiddleware, placePayment);
paymentRoutes.post("/paid", authMiddleware, paidPayments);
paymentRoutes.post("/verify", verifyPayment);

// Admin routes list
paymentRoutes.post("/getdata", paymentsData);

export default paymentRoutes;
