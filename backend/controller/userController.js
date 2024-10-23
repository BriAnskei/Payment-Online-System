import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createTokin = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUSer = async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createTokin(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

const regUSer = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const exist = await userModel.findOne({ email });

    if (exist) {
      return res.json({ success: false, message: "User already exist" });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email.",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Saved user in the Database
    const user = await newUser.save();

    const token = createTokin(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const countUser = async (_, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.json({ success: true, count: totalUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUSer, regUSer, countUser };
