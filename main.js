function register(e) {
  // Check if passwords match
  if (getValue("Wachtwoord") !== getValue("HerhaalWachtwoord")) {
    alert("Passwords do not match");
    return;
  }

  // Fetch data from html
  data = {
    Voornaam: getValue("Voornaam"),
    Achternaam: getValue("Achternaam"),
    Email: getValue("Email"),
    Wachtwoord: getValue("Wachtwoord"),
    Straat: getValue("Straat"),
    Postcode: getValue("Postcode"),
    HuisNummer: getValue("HuisNummer"),
    Stad: getValue("Stad"),
    Telefoonnummer: getValue("Telefoonnummer"),
  };

  // Submit data to API
  api("users", "POST", data).then((res) => {
    if (res.message == "succes") {
      alert("User created");
    }
  });
}

function login() {
  // Fetch data from html
  data = {
    Email: getValue("Email1"),
    Wachtwoord: getValue("Wachtwoord1"),
  };
  // Submit data to API
  api("auth", "POST", data).then((res) => {
    if (res.message == "success") {
      //Save the received JWT in a cookie
      setCookie("token", res.access_token, 365);
      alert("Succesvol ingelogd");
      showPage("homePage");
      getUser();
      showPage("uitloglink");
      hidePage("inloglink");
      hidePage("registreerlink");
      loggedIn(1);
    } else {
      console.log(res.message);
    }
  });
}

const APIME = "http://localhost:5000/me";

async function getUser() {
  const response = await fetch(APIME, {
    method: "GET",

    mode: "cors",

    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + getCookie("token"),
    },
  });

  const data = await response.json();
  console.log(data);
}

function logout() {
  getCookie("token");
  deleteCookie("token");
  getUser();
  alert("Succesvol uitgelogd");
  hidePage("uitloglink");
  showPage("inloglink");
  showPage("registreerlink");
  loggedIn(0);
}

function loggedIn(inlogWaarde) {
  if (inlogWaarde == 1) {
    console.log("Inlogstatus is nu 1");
    return true;
  } else {
    console.log("Inlogstatus is nu 0");
    return false;
  }
}

// Helper functions

function showPage(id) {
  let pages = document.getElementsByClassName("container");
  for (let i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  document.getElementById(id).style.display = "block";
}

function hidePage(id) {
  document.getElementById(id).style.display = "none";
}

function bindEvents() {
  connectButton("register", register);
  connectButton("login", login);
  // connectButton("loginlink", hidePage("homepage"), showPage("loginPage"));
  // connectButton(
  //   "registreerlink",
  //   hidePage("homepage"),
  //   showPage("registerPage")
  // );
  enableSubmits();
  loggedIn(0);
}

function enableSubmits() {
  document.body.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      // if enter is pressed
      console.log(e);
      let target = e.target;
      while (!target.className.includes("input")) {
        console.log(target);
        target = target.parentElement;
      }
      target.parentElement.getElementsByTagName("button")[0].click(); // click the first button
    }
  });
}

function connectButton(id, event) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", event);
  }
}

function getValue(id) {
  let element = document.getElementById(id);
  if (element) {
    return element.value;
  }
  return "";
}

function api(endpoint, method = "GET", data = {}) {
  const API = "http://localhost:5000/";
  return fetch(API + endpoint, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("token"),
    },
    body: method == "GET" ? null : JSON.stringify(data),
  }).then((res) => res.json());
}

// Cookie functions stolen from w3schools (https://www.w3schools.com/js/js_cookies.asp)
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(cname) {
  setCookie(cname, "", -1);
}

bindEvents();
