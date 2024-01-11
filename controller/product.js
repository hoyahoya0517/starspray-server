import * as productRepository from "../data/product.js";

export async function getProducts(req, res) {
  const products = await productRepository.getAllProducts();
  res.status(200).json(products);
}

export async function getProduct(req, res) {
  const { id } = req.params;
  const found = await productRepository.getProductById(id);
  if (!found) return res.sendStatus(400);
  res.status(200).json(found);
}
