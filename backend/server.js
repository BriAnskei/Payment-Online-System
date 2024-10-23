import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

import "dotenv/config";
import cartRouter from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import configRoutes from "./routes/configRoutes.js";

const app = express();
const port = 3000;

app.use(express.json()); // Parse the recieved send data.
app.use(cors());

connectDB();
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/payments", paymentRoutes);

app.use("/api/config", configRoutes);

app.use("/images", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

app.get("/", (_, res) => {
  res.send("Hello World!");
});
