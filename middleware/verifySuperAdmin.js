function verifySuperAdmin(req, res, next) {
  if (req.user.role === "adminBesar") {
    next();
  } else {
    return res.status(403).json({ msg: "Akses hanya untuk admin besar." });
  }
}

module.exports = verifySuperAdmin;
