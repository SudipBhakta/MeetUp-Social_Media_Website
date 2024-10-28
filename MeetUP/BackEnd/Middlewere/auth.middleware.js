import jwt, { decode } from "jsonwebtoken";

export const isAuthanticat = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticate",
        sucess: false,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401)({
        message: "Invalid token",
        sucess: false,
      });
    }
    req.id=decode.userId
    next()
  } catch (error) {
    console.log("Authantication Error", error);
  }
};
