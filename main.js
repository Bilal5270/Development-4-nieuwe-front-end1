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
      setCookie("role", 1, 365);
      alert("Succesvol ingelogd als gast");
      getUser();
    } else {
      console.log(res.message);
      alert(res.message);
    }
  });
}
function login1() {
  // Fetch data from html
  data = {
    Email: getValue("Email2"),
    Wachtwoord: getValue("Wachtwoord2"),
  };
  // Submit data to API
  api("auth1", "POST", data).then((res) => {
    if (res.message == "success") {
      //Save the received JWT in a cookie
      setCookie("token", res.access_token, 365);
      setCookie("role", 2, 365);
      alert("Succesvol ingelogd als medewerker");
      getUser();
      hidePage("homePage");
      showPage("medewerkerPage");
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
  if (getCookie("role") == 1) {
    loggedIn();
    document.getElementById(
      "Voornaam"
    ).textContent = `Ingelogd als : ${data.GastenAccount.Voornaam}`;
    document.getElementById("Achternaam").textContent =
      data.GastenAccount.Achternaam;
    return;
  }
  if (getCookie("role") == 2) {
    loggedIn();

    return;
  } else {
    loggedIn();
    return;
  }
}

function logout() {
  getCookie("token");
  deleteCookie("token");
  getCookie("role");
  deleteCookie("role");
  getUser();
  alert("Succesvol uitgelogd");
}

function loggedIn() {
  if (getCookie("role") == 1) {
    console.log(`Role is nu ${getCookie("role")}`);
    showPage("uitloglink");
    hidePage("teamlink");
    showPage("homePage");
    hidePage("inloglink");
    hidePage("registreerlink");
    return;
  }
  if (getCookie("role") == 2) {
    showPage("medewerkerPage");
    hidePage("homePage");
    console.log(`Role is nu ${getCookie("role")}`);
    return;
  } else {
    console.log(`Role is nu ${getCookie("role")}`);
    showPage("inloglink");
    showPage("homePage");
    showPage("registreerlink");
    hidePage("uitloglink");
    showPage("teamlink");
    hidePage("medewerkerPage");
    return;
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
  connectButton("login1", login1);
  // connectButton("loginlink", hidePage("homepage"), showPage("loginPage"));
  // connectButton(
  //   "registreerlink",
  //   hidePage("homepage"),
  //   showPage("registerPage")
  // );
  enableSubmits();
  getUser();
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

// showcase Userdata when loggedin
// async function getUser() {
//   const response = await fetch(APIME, {
//     method: "GET",
//     mode: "cors",
//   });
//   const data = await response.json();

//   document.getElementById("Voornaam").textContent = data[0].Voornaam;
//   document.getElementById("Achternaam").textContent = data[0].Achternaam;
// }

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
