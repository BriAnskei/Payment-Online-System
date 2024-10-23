import express from "express";
import { updateRange } from "../controller/configController.js";

const configRoutes = express.Router();

configRoutes.post("/updaterange", updateRange);

export default configRoutes;
