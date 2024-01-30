import { ObjectId } from "mongodb";
import { getProducts } from "../database/database.js";

export async function getAllProducts() {
  return getProducts()
    .find()
    .sort({ uploadedAt: -1 })
    .toArray()
    .then((data) => mapProducts(data));
}

export async function getProductById(id) {
  return getProducts()
    .findOne({ _id: new ObjectId(id) })
    .then((data) => mapOptionalProduct(data));
}

export async function getProductByCart(cart) {
  return await Promise.all(cart.map((id) => getProductById(id)));
}

export async function updateProductById(id, newQty) {
  getProducts().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        qty: newQty,
      },
    }
  );
}

function mapOptionalProduct(product) {
  return product ? { ...product, id: product._id.toString() } : product;
}

function mapProducts(products) {
  return products.map(mapOptionalProduct);
}
