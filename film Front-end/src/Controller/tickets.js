
function getUser() {
  try {
    var raw = sessionStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function getPreSignup() {
  try {
    var raw = sessionStorage.getItem("roc_pre_signup");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/* Fallback cinemas */
var COUNTRY_CINEMAS = {
  Morocco: ["Casablanca Mall (Casablanca)", "Rabat Agdal (Rabat)", "Marrakech Menara (Marrakech)"],
  France: ["Paris Centre (Paris)", "Lyon East (Lyon)", "Marseille Prado (Marseille)"],
  UK: ["London West End (London)", "Manchester Printworks (Manchester)", "Birmingham Bullring (Birmingham)"],
  USA: ["New York IMAX (NYC)", "LA Downtown (Los Angeles)", "Chicago Riverwalk (Chicago)"],
  China: ["Beijing Chaoyang (Beijing)", "Shanghai Pudong (Shanghai)", "Shenzhen Nanshan (Shenzhen)"]
};

function uniqueArray(arr) {
  var out = [];
  var seen = {};
  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];
    if (!v) continue;
    if (!seen[v]) {
      seen[v] = true;
      out.push(v);
    }
  }
  return out;
}

function formatISODate(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function addDays(dateObj, days) {
  var d = new Date(dateObj.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

document.addEventListener("DOMContentLoaded", function () {
  var user = getUser();
  if (!user || !user.id) {
    sessionStorage.setItem("auth_return", "tickets.html");
    window.location.href = "auth.html?mode=login";
    return;
  }

  var countrySelect = document.getElementById("countrySelect");
  var cinemaSelect = document.getElementById("cinema");
  var showDate = document.getElementById("showDate");
  var showTime = document.getElementById("showTime");
  var ticketCount = document.getElementById("ticketCount");
  var totalPrice = document.getElementById("totalPrice");
  var ticketForm = document.getElementById("ticketForm");

  var agreePreTicket = document.getElementById("agreePreTicket");
  var priceBox = document.getElementById("priceBox");
  var btnSubmitTicket = document.getElementById("btnSubmitTicket");
  var dateHint = document.getElementById("dateHint");

  
  if (!countrySelect || !cinemaSelect || !showDate || !showTime || !ticketCount || !totalPrice || !ticketForm) {
    alert("Tickets page is missing some elements. Please check tickets.html ids.");
    return;
  }
  if (!agreePreTicket || !priceBox || !btnSubmitTicket) {
    alert("Agreement UI missing. Please check tickets.html.");
    return;
  }

  var countries = Object.keys(COUNTRY_CINEMAS);
  var html = '<option value="">Choose country...</option>';
  for (var i = 0; i < countries.length; i++) {
    html += '<option value="' + countries[i] + '">' + countries[i] + "</option>";
  }
  countrySelect.innerHTML = html;

  
  var pre = getPreSignup();
  var defaultCountry = "Morocco";
  if (user.country) defaultCountry = user.country;
  else if (pre && pre.country) defaultCountry = pre.country;

  var found = false;
  for (var j = 0; j < countries.length; j++) {
    if (countries[j] === defaultCountry) {
      found = true;
      break;
    }
  }
  countrySelect.value = found ? defaultCountry : "Morocco";

  /*  Date limits (don’t trust user) */
  var today = new Date();
  var minDate = formatISODate(today);

  // Choose a realistic window (example: next 90 days)
  var maxDateObj = addDays(today, 90);
  var maxDate = formatISODate(maxDateObj);

  showDate.min = minDate;
  showDate.max = maxDate;

  if (dateHint) {
    dateHint.textContent = "Allowed dates: " + minDate + " → " + maxDate;
  }

 
  var backendLocations = [];

  function buildCinemaList(country) {
    var fallback = COUNTRY_CINEMAS[country] || [];

    var fromDb = [];
    if (backendLocations && Array.isArray(backendLocations)) {
      for (var i = 0; i < backendLocations.length; i++) {
        var row = backendLocations[i];
        if (!row) continue;

        var c = row.country ? String(row.country) : "";
        var cinema = row.cinema ? String(row.cinema) : "";

        if (c.toLowerCase() === String(country).toLowerCase()) {
          fromDb.push(cinema);
        }
      }
    }

    return uniqueArray(fallback.concat(fromDb));
  }

  function renderCinemas(country) {
    var cinemas = buildCinemaList(country);
    var opt = '<option value="">Choose cinema...</option>';
    for (var i = 0; i < cinemas.length; i++) {
      opt += '<option value="' + cinemas[i] + '">' + cinemas[i] + "</option>";
    }
    cinemaSelect.innerHTML = opt;
  }

  // Try backend locations, but don’t block if it fails
  fetch("http://localhost:3000/locations")
    .then(function (res) {
      if (!res.ok) throw new Error("Locations failed");
      return res.json();
    })
    .then(function (data) {
      if (Array.isArray(data)) backendLocations = data;
      renderCinemas(countrySelect.value);
    })
    .catch(function () {
      // fallback only
      renderCinemas(countrySelect.value);
    });

  countrySelect.addEventListener("change", function () {
    renderCinemas(countrySelect.value);
  });

  /*  Price calc */
  function updatePrice() {
    var count = Number(ticketCount.value || 1);
    var price = 15;
    var total = (count * price).toFixed(2);
    totalPrice.textContent = "$" + total;
  }
  ticketCount.addEventListener("change", updatePrice);
  updatePrice();

  /* disable price */
  function setPurchaseEnabled(enabled) {
    if (enabled) {
      btnSubmitTicket.disabled = false;
      priceBox.classList.remove("disabled");
    } else {
      btnSubmitTicket.disabled = true;
      priceBox.classList.add("disabled");
    }
  }

  setPurchaseEnabled(false);

  agreePreTicket.addEventListener("change", function () {
    if (agreePreTicket.checked === true) setPurchaseEnabled(true);
    else setPurchaseEnabled(false);
  });

  /* Submit -> POST */
  ticketForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (agreePreTicket.checked !== true) {
      alert("Please confirm the Pre-Ticket agreement first.");
      return;
    }

    var country = countrySelect.value;
    var cinema = cinemaSelect.value;
    var date = showDate.value;
    var time = showTime.value;
    var qty = Number(ticketCount.value || 1);

    if (!country || !cinema || !date || !time) {
      alert("Please choose country, cinema, date and time.");
      return;
    }

    // Validate date within min/max 
    if (date < showDate.min || date > showDate.max) {
      alert("Please select a date within the allowed window.");
      return;
    }

    var pricePerTicket = 15;
    var total = qty * pricePerTicket;

    var payload = {
      userId: user.id,
      country: country,
      cinema: cinema,
      showDate: date,
      showTime: time,
      quantity: qty,
      pricePerTicket: pricePerTicket,
      totalPrice: total,
      isPreTicket: true
    };

    fetch("http://localhost:3000/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res
          .json()
          .catch(function () { return {}; })
          .then(function (data) {
            if (!res.ok) {
              
              alert(data.message || "Ticket reservation failed (server error).");
              return;
            }

            // success:
    var savedTicket = {
      code: (data && data.ticket && data.ticket.id) ? ("ROC-" + data.ticket.id) : null,
      country: payload.country,
      cinema: payload.cinema,
      showDate: payload.showDate,
      showTime: payload.showTime,
      quantity: payload.quantity,
      totalPrice: payload.totalPrice,
      createdAt: new Date().toISOString()
    };

    sessionStorage.setItem("roc_last_ticket", JSON.stringify(savedTicket));
    window.location.href = "ticket-confirmation.html";

          });
      })
      .catch(function (err) {
        console.error(err);
        alert("Server offline / network error.");
      });
  });
});
