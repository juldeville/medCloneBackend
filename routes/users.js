var express = require("express");
var router = express.Router();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

router.post("/signUp", (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "password", "email"])) {
    res.json({ result: false, error: "missing or empty fields" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((data) => {
        res.json({ result: true, token: data.token });
      });
    } else res.json({ result: false, error: "User already exists" });
  });
});

router.post("/signIn", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "missing or empty fields" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    console.log(data.password, req.body.password);
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else res.json({ result: false, error: "Invalide email or password" });
  });
});
