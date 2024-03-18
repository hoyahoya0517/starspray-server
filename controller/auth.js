import * as userRepository from "../data/auth.js";
import jwt from "jsonwebtoken";
import {} from "express-async-errors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendEmail } from "./mail.js";
import { getProductById } from "../data/product.js";
import { sendEmail2 } from "./mail2.js";
dotenv.config();

export async function signup(req, res) {
  const { name, phone, email, password } = req.body;
  const found = await userRepository.findByEmail(email);
  if (found) {
    return res
      .status(409)
      .json({ message: `${email}는 이미 가입된 이메일입니다` });
  }
  const saltRound = Number(process.env.SALT_ROUND);
  const hashed = await bcrypt.hash(password, saltRound);
  const userId = await userRepository.createUser({
    name,
    phone,
    email,
    signupDate: Date.now().toString(),
    password: hashed,
    isAdmin: false,
    cart: [],
  });
  const token = createJwtToken(userId);
  setToken(res, token);
  res.status(201).json({ token, name, isAdmin: false, cart: [] });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 잘못되었습니다" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 잘못되었습니다" });
  }
  const token = createJwtToken(user.id);
  setToken(res, token);
  res
    .status(200)
    .json({ token, name: user.name, isAdmin: user.isAdmin, cart: user.cart });
}

export async function logout(req, res) {
  res.cookie("token", "");
  res.status(200).json({ message: "Logout Success" });
}

export async function deleteUser(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await userRepository.deleteUser(user.id);
  res.sendStatus(204);
}

/*----------------------------------*/

export async function getUserInfo(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
}

export async function updateProfile(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const newUser = req.body;
  if (newUser.zipcode && !newUser.address2) {
    return res.status(401).json({ message: "상세주소를 입력하세요" });
  }
  if (newUser.oldPassword && newUser.newPassword) {
    const isValidPassword = await bcrypt.compare(
      newUser.oldPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "비밀번호가 잘못되었습니다" });
    }
    const saltRound = Number(process.env.SALT_ROUND);
    const hashed = await bcrypt.hash(newUser.newPassword, saltRound);
    await userRepository.changePassword(user.id, hashed);
  }
  await userRepository.updateProfile(
    user.id,
    newUser.name,
    newUser.phone,
    newUser.zipcode,
    newUser.address1,
    newUser.address2
  );
  res.sendStatus(200);
}

export async function resetPassword(req, res) {
  const { email } = req.body;
  const found = await userRepository.findByEmail(email);
  if (!found) {
    return res
      .status(409)
      .json({ message: `${email}는 가입되지 않은 이메일입니다` });
  }
  const token = createJwtTokenInResetPassword(email);
  try {
    await sendEmail(email, token);
  } catch (error) {
    return res.status(409).json({ message: "잠시 후에 다시 시도해 주세요" });
  }
  res.sendStatus(200);
}

export async function settingPassword(req, res) {
  const { password } = req.body;
  const { token } = req.params;
  if (!token)
    return res.status(401).json({
      message: "잘못된 주소로 접속했습니다",
    });
  let user;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "비밀번호 변경은 메일을 받은 후 10분 안에 가능합니다",
      });
    }
    user = await userRepository.findByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        message: "사용자를 찾을 수 없습니다",
      });
    }
  });
  const saltRound = Number(process.env.SALT_ROUND);
  const hashed = await bcrypt.hash(password, saltRound);
  await userRepository.changePassword(user.id, hashed);
  res.sendStatus(200);
}
export async function moon(req, res) {
  const { name, email, paymentId, moon } = req.body;
  try {
    await sendEmail2(name, email, paymentId, moon);
  } catch (error) {
    return res.status(409).json({ message: "잠시 후에 다시 시도해 주세요" });
  }
  res.sendStatus(200);
}

/*----------------------------------*/

export async function addCart(req, res) {
  const { productId } = req.body;
  const cart = req.cart;
  const found = await cart.find((product) => {
    if (product.id === productId) return product;
  });
  if (found) {
    return res
      .status(400)
      .json({ message: "장바구니에 동일한 상품이 있습니다" });
  }
  const databaseProduct = await getProductById(productId);
  if (Number(databaseProduct.qty) <= 0)
    return res.status(400).json({ message: "현재 품절된 상품입니다" });
  const newCart = [
    ...cart,
    {
      id: productId,
      name: databaseProduct.name,
      price: databaseProduct.price,
      qty: 1,
      date: Date.now().toString(),
    },
  ];
  await userRepository.updateCart(req.userId, newCart);
  res.sendStatus(200);
}

export async function updateCart(req, res) {
  const body = req.body;
  const productId = body.productId;
  const su = Number(body.su);
  const cart = req.cart;
  const foundCart = cart.find((cart) => cart.id === productId);
  if (su === 1) {
    const databaseProduct = await getProductById(productId);
    if (!databaseProduct) return res.sendStatus(400);
    if (Number(databaseProduct.qty) < Number(foundCart.qty) + 1)
      return res.status(400).json({ message: "최대 수량입니다" });
    let newCart = cart;
    const found = newCart.find((product) => product.id === productId);
    found.qty += 1;
    await userRepository.updateCart(req.userId, newCart);
    return res.sendStatus(204);
  } else if (su === -1) {
    if (Number(foundCart.qty) - 1 === 0) {
      const newCart = cart.filter((product) => product.id !== productId);
      await userRepository.updateCart(req.userId, newCart);
      return res.sendStatus(204);
    }
    const databaseProduct = await getProductById(productId);
    if (!databaseProduct) return res.sendStatus(400);
    if (Number(databaseProduct.qty) < Number(foundCart.qty) - 1) {
      if (Number(databaseProduct.qty) === 0)
        return res.status(400).json({ message: "상품이 품절되었습니다" });
      else {
        let newCart = cart;
        const found = newCart.find((product) => product.id === productId);
        found.qty = databaseProduct.qty;
        await userRepository.updateCart(req.userId, newCart);
        return res.sendStatus(204);
      }
    }
    let newCart = cart;
    const found = newCart.find((product) => product.id === productId);
    found.qty -= 1;
    await userRepository.updateCart(req.userId, newCart);
    return res.sendStatus(204);
  } else if (su === 0) {
    const newCart = cart.filter((product) => product.id !== productId);
    await userRepository.updateCart(req.userId, newCart);
    return res.sendStatus(204);
  }
  res.sendStatus(400);
}

export async function completeCart(req, res) {
  const newCart = [];
  try {
    await userRepository.updateCart(req.userId, newCart);
  } catch (error) {
    return res.sendStatus(400);
  }
  res.sendStatus(200);
}

/*----------------------------------*/

export async function getOrders(req, res) {
  const orders = await userRepository.getOrdersById(req.userId);
  if (!orders) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json(orders);
}

export async function getOrder(req, res) {
  const { id } = req.params;
  const order = await userRepository.getOrderById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (order.customerId !== user._id.toString()) {
    return res.status(404).json({ message: "다른 유저가 오더로 접속했음" });
  }
  res.status(200).json(order);
}

/*----------------------------------*/

export async function me(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  setToken(res, req.token);
  res.status(200).json({
    token: req.token,
    name: user.name,
    isAdmin: user.isAdmin,
    cart: user.cart,
  });
}

export async function csrfToken(req, res) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
}

/*----------------------------------*/

function generateCSRFToken() {
  const csrfKey = String(process.env.CSRF_SECRET_KEY);
  return bcrypt.hash(csrfKey, 1);
}

function createJwtToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_SEC,
  });
}

function createJwtTokenInResetPassword(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_SEC_RESET_PASSWORD,
  });
}

function setToken(res, token) {
  const options = {
    maxAge: process.env.JWT_EXPIRES_SEC,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  res.cookie("token", token, options);
}

/*----------------------------------*/
