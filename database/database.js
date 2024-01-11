import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_HOST;

let db;
export async function connectDB() {
  const client = new MongoClient(uri);
  db = client.db("otegami");
}
export function getUsers() {
  return db.collection("users");
}

export function getProducts() {
  return db.collection("products");
}
