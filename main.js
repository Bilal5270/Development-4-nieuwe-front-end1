// Functionality to add a user to the database
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

// Functionality to add a table to the database
function register1(e) {
  // Fetch data from html
  data = {
    Binnen: getValue("binnenBuiten"),
    Stoelen: getValue("stoelenBanken"),
    Ingangsdatum: getValue("Ingangsdatum"),
    Hoog: getValue("hoogLaag"),
    AantalPersonen: getValue("Zitplekken"),
  };

  // Submit data to API
  api("tafels", "POST", data).then((res) => {
    if (res.message == "Succesvol tafel toegevoegd") {
      alert("Tafel created");
      console.log(data);
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

function addReservering() {
  data = {
    DatumReservering: getValue("Datum"),
    Tijd: getValue("Tijd"),
    Taxiservice: getValue("Taxiservice"),
    AantalPersonen: getValue("AantalPersonen"),
    Binnen: getValue("binnenBuiten"),
    Stoelen: getValue("stoelenBanken"),
    Hoog: getValue("hoogLaag"),
  };

  api("reservations", "POST", data).then((res) => {
    if (res.message == "Succesvol gereserveerd") {
      alert("Succesvol gereserveerd");
      getUser();
    } else {
      console.log(res.message);
    }
  });
}

function deleteTafel() {
  // Fetch data from html
  data = {
    TafelId: getValue("tafelId"),
  };

  // Submit data to API
  api("delete/" + data.TafelId, "DELETE", data).then((res) => {
    if (res.message == "Tafel succesvol verwijderd") {
      alert("Succesvol tafel verwijderd");
      hidePage("verwijderPage");
      showPage("medewerkerPage");
      getUser();
    } else {
      console.log(res.message);
    }
  });
}
// Functie om de eigenschappen van een tafel te wijzigen
async function wijzigTafel(e) {
  data = {
    TafelId: getValue("tafelId1"),
    Binnen: getValue("binnenBuiten1"),
    Stoelen: getValue("stoelenBanken1"),
    Hoog: getValue("hoogLaag1"),
    AantalPersonen: getValue("Zitplekken1"),
  };

  // Submit data to API

  api("patchtafel/" + data.TafelId, "PATCH", data).then((res) => {
    if (res.message == "Succesvol tafeleigenschappen gewijzigd") {
      alert(`Succesvol tafeleigenschappen van ${data.TafelId} gewijzigd`);
    }
  });
}

const APIR = "http://localhost:5000/reserveringen";

async function getReservations() {
  const response = await fetch(APIR, {
    method: "GET",

    mode: "cors",

    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + getCookie("token"),
    },
  });

  const data = await response.json();
  if (data.message == "Successvol") {
    let nieuweHtml = data.Reservering.map(
      (data) =>
        `
        
        <tr>
        <th>Reservatie ID</th>
        <th>Datum Reservering</th>
        <th>Tijd</th>
        <th>Taxiservice</th>
        <th>AantalPersonen</th>
        <th>Binnen</th>
        <th>Stoelen</th>
        <th>Hoog</th>
       
      </tr>
      <tr>

        <td >${data.ReserveringID}</td>
        <td >${data.DatumReservering}</td>
        <td >${data.Tijd}</td>
        <td >${data.Taxiservice}</td>
        <td >${data.AantalPersonen}</td>
        <td >${data.Binnen}</td>
        <td >${data.Stoelen}</td>
        <td >${data.Hoog}</td>
        
      </tr>`
    ).join("");

    nieuweHtml = "<table>" + nieuweHtml + "</table>";
    document.getElementById("reservations3").innerHTML = nieuweHtml;
  }
}
const APIMER = "http://localhost:5000/me/reserveringen";

function WijzigReserveringButton(id) {
  document.getElementById("geselecteerdeReserveringID").innerHTML = id;
  showPage("patchPage1");
}

function WijzigReservering(id) {
  data = {
    ReserveringID: document.getElementById("geselecteerdeReserveringID")
      .innerHTML,
    DatumReservering: getValue("Datum2"),
    Tijd: getValue("Tijd2"),
    Taxiservice: getValue("Taxiservice2"),
    Binnen: getValue("binnenBuiten2"),
    Stoelen: getValue("stoelenBanken2"),
    Hoog: getValue("hoogLaag2"),
    AantalPersonen: getValue("AantalPersonen2"),
  };

  console.log(data.ReserveringID);

  // Submit data to API

  api("patchreservering/" + data.ReserveringID, "PATCH", data).then((res) => {
    if (res.message == "Succesvol reservering gewijzigd") {
      alert(`Succesvol reservering met id ${data.ReserveringID} gewijzigd`);
    }
  });
}

async function getMyReservations() {
  const response = await fetch(APIMER, {
    method: "GET",

    mode: "cors",

    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + getCookie("token"),
    },
  });

  const data = await response.json();
  if (data.message == "Successvol") {
    let nieuweHtml = data.Reservering.map(
      (data) =>
        `
        
        <tr>
        <th>Reservatie ID</th>
        <th>Datum Reservering</th>
        <th>Tijd</th>
        <th>Taxiservice</th>
        <th>AantalPersonen</th>
        <th>Binnen</th>
        <th>Stoelen</th>
        <th>Hoog</th>
       
      </tr>
      <tr>

        <td >${data.ReserveringID}</td>
        <td >${data.DatumReservering}</td>
        <td >${data.Tijd}</td>
        <td >${data.Taxiservice}</td>
        <td >${data.AantalPersonen}</td>
        <td >${data.Binnen}</td>
        <td >${data.Stoelen}</td>
        <td >${data.Hoog}</td>
        <td ><button onClick="WijzigReserveringButton(${data.ReserveringID})">Wijzigen</button></td>
        <td ><button onClick="VerwijderReserveringButton(${data.ReserveringID})">Verwijderen</button></td>
      </tr>`
    ).join("");

    nieuweHtml = "<table>" + nieuweHtml + "</table>";
    document.getElementById("reservations2").innerHTML = nieuweHtml;
  }
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
  if (data.message == "Successvol") {
    if (getCookie("role") == 1) {
      loggedIn();
      document.getElementById(
        "userName"
      ).textContent = `Welkom ${data.User.Voornaam} ${data.User.Achternaam} `;
      return;
    }
    if (getCookie("role") == 2) {
      loggedIn();
      document.getElementById(
        "inlognaam"
      ).textContent = `Welkom ${data.User.Voornaam} ${data.User.Achternaam}`;
      return;
    }
  } else {
    loggedIn();
  }
  if (data.msg == "Token has expired") {
    logout();
  }
}
function logout() {
  // getCookie("token");
  deleteCookie("token");
  // getCookie("role");
  deleteCookie("role");
  // getUser();
  loggedIn();
  hidePage("reserveerknop");
  hidePage("eigenreserveringenlink");
  alert("Je bent uitgelogd");
}

function loggedIn() {
  if (getCookie("role") == 1) {
    console.log(`Role is nu ${getCookie("role")}`);
    showPage("uitloglink");
    hidePage("teamlink");
    hidePage("tekstReservering");
    showPage("reserveerknop");
    showPage("eigenreserveringenlink");
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
    showPage("tekstReservering");
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
  connectButton("register1", register1);
  connectButton("login", login);
  connectButton("login1", login1);
  connectButton("delete", deleteTafel);
  connectButton("patch", wijzigTafel);
  connectButton("patch1", WijzigReservering);
  connectButton("reserveer", addReservering);
  connectButton("reserveringenlink", getReservations);
  connectButton("eigenreserveringenlink", getMyReservations);
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
