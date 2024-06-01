import express from 'express';
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import cors from "cors";
import { fetchProductsFromCompany } from './utils/fetchProducts.js';

dotenv.config();

const app = express();

app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"],
}));
app.use(express.json());

const productCache = {};

app.get("AMZ/categories/:categoryname/products", async (req, res) => {
  const { categoryname } = req.params;
  const { top , minPrice , maxPrice , page } = req.query;

  try {
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZP'];
    const requests = companies.map(company => fetchProductsFromCompany(company, categoryname, top, minPrice, maxPrice));

    const responses = await Promise.all(requests);
    const products = responses.flat();

    const pageSize = parseInt(top, 10);
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

    paginatedProducts.forEach(product => {
      const uniqueId = uuidv4();
      productCache[uniqueId] = product;
      product.id = uniqueId;
    });

    res.json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
});

app.get("/categories/:categoryname/products/:productid", (req, res) => {
  const { productid } = req.params;
  const product = productCache[productid];

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get("/hello", (req, res) => res.json({ message: "HELLO WORLD!" }));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app as expressApp };
