function safeParse(key) {
  try {
    var raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function fmtDate(iso) {
  if (!iso) return "—";
  // iso = "2026-04-26"
  var parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function money(n) {
  var num = Number(n);
  if (isNaN(num)) return "$0.00";
  return "$" + num.toFixed(2);
}

function ensureTicketCode(code) {
  if (code && String(code).trim().length > 0) return code;
  var r = Math.floor(100000 + Math.random() * 900000);
  return "ROC-" + r;
}

document.addEventListener("DOMContentLoaded", function () {
  var user = safeParse("user");
  var ticket = safeParse("roc_last_ticket");

  if (!user || !ticket) {
    // if someone opens this page directly
    window.location.href = "tickets.html";
    return;
  }

  var ticketCodeEl = document.getElementById("ticketCode");
  var tEmail = document.getElementById("tEmail");
  var tCountry = document.getElementById("tCountry");
  var tCinema = document.getElementById("tCinema");
  var tDate = document.getElementById("tDate");
  var tTime = document.getElementById("tTime");
  var tQty = document.getElementById("tQty");
  var tTotal = document.getElementById("tTotal");
  var tCreated = document.getElementById("tCreated");
  var printBtn = document.getElementById("printBtn");

  var code = ensureTicketCode(ticket.code);
  ticketCodeEl.textContent = code;

  tEmail.textContent = user.email || "—";
  tCountry.textContent = ticket.country || "—";
  tCinema.textContent = ticket.cinema || "—";
  tDate.textContent = fmtDate(ticket.showDate);
  tTime.textContent = ticket.showTime || "—";
  tQty.textContent = String(ticket.quantity || 1);
  tTotal.textContent = money(ticket.totalPrice);

  var created = ticket.createdAt || new Date().toISOString();
  tCreated.textContent = new Date(created).toLocaleString();

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
});
