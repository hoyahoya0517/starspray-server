import { ObjectId } from "mongodb";
import { getOrders } from "../database/database.js";

export async function newOrder(order) {
  return getOrders()
    .insertOne(order)
    .then((data) => data.insertedId.toString());
}

export async function getOrder(paymentId) {
  return getOrders()
    .findOne({ paymentId })
    .then((data) => mapOptionalOrder(data));
}

export async function deleteOrder(id) {
  getOrders().deleteOne({ _id: new ObjectId(id) });
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

function mapOptionalOrder(order) {
  return order ? { ...order, id: order._id.toString() } : order;
}

function mapOrders(orders) {
  return orders.map(mapOptionalOrder);
}
