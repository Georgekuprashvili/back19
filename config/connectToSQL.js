const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
  })
  .promise();

const getallproducts = async () => {
  const [result] = await pool.query("SELECT * FROM products");
  console.log(result);
};

const getproductbyid = async (id) => {
  const [result] = await pool.query(
    `
        SELECT * FROM products 
        WHERE id = ?
        `,
    [id]
  );
  return result[0];
};

const createproduct = async (name, price, available) => {
  const [result] = await pool.query(
    `
       INSERT INTO products (name,price,available)
       VALUE (?,?,?)
       
        `,
    [name, price, available]
  );
  const insertdata = await getproductbyid(result.insertId);

  return result;
};

const deleteproductbyid = async (id) => {
  const [result] = await pool.query(
    `
        DELETE FROM products WHERE id = ?`,
    [id]
  );
  return result;
};

const updateproductbyid = async (id, name, price, available) => {
  const [result] = await pool.query(`UPDATE products SET ? WHERE id = ?`, [
    { name, price, available },
    id,
  ]);
  return result;
};
const filter = async (pricefrom, priceto, available) => {
  let query = "SELECT * FROM products WHERE 1=1";
  const param = [];

  if (pricefrom) {
    query += " AND price >= ?";
    param.push(pricefrom);
  }
  if (priceto) {
    query += " AND price <= ?";
    param.push(priceto);
  }
  if (available !== undefined) {
    query += " AND available = ?";
    param.push(available);
  }

  const [result] = await pool.query(query, param);
  return result;
};

const getallusers = async () => {
  const [result] = await pool.query("SELECT * FROM users");
  return result;
};
const getuserbyid = async (id) => {
  const [userRows] = await pool.query("SELECT * FROM users WHERE id =?", [id]);
  const user = userRows[0];
  const [postRows] = await pool.query(
    "SELECT id,title,content FROM posts WHERE user_id = ?",
    [id]
  );
  user.post = postRows;
  return user;
};
const createuser = async (name) => {
  const [result] = await pool.query("INSERT INTO users (name) VALUES (?)", [
    name,
  ]);
  return getuserbyid(result.insertId);
};
const updateuser = async (id, name) => {
  const [result] = await pool.query("UPDATE users SET name = ? WHERE id = ?", [
    name,
    id,
  ]);
  return result;
};
const createPost = async (title, content, user_id) => {
  const [result] = await pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, user_id]
  );
  return result;
};
const getAllPosts = async () => {
  const [result] = await pool.query("SELECT * FROM posts");
  return result;
};

module.exports = {
  getallproducts,
  getproductbyid,
  createproduct,
  deleteproductbyid,
  updateproductbyid,
  filter,
  getallusers,
  getuserbyid,
  createuser,
  updateuser,
  createPost,
  getAllPosts,
};
