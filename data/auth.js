import { ObjectId } from "mongodb";
import { getUsers } from "../database/database.js";

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

export async function addCart(id, newCart) {
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

export async function updateCart() {}

function fixId(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
