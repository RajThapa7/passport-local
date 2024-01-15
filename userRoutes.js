const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    msg: "Congrats you made it so far",
  });
});

router.get("/profile", (req, res) => {
  res.json({ msg: "this is your profile" });
});

module.exports = router;
