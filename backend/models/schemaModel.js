import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

const Config = mongoose.model.config || mongoose.model("config", configSchema);

export default Config;
