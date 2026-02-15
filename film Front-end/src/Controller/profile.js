

function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = getUser();
  if (!user?.id) {
    sessionStorage.setItem("auth_return", "profile.html");
    window.location.href = "auth.html?mode=login";
    return;
  }

  // Fill from sessionStorage first (fast)
  document.getElementById("pEmail").textContent = user.email || "N/A";
  document.getElementById("pDob").textContent = user.dob || "N/A";
  document.getElementById("pCountry").textContent = user.country || "N/A";

  
  try {
    const res = await fetch(`http://localhost:3000/users/${user.id}`);
    if (res.ok) {
      const fresh = await res.json();
      document.getElementById("pEmail").textContent = fresh.email || user.email || "N/A";
      document.getElementById("pDob").textContent = fresh.dob || user.dob || "N/A";
      document.getElementById("pCountry").textContent = fresh.country || user.country || "N/A";


      sessionStorage.setItem("user", JSON.stringify({ ...user, ...fresh }));
    }
  } catch (e) {
    
  }

  document.getElementById("btnLogout")?.addEventListener("click", logout);
});
