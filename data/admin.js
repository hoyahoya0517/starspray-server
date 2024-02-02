import { ObjectId } from "mongodb";
import { getOrders, getUsers, getProducts } from "../database/database.js";

export async function addProduct(product) {
  getProducts().insertOne(product);
}

export async function updateProduct(
  id,
  name,
  price,
  img,
  info,
  qty,
  size,
  category,
  uploadedAt
) {
  getProducts().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        price,
        img,
        info,
        qty,
        size,
        category,
        uploadedAt,
      },
    }
  );
}

export async function deleteProduct(id) {
  getProducts().deleteOne({ _id: new ObjectId(id) });
}

export async function getAllOrders() {
  return getOrders()
    .find()
    .sort({ orderDate: -1 })
    .toArray()
    .then((data) => mapOrders(data));
}

export async function updateOrder(
  id,
  name,
  phone,
  zipcode,
  address1,
  address2,
  complete,
  refund,
  shipping
) {
  getOrders().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        phone,
        zipcode,
        address1,
        address2,
        complete,
        refund,
        shipping,
      },
    }
  );
}

export async function deleteOrder(id) {
  getOrders().deleteOne({ _id: new ObjectId(id) });
}

export async function getAllAuth() {
  return getUsers()
    .find()
    .sort({ signupDate: -1 })
    .toArray()
    .then((data) => mapOrders(data));
}

export async function updateAuth(
  id,
  name,
  phone,
  password,
  isAdmin,
  zipcode,
  address1,
  address2
) {
  getUsers().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        phone,
        password,
        isAdmin,
        zipcode,
        address1,
        address2,
      },
    }
  );
}

export async function deleteAuth(id) {
  getUsers().deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalOrder(order) {
  return order ? { ...order, id: order._id.toString() } : order;
}

function mapOrders(orders) {
  return orders.map(mapOptionalOrder);
}
