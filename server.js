const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth");
const saldoRoute = require("./routes/saldo");
const adminRoute = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.use("/api/auth", authRoute);
app.use("/api/saldo", saldoRoute);
app.use("/api/admin", adminRoute);

// Coba route
app.get("/", (req, res) => {
  res.send("API DANA-CLONE Berjalan 🚀");
});

// Koneksi MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Koneksi ke MongoDB berhasil");
    app.listen(5000, () => {
      console.log("🚀 Server berjalan di http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi MongoDB:", err.message);
  });
