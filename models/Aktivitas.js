const mongoose = require("mongoose");

const aktivitasSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  waktu: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Aktivitas", aktivitasSchema);
