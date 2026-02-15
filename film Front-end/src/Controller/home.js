/* =========================
   HOME PAGE CONTROLLER - FIXED
   ========================= */

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");

// Tickets navigation
const btnTickets = document.getElementById("btnTickets");
const navTickets = document.getElementById("navTickets");

// Locked buttons inside overlays
const btnLoginFromNotes = document.getElementById("btnLoginFromNotes");
const btnSignupFromNotes = document.getElementById("btnSignupFromNotes");
const btnLoginFromBts = document.getElementById("btnLoginFromBts");
const btnSignupFromBts = document.getElementById("btnSignupFromBts");

// Studio panels
const pressKitBtn = document.getElementById("pressKitBtn");
const contactBtn = document.getElementById("contactBtn");
const pressKitPanel = document.getElementById("pressKitPanel");
const contactPanel = document.getElementById("contactPanel");
const closePanels1 = document.getElementById("closePanels1");
const closePanels2 = document.getElementById("closePanels2");

// Sections / menu highlight
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".side-menu li");

/* =========================
   AUTH HELPERS
   ========================= */

function isLoggedIn() {
  return !!sessionStorage.getItem("user");
}

function logout() {
  sessionStorage.removeItem("user");
  window.location.href = "home.html";
}

function currentPage() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1] || "home.html";
}

function goLogin(returnTo = "home.html") {
  sessionStorage.setItem("auth_return", returnTo);
  window.location.href = "auth.html?mode=login";
}

function goSignup(returnTo = "home.html") {
  sessionStorage.setItem("auth_return", returnTo);
  window.location.href = "auth.html?mode=signup";
}

/* =========================
   PROFILE DROPDOWN BEHAVIOR
   ========================= */

function hideDropdown() {
  if (profileDropdown) profileDropdown.style.display = "none";
}

function toggleDropdown(e) {
  e.stopPropagation();
  if (!profileDropdown) return;
  profileDropdown.style.display =
    profileDropdown.style.display === "flex" ? "none" : "flex";
}

function applyProfileBehavior() {
  if (!profileBtn) return;

  profileBtn.addEventListener("click", (e) => {
    if (isLoggedIn()) {
      
      window.location.href = "profile.html";
      return;
    }
    
    toggleDropdown(e);
  });

  document.addEventListener("click", hideDropdown);

  
  signupLink?.addEventListener("click", (e) => {
    e.preventDefault();
    hideDropdown();
    goSignup(currentPage());
  });

  loginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    hideDropdown();
    goLogin(currentPage());
  });
}

function goTicketsPage() {
  window.location.href = "tickets.html";
}
btnTickets?.addEventListener("click", goTicketsPage);
navTickets?.addEventListener("click", goTicketsPage);

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) {
    console.warn("Section not found:", id);
    return;
  }
  section.scrollIntoView({ behavior: "smooth" });
}
window.scrollToSection = scrollToSection;



window.addEventListener("scroll", () => {
  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 250) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    const clickAttr = item.getAttribute("onclick");
    if (clickAttr && clickAttr.includes(currentSection)) {
      item.classList.add("active");
    }
  });
});


function closePanels() {
  if (pressKitPanel) pressKitPanel.style.display = "none";
  if (contactPanel) contactPanel.style.display = "none";
}

function openPressKit() {
  closePanels();
  if (pressKitPanel) pressKitPanel.style.display = "block";
}

function openContact() {
  closePanels();
  if (contactPanel) contactPanel.style.display = "block";
}

pressKitBtn?.addEventListener("click", openPressKit);
contactBtn?.addEventListener("click", openContact);
closePanels1?.addEventListener("click", closePanels);
closePanels2?.addEventListener("click", closePanels);


function unlockMenuLocks() {
  if (!isLoggedIn()) return;

  document.getElementById("nav-production")?.classList.remove("locked-link");
  document.getElementById("nav-bts")?.classList.remove("locked-link");
}

function renderProductionNotesIfLoggedIn() {
  const container = document.getElementById("productionNotesContainer");
  if (!container) return;

  // Wire overlay buttons (guest)
  btnLoginFromNotes?.addEventListener("click", () => goLogin(currentPage()));
  btnSignupFromNotes?.addEventListener("click", () => goSignup(currentPage()));

  if (!isLoggedIn()) return;

  // replace locked area with content
  container.innerHTML = `
    <div class="restricted-content">
      <p class="restricted-sub">Work in Progress</p>

      <div class="restricted-grid">
        <div class="restricted-card">
          <img class="restricted-img" src="../../assets/Unreal.jpeg" alt="Unreal engine">
          <h3>Unreal Engine</h3>
          <p>The main tool used to build the game world. It creates the realistic space lighting, dark atmosphere, and cinematic look of the movie.</p>
        </div>

        <div class="restricted-card">
          <img class="restricted-img" src="../../assets/Sketchfab.png" alt="Sketchfab">
          <h3>3D Assets</h3>
          <p>Used to find high-quality free assets like spaceships and stations. These models were optimized to keep the project running smoothly.</p>
        </div>

        <div class="restricted-card">
          <img class="restricted-img" src="../../assets/Mixamo.png" alt="Mxiamo">
          <h3>Character Animation</h3>
          <p>
            Used for quick and realistic character animation. It handles the movement and rigging for the astronauts to make the scenes feel alive.
          </p>
        </div>
      </div>

      <div class="restricted-actions">
        <a class="btn-outline" href="profile.html">VIEW PROFILE</a>
        <button class="btn-outline" id="btnLogoutFromNotes">LOGOUT</button>
      </div>
    </div>
  `;

  document.getElementById("btnLogoutFromNotes")?.addEventListener("click", logout);
}

function renderBehindScenesIfLoggedIn() {
  const container = document.getElementById("behindScenesContainer");
  if (!container) return;

  // Wire overlay buttons (guest)
  btnLoginFromBts?.addEventListener("click", () => goLogin(currentPage()));
  btnSignupFromBts?.addEventListener("click", () => goSignup(currentPage()));

  if (!isLoggedIn()) return;

  container.innerHTML = `
    <div class="restricted-content">
      <p class="restricted-sub">Workflow snapshots, planning notes, and “how it was built”,all releasing after the premier.</p>
      <div class="restricted-grid">
    <h1> SOON... </h1>
      </div>

      <div class="restricted-actions">
        <a class="btn-outline" href="profile.html">VIEW PROFILE</a>
        <button class="btn-outline" id="btnLogoutFromBts">LOGOUT</button>
      </div>
    </div>
  `;

  document.getElementById("btnLogoutFromBts")?.addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", () => {
  applyProfileBehavior();
  unlockMenuLocks();
  renderProductionNotesIfLoggedIn();
  renderBehindScenesIfLoggedIn();
});
