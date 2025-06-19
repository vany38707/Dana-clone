const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    console.log("📥 Data register masuk:", req.body);

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email sudah terdaftar" });

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ msg: "Pendaftaran berhasil", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password salah" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, saldo: user.saldo } });
  } catch (err) {
    console.error("❌ ERROR REGISTER:", err);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
});

module.exports = router;
