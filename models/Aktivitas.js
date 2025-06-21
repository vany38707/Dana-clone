const mongoose = require("mongoose");

const aktivitasSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",           // 🔗 Relasi ke user
    required: true,
  },
  tipe: {
    type: String,
    enum: ["topup", "tarik", "refund"],
    required: true,
  },
  jumlah: {
    type: Number,
    required: true,
  },
  keterangan: {
    type: String,
    default: "",           // 📄 opsional: bisa tulis "Top up dari ShopeePay", dll
  },
  status: {
    type: String,
    enum: ["berhasil", "gagal", "pending"],
    default: "berhasil",   // ✅ default berhasil
  },
  waktu: {
    type: Date,
    default: Date.now,     // 🕒 waktu otomatis
  },
});

module.exports = mongoose.model("Aktivitas", aktivitasSchema);
