import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "Crypto Price Tracker", error: null });
});

app.post("/price", async (req, res) => {
  const coin = req.body.crypto.toLowerCase();
  const currency = req.body.currency.toLowerCase();
  const amount = parseFloat(req.body.amount) || 1;

  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: coin,
        vs_currencies: currency,
      },
    });

    const price = response.data[coin]?.[currency];

    if (!price) {
      return res.render("result", {
        title: "Error",
        error: "Invalid cryptocurrency or currency name",
        data: null,
      });
    }

    res.render("result", {
      title: "Price Result",
      error: null,
      data: {
        name: coin,
        price: (price * amount).toFixed(6), // Show 6 decimals
        currency: currency,
        amount: amount.toFixed(6),
        unitPrice: price.toFixed(6),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.render("result", {
      title: "Error",
      error: "Something went wrong. Try again.",
      data: null,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
