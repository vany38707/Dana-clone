const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Aktivitas = require("../models/Aktivitas");

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");


// 🧑‍💼 Lihat semua user (adminKecil & adminBesar)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // sembunyikan password
    res.json(users);
  } catch (err) {
    console.error("❌ Gagal mengambil data pengguna:", err);
    res.status(500).json({ msg: "Gagal mengambil data pengguna" });
  }
});


// ✏️ Ubah role user (hanya adminBesar)
router.put("/users/:id/role", verifyToken, verifySuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["pengguna", "adminKecil", "adminBesar"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: "Role tidak valid" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    user.role = role;
    await user.save();

    res.json({ msg: "Role berhasil diubah", user });
  } catch (err) {
    console.error("❌ Gagal ubah role:", err);
    res.status(500).json({ msg: "Terjadi kesalahan saat mengubah role" });
  }
});


// ❌ Hapus user (hanya adminBesar)
router.delete("/users/:id", verifyToken, verifySuperAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.json({ msg: "User berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus user:", err);
    res.status(500).json({ msg: "Gagal menghapus user" });
  }
});


// 📜 Lihat semua aktivitas user (admin)
router.get("/aktivitas", verifyToken, verifyAdmin, async (req, res) => {
  try {
        const { dari, sampai } = req.query;
    const filter = {};

    if (dari && sampai) {
      filter.waktu = {
        $gte: new Date(dari),
        $lte: new Date(sampai + "T23:59:59"),
      };
    }

    const aktivitas = await Aktivitas.find()
      .populate("user", "username email")
      .sort({ waktu: -1 });

    res.json(aktivitas);
  } catch (err) {
    console.error("❌ Gagal mengambil aktivitas:", err);
    res.status(500).json({ msg: "Gagal mengambil aktivitas sistem" });
  }
});


// 📊 Statistik transaksi (admin)
router.get("/statistik", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const semua = await Aktivitas.find();

    const total = {
      topup: 0,
      tarik: 0,
      refund: 0,
    };

    semua.forEach(a => {
      if (a.tipe === "topup") total.topup += a.jumlah;
      else if (a.tipe === "tarik") total.tarik += a.jumlah;
      else if (a.tipe === "refund") total.refund += a.jumlah;
    });

    res.json({
      topup: total.topup,
      tarik: total.tarik,
      refund: total.refund,
      totalTransaksi: total.topup + total.tarik + total.refund
    });
  } catch (err) {
    console.error("❌ Gagal ambil statistik:", err);
    res.status(500).json({ msg: "Gagal ambil data statistik" });
  }
});


// 📈 Grafik Harian Transaksi
router.get("/grafik-harian", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const aktivitas = await Aktivitas.find();

    const perTanggal = {};
    aktivitas.forEach(a => {
      const tanggal = new Date(a.waktu).toISOString().split("T")[0];
      if (!perTanggal[tanggal]) perTanggal[tanggal] = 0;
      perTanggal[tanggal]++;
    });

    res.json({
      labels: Object.keys(perTanggal),
      data: Object.values(perTanggal)
    });
  } catch (err) {
    console.error("❌ Gagal ambil grafik harian:", err);
    res.status(500).json({ msg: "Gagal ambil data grafik harian" });
  }
});
// 📊 Grafik Jumlah Pengguna per Role
router.get("/grafik-pengguna", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const roles = ["pengguna", "adminKecil", "adminBesar"];
    const counts = await Promise.all(
      roles.map(async role => {
        const count = await User.countDocuments({ role });
        return count;
      })
    );

    res.json({
      labels: roles,
      data: counts
    });
  } catch (err) {
    console.error("❌ Gagal ambil grafik pengguna:", err);
    res.status(500).json({ msg: "Gagal ambil data pengguna" });
  }
});


module.exports = router;
