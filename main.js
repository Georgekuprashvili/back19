const express = require("express");
const {
  getallproducts,
  getproductbyid,
  createproduct,
  deleteproductbyid,
  updateproductbyid,
  filter,
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

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
