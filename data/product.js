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

function mapOptionalProduct(product) {
  return product ? { ...product, id: product._id.toString() } : product;
}

function mapProducts(products) {
  return products.map(mapOptionalProduct);
}
