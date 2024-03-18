import {} from "express-async-errors";
import * as adminRepository from "../data/admin.js";
import axios from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();

export async function addProducts(req, res) {
  const newProduct = req.body;
  if (!newProduct)
    return res.status(400).json({ message: "newProduct이 없음" });
  const product = { ...newProduct, uploadedAt: Date.now().toString() };
  try {
    await adminRepository.addProduct(product);
  } catch (error) {
    return res.status(400).json({ message: "db에 넣을 때오 류발생" });
  }
  res.sendStatus(200);
}

export async function updateProduct(req, res) {
  const product = req.body;
  if (!product)
    return res.status(400).json({ message: "updateProduct이 없음" });
  try {
    await adminRepository.updateProduct(
      product.id,
      product.name,
      product.price,
      product.img,
      product.info,
      product.qty,
      product.size,
      product.category,
      product.uploadedAt
    );
  } catch (error) {
    return res.status(400).json({ message: "db에 업데이트할 때 오류발생" });
  }
  res.sendStatus(200);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "지울데이터의 id값이 없음" });
  try {
    await adminRepository.deleteProduct(id);
  } catch (error) {
    return res.status(400).json({ message: "데이터 지울 때 오류 발생" });
  }
  res.sendStatus(204);
}

export async function getAllOrders(req, res) {
  const orders = await adminRepository.getAllOrders();
  res.status(200).json(orders);
}

export async function updateOrder(req, res) {
  const order = req.body;
  if (!order) return res.status(400).json({ message: "updateOrder가 없음" });
  try {
    await adminRepository.updateOrder(
      order.id,
      order.name,
      order.phone,
      order.zipcode,
      order.address1,
      order.address2,
      order.complete,
      order.refund,
      order.shipping,
      order.traking
    );
  } catch (error) {
    return res.status(400).json({ message: "db에 업데이트할 때 오류발생" });
  }
  res.sendStatus(200);
}

export async function deleteOrder(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "지울데이터의 id값이 없음" });
  try {
    await adminRepository.deleteOrder(id);
  } catch (error) {
    return res.status(400).json({ message: "데이터 지울 때 오류 발생" });
  }
  res.sendStatus(204);
}

export async function refundOrder(req, res) {
  let { amount, paymentId } = req.body;

  // 1. 포트원 API를 사용하기 위해 액세스 토큰을 발급받습니다.
  const signinResponse = await axios({
    url: "https://api.portone.io/login/api-secret",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: {
      apiSecret: process.env.PORTONE_API_SECRET, // 포트원 API Secret
    },
  });
  const { accessToken } = signinResponse.data;

  try {
    const response = await axios.post(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/cancel`,
      { amount: Number(amount), reason: "환불" },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.response.data.message });
  }
  res.sendStatus(200);
}

export async function getAllAuth(req, res) {
  const auth = await adminRepository.getAllAuth();
  res.status(200).json(auth);
}

export async function updateAuth(req, res) {
  const auth = req.body;
  let hashed;
  if (!auth) return res.status(400).json({ message: "updateAuth가 없음" });
  if (!(String(auth.password).length > 20)) {
    const saltRound = Number(process.env.SALT_ROUND);
    hashed = await bcrypt.hash(auth.password, saltRound);
  } else {
    hashed = auth.password;
  }

  try {
    await adminRepository.updateAuth(
      auth.id,
      auth.name,
      auth.phone,
      hashed,
      auth.isAdmin,
      auth.zipcode,
      auth.address1,
      auth.address2
    );
  } catch (error) {
    console.log("error");
    return res.status(400).json({ message: "db에 업데이트할 때 오류발생" });
  }
  res.sendStatus(200);
}

export async function deleteAuth(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "지울데이터의 id값이 없음" });
  try {
    await adminRepository.deleteAuth(id);
  } catch (error) {
    return res.status(400).json({ message: "데이터 지울 때 오류 발생" });
  }
  res.sendStatus(204);
}
