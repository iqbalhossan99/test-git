const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const username = req.body?.username;
    const email = req.body?.email;
    const password = req.body?.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const query = {
      username: username,
      email: email,
      password: hashedPass,
    };

    const newUser = new User(query);

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const getEmail = req.body?.email;
    const getPassword = req.body?.password;

    const getUser = await User.findOne({ email: getEmail });
    !getUser && res.status(400).json("Email  address doesn't match!");

    const validate = await bcrypt.compare(getPassword, getUser.password);
    // jwt token
    const token = jwt.sign({ email: getEmail }, process.env.JWT_SECRET);
    !validate && res.status(400).json("Password doesn't matched!");

    const { password, ...others } = getUser._doc;

    res.status(200, { others, token }).json({ others, token });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
