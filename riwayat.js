const token = localStorage.getItem("token");

if (!token) {
  document.getElementById("msg").innerText = "Silakan login terlebih dahulu.";
} else {
  fetch("https://dana-clone.onrender.com/api/saldo/riwayat", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("riwayatBody");

      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.tipe}</td>
          <td>Rp ${item.jumlah.toLocaleString("id-ID")}</td>
          <td>${item.status}</td>
          <td>${item.keterangan || "-"}</td>
          <td>${new Date(item.waktu || item.createdAt).toLocaleString("id-ID")}</td>
        `;
        tbody.appendChild(row);
      });

      if (data.length === 0) {
        document.getElementById("msg").innerText = "Belum ada transaksi.";
      }
    })
    .catch(err => {
      console.error("❌ Gagal ambil riwayat:", err);
      document.getElementById("msg").innerText = "Gagal mengambil data riwayat.";
    });
}
