import express from "express";
import {
  addToCart,
  editFromCart,
  getCarts,
  removeToCart,
} from "../controller/cartController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Upload img first before auth and next()
cartRouter.post("/add", upload.single("image"), authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeToCart);
cartRouter.post("/products", authMiddleware, getCarts);
cartRouter.post("/update", authMiddleware, editFromCart);

export default cartRouter;
