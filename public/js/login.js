document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message show ${type}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showMessage("Please fill in all fields.", "error");
      return;
    }
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, "success");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        showMessage(data.message, "error");
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error");
    }
  });
});
