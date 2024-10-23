import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  countOrders,
  orderPayments,
  paidPayments,
  placePayment,
  verifyPayment,
} from "../controller/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/placeorder", authMiddleware, placePayment);
paymentRoutes.post("/paid", authMiddleware, paidPayments);
paymentRoutes.post("/verify", verifyPayment);

// Admin routes list
paymentRoutes.post("/paidlist", orderPayments);
paymentRoutes.get("/totalpaid", countOrders);

export default paymentRoutes;
