import express from "express";
import { getPriceRange, updateRange } from "../controller/configController.js";

const configRoutes = express.Router();

configRoutes.post("/updaterange", updateRange);
configRoutes.post("/pricerange", getPriceRange);

export default configRoutes;
