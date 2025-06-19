// 🌍 Konfigurasi .env
const dotenv = require("dotenv");
dotenv.config();

// 🚀 Import Library
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 📦 Import Routes
const authRoute = require("./routes/auth");
const saldoRoute = require("./routes/saldo");
const adminRoute = require("./routes/admin");

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Routes
app.use("/api/auth", authRoute);
app.use("/api/saldo", saldoRoute);
app.use("/api/admin", adminRoute);

// 🔍 Cek API Root
app.get("/", (req, res) => {
  res.send("API DANA-CLONE Berjalan 🚀");
});

// ❌ Handler untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: "Path not found" });
});

// ⚙️ Port (gunakan PORT dari Render jika tersedia)
const PORT = process.env.PORT || 5000;

// 🔗 Koneksi MongoDB dan Start Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Koneksi ke MongoDB berhasil");
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi MongoDB:", err.message);
  });
