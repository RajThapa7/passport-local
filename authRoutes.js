const passport = require("passport");
const { register } = require("./controller.js");
const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.json({ msg: "You have failed to log in" });
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({ msg: "success login", user: req.user });
  }
);

router.get("/logout", (req, res, next) => {
  console.log("in");
  req.logOut((err) => {
    if (err) return next(err);
    res.json({ msg: "Successfully loggedout" });
  });
});

router.post("/register", register);

module.exports = router;
