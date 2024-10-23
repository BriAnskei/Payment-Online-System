import express from "express";
import { countUser, loginUSer, regUSer } from "../controller/userController.js";

const userRoutes = express.Router();

userRoutes.post("/registration", regUSer);
userRoutes.post("/login", loginUSer);

userRoutes.get("/totalusers", countUser);
export default userRoutes;
