import cartModel from "../models/cartModel.js";
import filesystem from "fs";

const addToCart = async (req, res) => {
  let image_file = `${req.file.filename}`;

  const cart = new cartModel({
    _id: req.body._id,
    userId: req.body.userId,
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    image: image_file,
  });

  try {
    await cart.save();
    res.json({ success: true, message: "Product Added", image: image_file });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeToCart = async (req, res) => {
  try {
    const product = await cartModel.findById(req.body._id);

    filesystem.unlink(`uploads/${product.image}`, () => {});

    await cartModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "Product remove" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const editFromCart = async (req, res) => {
  try {
    const editedCart = new cartModel({
      name: req.body.name,
      category: req.body.category,
      quantity: req.body.quantity,
      price: req.body.price,
    });

    await cartModel.findByIdAndUpdate(req.body._id, editedCart);
    res.json({ success: true, message: "Product Updatted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getCarts = async (req, res) => {
  try {
    const userData = await cartModel.find({ userId: req.body.userId });

    res.json({ success: true, data: userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeToCart, getCarts, editFromCart };
