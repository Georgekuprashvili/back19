const express = require("express");
const {
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
} = require("./config/connectToSQL");
const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  const { pricefrom, priceto, available } = req.query;

  if (pricefrom || priceto || available !== undefined) {
    const filtered = await filter(
      pricefrom,
      priceto,
      available === "true" ? 1 : 0
    );
    return res.json(filtered);
  }

  const all = await getallproducts();
  res.json(all);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getproductbyid(id);
  res.json(result);
});

app.post("/products", async (req, res) => {
  const { name, price, available } = req.body;
  const result = await createproduct(name, price, available);

  res.status(201).json({ message: "create successfully" });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const result = await deleteproductbyid(id);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: " not found" });
  }
  res.status(201).json({ message: "delete successfully" });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, available } = req.body;
  const result = await updateproductbyid(id, name, price, available);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "not found" });
  }
  res.json({ message: "updated successfully" });
});
app.get("/users", async (req, res) => {
  const users = await getallusers();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getuserbyid(id);
  if (!user) return res.status(404).json({ message: "not found" });
  res.json(user);
});

app.post("/users", async (req, res) => {
  const { name } = req.body;
  const user = await createuser(name);
  res.status(201).json(user);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await updateuser(id, name);
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "not found" });
  res.json({ message: "User updated" });
});

app.get("/posts", async (req, res) => {
  const posts = await getAllPosts();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const { title, content, user_id } = req.body;
  const result = await createPost(title, content, user_id);
  res.status(201).json({ message: "Post created", postId: result.insertId });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
