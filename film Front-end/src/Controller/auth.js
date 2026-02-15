
const tabSignup = document.getElementById("tabSignup");
const tabLogin = document.getElementById("tabLogin");

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const signupEmail = document.getElementById("signupEmail");
const signupDob = document.getElementById("signupDob");
const signupCountry = document.getElementById("signupCountry");
const signupPassword = document.getElementById("signupPassword");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const toggleSignupPass = document.getElementById("toggleSignupPass");
const toggleLoginPass = document.getElementById("toggleLoginPass");

const signupMessage = document.getElementById("signupMessage");
const loginMessage = document.getElementById("loginMessage");

/* ---------- HELPERS ---------- */
function showMsg(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.style.display = text ? "block" : "none";
  el.style.color = isError ? "#ff6b6b" : "#78beff";
}

function setMode(mode) {
  const isLogin = mode === "login";

  tabLogin?.classList.toggle("active", isLogin);
  tabSignup?.classList.toggle("active", !isLogin);

  if (loginForm) loginForm.style.display = isLogin ? "grid" : "none";
  if (signupForm) signupForm.style.display = isLogin ? "none" : "grid";

  showMsg(signupMessage, "");
  showMsg(loginMessage, "");
}

function saveUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

function getPreSignup() {
  try {
    return JSON.parse(sessionStorage.getItem("roc_pre_signup") || "null");
  } catch {
    return null;
  }
}

function savePreSignupCountry(country) {
  try {
    const old = getPreSignup() || {};
    sessionStorage.setItem("roc_pre_signup", JSON.stringify({ ...old, country }));
  } catch {}
}

function getReturnUrl() {
  return sessionStorage.getItem("auth_return") || "home.html";
}

function clearReturnUrl() {
  sessionStorage.removeItem("auth_return");
}

async function postJSON(fullUrl, payload) {
  try {
    const res = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error("Network/API error:", err);
    return { ok: false, status: 0, data: { message: "Network error" } };
  }
}

function togglePassword(inputEl, btnEl) {
  if (!inputEl || !btnEl) return;
  const hidden = inputEl.type === "password";
  inputEl.type = hidden ? "text" : "password";
  btnEl.textContent = hidden ? "Hide" : "Show";
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // if already logged in -> go home
  if (sessionStorage.getItem("user")) {
    window.location.href = "home.html";
    return;
  }

  // set mode from URL
  const params = new URLSearchParams(window.location.search);
  setMode(params.get("mode") || "signup");

  // prefill DOB (and country if exists)
  const pre = getPreSignup();
  if (pre) {
    if (signupDob && pre.dob) signupDob.value = pre.dob; // YYYY-MM-DD
    if (signupCountry && pre.country) signupCountry.value = pre.country;
  }
});

/* ---------- TABS ---------- */
tabSignup?.addEventListener("click", () => setMode("signup"));
tabLogin?.addEventListener("click", () => setMode("login"));

/* ---------- SHOW/HIDE PASSWORD ---------- */
toggleSignupPass?.addEventListener("click", () =>
  togglePassword(signupPassword, toggleSignupPass)
);

toggleLoginPass?.addEventListener("click", () =>
  togglePassword(loginPassword, toggleLoginPass)
);

/* ---------- SIGNUP ---------- */
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupEmail?.value?.trim();
  const password = signupPassword?.value;
  const dob = signupDob?.value;
  const country = signupCountry?.value;

  if (!email || !password || !dob || !country) {
    showMsg(signupMessage, "Please fill all fields.", true);
    return;
  }

  // keep country in pre-signup so tickets/profile can reuse
  savePreSignupCountry(country);

  showMsg(signupMessage, "Creating account...");

  const { ok, data } = await postJSON("http://localhost:3000/auth/signup", {
    email,
    password,
    dob,
    country,
  });

  if (!ok || data?.ok === false) {
    showMsg(signupMessage, data?.message || "Signup failed.", true);
    return;
  }

  const user = data?.user || data;
  saveUser(user);

  showMsg(signupMessage, "Account created ✅ Redirecting...");
  const next = getReturnUrl();
  clearReturnUrl();
  setTimeout(() => (window.location.href = next), 600);
});

/* ---------- LOGIN ---------- */
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail?.value?.trim();
  const password = loginPassword?.value;

  if (!email || !password) {
    showMsg(loginMessage, "Enter email and password.", true);
    return;
  }

  showMsg(loginMessage, "Logging in...");

  const { ok, data } = await postJSON("http://localhost:3000/auth/login", {
    email,
    password,
  });

  if (!ok || data?.ok === false) {
    showMsg(loginMessage, data?.message || "Invalid credentials.", true);
    return;
  }

  const user = data?.user || data;
  saveUser(user);

  showMsg(loginMessage, "Login successful ✅ Redirecting...");
  const next = getReturnUrl();
  clearReturnUrl();
  setTimeout(() => (window.location.href = next), 600);
});
