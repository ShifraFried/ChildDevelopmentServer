var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const TOKEN_SECRET =
  "F9EACB0E0AB8102E999DF5E3808B215C028448E868333041026C481960EFC126";

const generateAccessToken = (username) => {
  return jwt.sign({username}, TOKEN_SECRET);
};

router.get("/login", function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  const { user, password } = req.query;
  //Check the pwd in the server
  const token = generateAccessToken(user);
  console.log("token", token);
  return res.json({ token }).send();
});

router.post("/signup", function (req, res) {
  const { user, password } = req.body;
});

module.exports = router;
