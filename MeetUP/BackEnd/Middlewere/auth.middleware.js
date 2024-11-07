import jwt from "jsonwebtoken";

export const isAuthenticat = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", ""); // Check both cookie and Authorization header

  try {
    // Check if the token exists
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // If token is invalid, return error
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Log the decoded token to check if userId is available
    console.log("Decoded token:", decoded);

    // Add the user id to the request object for further use
    req.id = decoded.userId;

    // Move to the next middleware or route handler
    next();

  } catch (error) {
    console.log("Authentication Error:", error);

    // Handle any errors that occurred during the verification process
    return res.status(500).json({
      message: "An error occurred during authentication",
      success: false,
    });
  }
};
