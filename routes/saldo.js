const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const Aktivitas = require("../models/Aktivitas");

// 🔼 Route Top Up Saldo
router.post("/topup", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jumlah } = req.body;

    if (!jumlah || jumlah <= 0) {
      return res.status(400).json({ msg: "Jumlah tidak valid" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    user.saldo += jumlah;
    await user.save();

    await Aktivitas.create({
      user: userId,
      tipe: "topup",
      jumlah,
    });

    res.json({
      msg: "Top up berhasil",
      saldoBaru: user.saldo,
    });
  } catch (err) {
    console.error("❌ ERROR TOPUP:", err);
    res.status(500).json({ msg: "Terjadi kesalahan server saat top up" });
  }
});

// 🔽 Route Tarik Saldo
router.post("/tarik", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jumlah } = req.body;

    if (!jumlah || jumlah <= 0) {
      return res.status(400).json({ msg: "Jumlah tidak valid" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    if (user.saldo < jumlah) {
      return res.status(400).json({ msg: "Saldo tidak mencukupi" });
    }

    user.saldo -= jumlah;
    await user.save();

    await Aktivitas.create({
      user: userId,
      tipe: "tarik",
      jumlah,
    });

    res.json({
      msg: "Tarik saldo berhasil",
      saldoBaru: user.saldo,
    });
  } catch (err) {
    console.error("❌ ERROR TARIK:", err);
    res.status(500).json({ msg: "Terjadi kesalahan saat tarik saldo" });
  }
});

// 🔁 Route Refund Saldo
router.post("/refund", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jumlah } = req.body;

    if (!jumlah || jumlah <= 0) {
      return res.status(400).json({ msg: "Jumlah refund tidak valid" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    user.saldo += jumlah;
    await user.save();

    await Aktivitas.create({
      user: userId,
      tipe: "refund",
      jumlah,
    });

    res.json({
      msg: "Refund berhasil",
      saldoBaru: user.saldo,
    });
  } catch (err) {
    console.error("❌ ERROR REFUND:", err);
    res.status(500).json({ msg: "Terjadi kesalahan saat refund" });
  }
});

module.exports = router;
router.get("/riwayat", verifyToken, async (req, res) => {
  try {
    const riwayat = await Aktivitas.find({ user: req.user.id }).sort({ waktu: -1 });
    res.json(riwayat);
  } catch (err) {
    console.error("❌ ERROR RIWAYAT:", err);
    res.status(500).json({ msg: "Gagal mengambil riwayat aktivitas" });
  }
});
