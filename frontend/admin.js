const token = localStorage.getItem("token");
if (!token) {
  alert("Anda belum login!");
  window.location.href = "login.html";
}

function decodeTokenPayload(token) {
  try {
    const payload = token.split(".")[1]; // ambil bagian tengah dari JWT
    const decoded = atob(payload);       // decode base64
    return JSON.parse(decoded);          // ubah ke objek JS
  } catch (e) {
    return null;
  }
}

const userData = decodeTokenPayload(token);
if (userData) {
  document.addEventListener("DOMContentLoaded", () => {
    const info = document.getElementById("adminInfo");
    if (info) {
      info.innerText = `Selamat datang, ${userData.username} (${userData.email})`;
    }
  });
}

const api = "http://localhost:5000/api";

function loadUsers() {
  fetch(`${api}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("output").innerHTML = `
        <h2>Daftar Pengguna</h2>
        <ul>${data.map(u => `<li>${u.username} (${u.email}) - Role: ${u.role}</li>`).join("")}</ul>
      `;
    });
}

function loadAktivitas() {
  fetch(`${api}/admin/aktivitas`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      tampilkanAktivitas(data);
    });
}

function filterAktivitas() {
  const tipe = document.getElementById("filterTipe").value;
  const url = tipe ? `${api}/admin/aktivitas?tipe=${tipe}` : `${api}/admin/aktivitas`;
  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      tampilkanAktivitas(data);
    });
}function filterTanggal() {
  const dari = document.getElementById("tanggalDari").value;
  const sampai = document.getElementById("tanggalSampai").value;

  if (!dari || !sampai) {
    alert("Pilih tanggal awal dan akhir");
    return;
  }

  const url = `${api}/admin/aktivitas?dari=${dari}&sampai=${sampai}`;
  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    Authorization: `Bearer ${token}`,

  })
      .then(res => res.json())
    .then(data => {
      tampilkanAktivitas(data); // tampilkan ulang daftar aktivitas
    })
    .catch(err => {
      console.error("Gagal mengambil data:", err);
      alert("Terjadi kesalahan saat mengambil aktivitas.");
    });
}


function tampilkanAktivitas(data) {
  document.getElementById("output").innerHTML = `
    <h2>Riwayat Aktivitas</h2>
    <ul>
      ${data.map(a => `
        <li>
          ${a.user.username} (${a.user.email}) — ${a.tipe.toUpperCase()} ${a.jumlah} pada ${new Date(a.waktu).toLocaleString()}
        </li>
      `).join("")}
    </ul>
  `;
}

function loadStatistik() {
  fetch(`${api}/admin/statistik`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("statistik").innerHTML = `
        <p>💰 Total Top Up: ${data.topup}</p>
        <p>💸 Total Tarik: ${data.tarik}</p>
        <p>🔁 Total Refund: ${data.refund}</p>
        <p>📊 Total Semua Transaksi: ${data.totalTransaksi}</p>
      `;

      const barCtx = document.getElementById("grafikStatistik").getContext("2d");
      const pieCtx = document.getElementById("pieStatistik").getContext("2d");

      // Hapus grafik lama jika ada
      if (window.statistikChart) window.statistikChart.destroy();
      if (window.pieChart) window.pieChart.destroy();

      // Bar Chart
      window.statistikChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Top Up", "Tarik", "Refund"],
          datasets: [{
            label: "Jumlah Transaksi",
            data: [data.topup, data.tarik, data.refund],
            backgroundColor: ["green", "orange", "blue"],
          }]
        },
        options: {
          plugins: { title: { display: true, text: "Grafik Batang Transaksi" } }
        }
      });

      // Pie Chart
      window.pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: ["Top Up", "Tarik", "Refund"],
          datasets: [{
            data: [data.topup, data.tarik, data.refund],
            backgroundColor: ["green", "orange", "blue"],
          }]
        },
        options: {
          plugins: { title: { display: true, text: "Distribusi Persentase Transaksi" } }
        }
      });
    });
}


function logout() {
  localStorage.removeItem("token");
  alert("Anda telah logout");
  window.location.href = "login.html";
}

// Jalankan fungsi saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  loadStatistik();

  
  function loadGrafikHarian() {
  fetch(`${api}/admin/transaksi-per-hari`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.tanggal);
      const values = data.map(item => item.jumlah);

      const ctx = document.getElementById("grafikHarian").getContext("2d");

      // Hapus grafik lama jika ada
      if (window.grafikHarianChart) window.grafikHarianChart.destroy();

      window.grafikHarianChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels.reverse(), // supaya tanggal terbaru di kanan
          datasets: [{
            label: "Jumlah Transaksi per Hari",
            data: values.reverse(),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderRadius: 5,
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "📅 Grafik Harian Transaksi"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              precision: 0
            }
          }
        }
      });
    });
}
});
document.addEventListener("DOMContentLoaded", () => {
  loadStatistik();
  loadGrafikHarian(); // ⬅️ tambahkan ini
});
// Toggle dark mode
document.getElementById("darkModeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

// Export Chart to Image
function exportChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${canvasId}.png`;
  link.click();
}
