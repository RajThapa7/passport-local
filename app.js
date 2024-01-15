const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./userModel");
const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const path = require("path");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "dog",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URI }),
  })
);

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    await User.findOne({ username: username })
      .then((user) => {
        if (!user)
          return done(null, false, { message: "No user with that email" });
        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else return done(null, false, { message: "wrong password" });
      })
      .catch((err) => {
        done(err);
      });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use(
  "/",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.json({ msg: "No you are not allowed" });
    }
    next();
  },
  userRoutes
);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("connected to database");
  app.listen(4000, () => {
    console.log("server started on port 4000");
  });
});
