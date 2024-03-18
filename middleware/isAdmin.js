import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAdmin = async (req, res, next) => {
  let token;

  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    token = req.cookies["token"];
  }
  if (!token) {
    console.log("auth token error");
    return res.status(401).json(AUTH_ERROR);
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "verify timeout" });
    }
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      console.log("auth function error");
      return res.status(401).json(AUTH_ERROR);
    }
    if (!user.isAdmin) {
      console.log("no admin is comming");
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id;
    req.token = token;
    req.cart = user.cart;
    next();
  });
};
