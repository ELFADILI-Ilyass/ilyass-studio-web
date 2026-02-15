// ========================================
// DATA MODEL - COMPLETE & FIXED
// ========================================

export const COUNTRIES = [
  {
    name: "Morocco",
    code: "MA",
    flag: "🇲🇦",
    cinemas: [
      { name: "Megarama Casablanca", city: "Casablanca" },
      { name: "Megarama Marrakech", city: "Marrakech" },
      { name: "Megarama Rabat", city: "Rabat" },
    ],
  },
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    cinemas: [
      { name: "AMC Times Square", city: "New York" },
      { name: "Regal LA Live", city: "Los Angeles" },
      { name: "Cinemark Dallas", city: "Dallas" },
    ],
  },
  {
    name: "United Kingdom",
    code: "UK",
    flag: "🇬🇧",
    cinemas: [
      { name: "Odeon Leicester Square", city: "London" },
      { name: "Vue Printworks", city: "Manchester" },
      { name: "Cineworld Glasgow", city: "Glasgow" },
    ],
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    cinemas: [
      { name: "UGC Les Halles", city: "Paris" },
      { name: "Pathé Bellecour", city: "Lyon" },
      { name: "Gaumont Wilson", city: "Toulouse" },
    ],
  },
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    cinemas: [
      { name: "Wanda Cinemas CBD", city: "Beijing" },
      { name: "CGV Shanghai", city: "Shanghai" },
      { name: "Broadway Shenzhen", city: "Shenzhen" },
    ],
  },
];

// ========================================
// AGE GATE DATA
// ========================================

export function saveAgeGateData(data) {
  try {
    sessionStorage.setItem("requiem_age_gate", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving age gate data:", error);
  }
}

export function getAgeGateData() {
  try {
    const data = sessionStorage.getItem("requiem_age_gate");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

export function clearAgeGateData() {
  sessionStorage.removeItem("requiem_age_gate");
}

// Legacy support
export const savePreSignupData = saveAgeGateData;
export const getPreSignupData = getAgeGateData;
export const clearPreSignupData = clearAgeGateData;

// ========================================
// USER SESSION
// ========================================

export function saveUser(user) {
  try {
    sessionStorage.setItem("requiem_user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

export function getUser() {
  try {
    const data = sessionStorage.getItem("requiem_user");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

export function clearUser() {
  sessionStorage.removeItem("requiem_user");
}

export function isLoggedIn() {
  return getUser() !== null;
}

// ========================================
// TICKETS
// ========================================

export function saveTicket(ticket) {
  try {
    const existing = getTickets();
    existing.push(ticket);
    localStorage.setItem("requiem_tickets", JSON.stringify(existing));
  } catch (error) {
    console.error("Error saving ticket:", error);
  }
}

export function getTickets() {
  try {
    const data = localStorage.getItem("requiem_tickets");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

export function clearTickets() {
  localStorage.removeItem("requiem_tickets");
}

// Legacy support
export const saveTicketRequest = saveTicket;
export const getTicketRequests = getTickets;

// ========================================
// LOCATION (Legacy support)
// ========================================

export function saveLocation(locationObj) {
  localStorage.setItem("requiem_location", JSON.stringify(locationObj));
}

export function getLocation() {
  try {
    return JSON.parse(localStorage.getItem("requiem_location"));
  } catch {
    return null;
  }
}

export function clearLocation() {
  localStorage.removeItem("requiem_location");
}

export const STORAGE_KEYS = {
  PRE_SIGNUP: "requiem_age_gate",
  LOCATION: "requiem_location",
  REQUESTS: "requiem_tickets",
};
