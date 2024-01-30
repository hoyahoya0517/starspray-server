import { ObjectId } from "mongodb";
import { getOrders, getUsers } from "../database/database.js";

export async function findByEmail(email) {
  return getUsers()
    .findOne({ email })
    .then((data) => fixId(data));
}

export async function findById(id) {
  return getUsers()
    .findOne({ _id: new ObjectId(id) })
    .then((data) => fixId(data));
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString());
}

export async function changePassword(id, newPassword) {
  getUsers().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        password: newPassword,
      },
    }
  );
}

export async function updateProfile(
  id,
  name,
  phone,
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
        zipcode,
        address1,
        address2,
      },
    },
    { upsert: true }
  );
}

export async function updateCart(id, newCart) {
  getUsers().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        cart: newCart,
      },
    },
    { upsert: true }
  );
}

export async function getOrdersById(id) {
  return getOrders()
    .find({ customerId: id })
    .sort({ orderDate: -1 })
    .toArray()
    .then((data) => data);
}

export async function getOrderById(id) {
  return getOrders()
    .findOne({ paymentId: id })
    .then((data) => data);
}

function fixId(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
