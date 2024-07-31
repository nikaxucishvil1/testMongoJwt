const express = require("express");
const connectToDB = require("./db/db");
const bcrypt = require("bcrypt");
const userModel = require("./db/module");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./auth/auth");
require("dotenv").config();

const app = express();

app.use(express.json());

connectToDB();

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, linksArr } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json("Email already registered");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      password: hashedPassword,
      linksArr,
    });

    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
  }
});

app.get("/protected", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await userModel.findOne({ email });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
