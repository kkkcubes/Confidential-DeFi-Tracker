const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/defi")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const WalletSchema = new mongoose.Schema({
  encryptedData: String,
  fakeBalance: Number,
  createdAt: { type: Date, default: Date.now }
});
const Wallet = mongoose.model("Wallet", WalletSchema);

app.get("/api/portfolio", (req, res) => {
  res.json({
    totalValue: 15000,
    assets: [
      { name: "ETH", value: 10000 },
      { name: "USDC", value: 5000 }
    ]
  });
});

app.post("/api/store", async (req, res) => {
  const { encryptedData, fakeBalance } = req.body;
  const wallet = new Wallet({ encryptedData, fakeBalance });
  await wallet.save();
  res.json({ message: "Saved to MongoDB" });
});

app.get("/api/data", async (req, res) => {
  const data = await Wallet.find();
  res.json(data);
});

app.get("/api/tvl", async (req, res) => {
  const wallets = await Wallet.find();
  const tvl = wallets.reduce((sum, w) => sum + (w.fakeBalance || 0), 0);
  res.json({ tvl });
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});