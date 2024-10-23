import Config from "../models/schemaModel.js";

const updateRange = async (req, res) => {
  try {
    const updateConfig = await Config.findOneAndUpdate(
      {
        key: "priceIncreasePercentage",
      },
      { value: req.body.percentage }
    );
    res.json({ success: true, data: updateConfig });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { updateRange };
