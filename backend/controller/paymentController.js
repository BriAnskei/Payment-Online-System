import paymentModel from "../models/paymentModel.js";
import cartModel from "../models/cartModel.js";
import filesystem from "fs/promises";
import Stripe from "stripe";

import Config from "../models/schemaModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KET);

const dropImages = async (items) => {
  try {
    const deleteAll = items.map((item) => {
      const path = `uploads/${item.image}`;

      return filesystem.unlink(path);
    });
    await Promise.all(deleteAll);
  } catch (error) {
    console.log(error);
  }
};

const placePayment = async (req, res) => {
  try {
    const newPayment = new paymentModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      currency: req.body.currency,
    });

    console.log(req.body.amount);
    const currency = req.body.currency;
    await newPayment.save();

    // Remove userCart and delete img file in server
    dropImages(req.body.items);

    await cartModel.deleteMany({ userId: req.body.userId }); // Remove all products in carts

    // Initialize total price amount before initializing
    const currencyPrice = (amount) => {
      return Math.round(currency === "PHP" ? amount * 58 : amount);
    };

    // Returns the total  payment based of the range
    const totalPrice = async () => {
      var itemsPrice = req.body.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const range = await Config.findOne({ key: "priceIncreasePercentage" });
      const priceRange = range.value / 100;

      return itemsPrice * priceRange; // price fee percentage
    };

    const totalPriceRange = await totalPrice();

    // Accresing stripe api
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: currencyPrice(item.price * 100), // Convets to smallest currrency(eg.  USD smallest currency is cents), Stripe only accepts amounts in the smallest currency unit
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: currencyPrice(totalPriceRange * 100), // fixed delivery charge of  amount $2, converted into cents
      },
      quantity: 1, // delivery changes applied only once
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",

      success_url: `${process.env.FRONTENT_URL}/verify?success=true&paymentId=${newPayment._id}`,
      cancel_url: `${process.env.FRONTENT_URL}/verify?success=false&paymentId=${newPayment._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentId, success } = req.body;

  if (success === "true") {
    await paymentModel.findByIdAndUpdate(paymentId, { payment: true });
    res.json({ success: true, message: "Paid" });
  } else {
    await paymentModel.findByIdAndDelete(paymentId);
    res.json({ success: false, message: "Not Paid" });
  }
  try {
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const paymentsData = async (_, res) => {
  try {
    // Retrieve all payment data
    const paymentsData = await paymentModel.find({});

    // Send the data as a response
    res.json({
      success: true,
      data: paymentsData,
    });
  } catch (error) {
    console.error("Error retrieving payment data:", error);
    res.json({ success: false, message: "Error retrieving payment data" });
  }
};

const paidPayments = async (req, res) => {
  try {
    const products = await paymentModel.find({
      userId: req.body.userId,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placePayment, verifyPayment, paymentsData, paidPayments };
