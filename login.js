document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      alert("Login berhasil!");
      window.location.href = "index.html"; // masuk ke dashboard
    } else {
      document.getElementById("msg").innerText = data.msg || "Login gagal";
    }
  } catch (err) {
    document.getElementById("msg").innerText = "Terjadi kesalahan saat login";
  }
});
