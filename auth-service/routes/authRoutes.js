const express = require("express");
const axios = require('axios');
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

router.post("/add", verifyToken, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: "All fields are required." });
  }
  try {
    let existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ msg: "Username already exists." });

    let existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ msg: "Email already exists." });

    let user = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

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

router.get('/profile', verifyToken, async (req, res) => {
  res.json(req.user); 
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    if(!user) return res.status(404).json({msg: 'user not found'})
    res.json(user);
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
    const userId = req.params.id;

    if (userId === req.user.id.toString()) {
      return res.status(400).json({ message: "An admin cannot delete their own account" });
    }
    try {
      const response = await axios.delete(`http://localhost:5001/projet/removeUser/${userId}`, {
        headers: { Authorization: req.headers.authorization }
      });
      console.log("Axios response:", response.status); 
    } catch (err) {
      console.error("Axios error:", err.message);
      return res.status(500).json({ message: "Error removing user from projects", error: err.message });
    }
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully and removed from projects" });

  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});


router.patch("/:id/ToggleBlock", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ msg: "User blocked successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", detail: err.message });
  }
});

router.get("/:keyword/search", verifyToken, isAdmin, async (req, res) => {
  try {
    const { keyword } = req.params; 
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required for search" });
    }
    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error: error.message });
  }
});

module.exports = router;