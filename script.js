// Determine which room we are displaying
const params = new URLSearchParams(window.location.search);
const sheet = params.get("sheet") || "Current Meeting Room 1";

// Background image mapping
const backgrounds = {
  "Current Meeting Room 1": "MEETING ROOM 1.png",
  "Current Meeting Room 2": "MEETING ROOM 2.png",
  "Current Meeting Room 3": "MEETING ROOM 3.png",
  "Current Pod 1": "POD 1.png",
  "Current Pod 2": "POD 2.png"
};

// Apply background
if (backgrounds[sheet]) {
  document.body.style.backgroundImage =
    `url("${backgrounds[sheet]}")`;
}

// Your Netlify API URL
const apiUrl =
  "https://bespoke-crepe-e34f23.netlify.app/.netlify/functions/schedule?sheet=" +
  encodeURIComponent(sheet);

// Load meeting data
async function loadData() {
  try {
    const response = await fetch(apiUrl + "&t=" + Date.now());
    const data = await response.json();

    if (!data || !data.length) return;

    const room = data[0];

    document.getElementById("meetingTitle").innerText =
      room["Meeting Title"] || "";

    document.getElementById("guestAttendees").innerText =
      room["Guest Attendees"] || "";

    document.getElementById("carisAttendees").innerText =
      room["Caris Attendees"] || "";

    document.getElementById("nextTime").innerText =
      room["Next Meeting Start Display"] || "";

    document.getElementById("nextTitle").innerText =
      room["Next Meeting Title"] || "";

    if (room["Status Image"]) {
      document.getElementById("statusImage").src =
        room["Status Image"];
    }
  }
  catch (err) {
    console.log(err);
  }
}

// Live clock
function updateClock() {
  const now = new Date();

  document.getElementById("clockTime").innerText =
    now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });

  document.getElementById("clockDate").innerText =
    now.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
}

// Initial load
loadData();
updateClock();

// Refresh data every 15 seconds
setInterval(loadData, 15000);

// Refresh clock every second
setInterval(updateClock, 1000);
