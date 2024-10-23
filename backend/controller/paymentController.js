import paymentModel from "../models/paymentModel.js";
import cartModel from "../models/cartModel.js";
import filesystem from "fs/promises";
import Stripe from "stripe";
import { console } from "inspector";

const stripe = new Stripe(process.env.STRIPE_SECRET_KET);

const dropImages = async (items) => {
  try {
    const deleteAll = items.map((item) => {
      const path = `uploads/${item.image}`;
      return filesystem.unlink(path);
    });
    await Promise.all(deleteAll);
  } catch (error) {
    console.error(error);
  }
};

const placePayment = async (req, res) => {
  console.log(req);
  try {
    const newPayment = new paymentModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      currency: req.body.currency,
    });
    const currency = req.body.currency;
    await newPayment.save();

    // Remove userCart and delete img file in server
    dropImages(req.body.items);

    await cartModel.deleteMany({ userId: req.body.userId });

    // Initialize total price amount before initializing
    const currencyPrice = (amount) => {
      return currency === "PHP" ? amount * 58 : amount;
    };

    const totalPrice = () => {
      var itemsPrice = req.body.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      return itemsPrice * 0.05; // price fee percentage
    };

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
        unit_amount: currencyPrice(totalPrice() * 100), // fixed delivery charge of  amount $2, converted into cents
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
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentId, success } = req.body;
  console.log(success);
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

const paidPayments = async (req, res) => {
  try {
    const products = await paymentModel.find({ userId: req.body.userId });
    res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const orderPayments = async (_, res) => {
  try {
    const payments = await paymentModel.find({});

    res.json({ success: true, data: payments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const countOrders = async (_, res) => {
  try {
    const totalPaid = await paymentModel.countDocuments();
    res.json({ success: true, count: totalPaid });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  placePayment,
  verifyPayment,
  paidPayments,
  orderPayments,
  countOrders,
};
