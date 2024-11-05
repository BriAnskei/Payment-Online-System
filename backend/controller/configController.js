import Config from "../models/schemaModel.js";

const updateRange = async (req, res) => {
  try {
    const updateConfig = await Config.findOneAndUpdate(
      {
        key: "priceIncreasePercentage",
      },
      { value: req.body.value }
    );
    res.json({ success: true, data: updateConfig });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getPriceRange = async (_, res) => {
  try {
    const data = await Config.findOne({
      key: "priceIncreasePercentage",
    });

    res.json({ success: true, range: data.value });
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: "Error" });
  }
};

export { updateRange, getPriceRange };
