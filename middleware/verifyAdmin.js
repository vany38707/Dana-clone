function verifyAdmin(req, res, next) {
  if (req.user.role === "adminKecil" || req.user.role === "adminBesar") {
    next();
  } else {
    return res.status(403).json({ msg: "Hanya admin yang bisa mengakses." });
  }
}

module.exports = verifyAdmin;
