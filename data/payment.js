import { getOrders } from "../database/database.js";

export async function newOrder(order) {
  return getOrders()
    .insertOne(order)
    .then((data) => data.insertedId.toString());
}

export async function getOrder(paymentId) {
  return getOrders()
    .findOne({ paymentId })
    .then((data) => data);
}

export async function orderComplete(paymentId) {
  getOrders().updateOne(
    { paymentId },
    {
      $set: {
        complete: true,
        shipping: "주문 확인 중",
      },
    }
  );
}
