import { getQuestions } from "../database/database.js";

export async function getAllQuestions() {
  return getQuestions()
    .find()
    .sort({ uploadedAt: -1 })
    .toArray()
    .then((data) => mapProducts(data));
}

function mapOptionalProduct(product) {
  return product ? { ...product, id: product._id.toString() } : product;
}

function mapProducts(products) {
  return products.map(mapOptionalProduct);
}
