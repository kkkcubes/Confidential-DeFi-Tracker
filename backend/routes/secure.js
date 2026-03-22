const router = require("express").Router();

let encryptedStore = [];

router.post("/store", (req, res) => {
  const encrypted = req.body;
  encryptedStore.push(encrypted);

  res.json({ status: "stored" });
});

module.exports = router;