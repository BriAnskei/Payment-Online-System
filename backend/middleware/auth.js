import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const { token } = req.headers;

  if (!token) return res.json({ succes: false, message: "Error" });

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: "Access Denied" });
  }
};
export default authMiddleware;
