import * as productRepository from "../data/product.js";
import * as userRepository from "../data/auth.js";

export async function getProducts(req, res) {
  const { category } = req.params;
  let products;
  if (category === "all") products = await productRepository.getAllProducts();
  else products = await productRepository.getAllProductsByCategory(category);
  res.status(200).json(products);
}

export async function getProduct(req, res) {
  const { id } = req.params;
  const found = await productRepository.getProductById(id);
  if (!found) return res.sendStatus(400);
  res.status(200).json(found);
}

export async function getProductByCart(req, res) {
  const cart = req.cart;
  cart.sort((a, b) => b.date - a.date);
  const found = await productRepository.getProductByCart(cart);
  if (!found) return res.sendStatus(400);
  res.status(200).json(found);
}

export async function getProductByOrder(req, res) {
  const { id } = req.params;
  const order = await userRepository.getOrderById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  const cart = order.cart;
  const found = await productRepository.getProductByCart(cart);
  if (!found) return res.sendStatus(400);
  res.status(200).json(found);
}

export async function checkCart(req, res) {
  const cart = req.cart;
  let checkProblem = false;
  await Promise.all(
    cart.map(async (product) => {
      const found = await productRepository.getProductById(product.id);
      if (Number(found.qty) - Number(product.qty) < 0) {
        checkProblem = true;
      }
    })
  );
  if (checkProblem)
    return res
      .status(400)
      .json({ message: "상품의 수량이 재고수량 보다 많습니다" });
  res.sendStatus(200);
}

export async function payCompleteCart(req, res) {
  const { cart } = req.body;
  try {
    await Promise.all(
      cart.map(async (product) => {
        const found = await productRepository.getProductById(product.id);
        const newQty = Number(found.qty) - Number(product.qty);
        productRepository.updateProductById(product.id, newQty);
      })
    );
  } catch (error) {
    return res.status(400).json({ message: "결제 진행에 문제가 발생했습니다" });
  }
  res.sendStatus(200);
}
