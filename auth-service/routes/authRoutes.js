const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    let existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ msg: "Username already exists." });

    let existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ msg: "Email already exists." });

    let user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.get('/profile', verifyToken, isAdmin, async (req, res) => {
  res.json(req.user); 
});

router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set : req.body},
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.save();
    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User deleted successfully"});
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.patch("/users/:id/block", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBlocked = true;
    await user.save();
    res.json({ msg: "User blocked successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.patch("/users/:id/unblock", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBlocked = false;
    await user.save();
    res.json({ msg: "User unblocked successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.get("/search", isAdmin, async (req, res) => {
  try {
    const { keyword } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
});

module.exports = router;