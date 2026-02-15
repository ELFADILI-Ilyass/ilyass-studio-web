
const dayEl = document.getElementById("day");
const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");
const confirmBtn = document.getElementById("confirm-btn");

function pad2(n) {
  const x = String(n || "").trim();
  return x.length === 1 ? "0" + x : x;
}

function buildDobISO() {
  const dd = pad2(dayEl?.value);
  const mm = pad2(monthEl?.value);
  const yyyy = String(yearEl?.value || "").trim();

  if (!dd || !mm || !yyyy) return null;
  if (yyyy.length !== 4) return null;

  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  // validation
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > new Date().getFullYear()) return null;

  return `${yyyy}-${mm}-${dd}`; // ISO
}

function calcAge(dobISO) {
  const dob = new Date(dobISO);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  return age;
}

function savePreSignup(dob) {
  sessionStorage.setItem("roc_pre_signup", JSON.stringify({ dob }));
}

document.addEventListener("DOMContentLoaded", () => {
  // logged in => go home
  if (sessionStorage.getItem("user")) {
    window.location.href = "home.html";
    return;
  }
});

confirmBtn?.addEventListener("click", () => {
  const dob = buildDobISO();
  if (!dob) {
    alert("Please enter a valid date of birth (DD/MM/YYYY).");
    return;
  }

  const age = calcAge(dob);
  if (age < 12) {
    alert("Access denied. You must be 12+.");
    return;
  }

  //Save and go HOME
  savePreSignup(dob);
  window.location.href = "home.html";
});
