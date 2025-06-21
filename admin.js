// admin.js
const token = localStorage.getItem("token");

if (!token) {
  alert("Anda belum login sebagai admin.");
  window.location.href = "login.html";
}

const userData = JSON.parse(atob(token.split('.')[1]));
const isSuperAdmin = userData.role === "adminBesar";

fetch("https://dana-clone.onrender.com/api/admin/users", {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  const tbody = document.getElementById("userTable");
  document.getElementById("msg").innerText = "";

  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <span id="saldo-${user._id}">Rp ${user.saldo.toLocaleString("id-ID")}</span>
        ${isSuperAdmin ? `<input type="number" id="edit-${user._id}" style="width: 80px;" placeholder="Rp" />` : ""}
      </td>
      <td>
        ${isSuperAdmin ? `
        <button class="btn btn-edit" onclick="ubahSaldo('${user._id}')">Edit</button>
        <button class="btn btn-hapus" onclick="hapusUser('${user._id}')">Hapus</button>
        ` : "-"}
      </td>
    `;
    tbody.appendChild(row);
  });
})
.catch(err => {
  console.error(err);
  document.getElementById("msg").innerText = "Gagal memuat data pengguna.";
});

function ubahSaldo(userId) {
  const jumlah = parseInt(document.getElementById(`edit-${userId}`).value);
  if (isNaN(jumlah)) return alert("Masukkan jumlah saldo yang valid.");

  fetch(`https://dana-clone.onrender.com/api/admin/saldo/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ saldo: jumlah })
  })
  .then(res => res.json())
  .then(res => {
    alert(res.msg);
    document.getElementById(`saldo-${userId}`).innerText = `Rp ${jumlah.toLocaleString("id-ID")}`;
  })
  .catch(err => alert("Gagal mengubah saldo."));
}

function hapusUser(userId) {
  if (!confirm("Yakin ingin menghapus user ini?")) return;

  fetch(`https://dana-clone.onrender.com/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(res => {
    alert(res.msg);
    location.reload();
  })
  .catch(err => alert("Gagal menghapus user."));
}
