const params = new URLSearchParams(window.location.search);
const sheetName = params.get('sheet') || 'Current Pod 1';
const scheduleSheet = params.get('schedule') || sheetName.replace('Current', 'Glance');
const refreshSeconds = Number(params.get('refresh') || 15);
const API_URL = `/.netlify/functions/schedule?sheet=${encodeURIComponent(sheetName)}`;

const els = {
  roomTitle: document.getElementById('room-title'),
  meetingTitle: document.getElementById('meeting-title'),
  guestLabel: document.getElementById('guest-label'),
  guest: document.getElementById('guest-attendees'),
  caris: document.getElementById('caris-attendees'),
  status: document.getElementById('status-image'),
  nextTime: document.getElementById('next-time'),
  nextTitle: document.getElementById('next-title'),
  scheduleButton: document.getElementById('schedule-button'),
  clock: document.getElementById('clock'),
  date: document.getElementById('date')
};

function roomDisplayName(room) {
  if (!room) return 'Meeting Room';
  if (/^Pod\s+\d+/i.test(room)) return `Meeting ${room.replace(/Pod/i, 'Pod #')}`;
  return room.replace(/Meeting Room (\d+)/i, 'Meeting Room #$1');
}

function normalizeMultiline(text) {
  return (text || '').replace(/,\s*/g, '\n').trim() || '—';
}

async function loadData() {
  try {
    const res = await fetch(`${API_URL}&_=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : (data.result || data);
    if (!row) throw new Error('No row returned');

    const room = row['Room Name'] || sheetName.replace('Current ', '');
    els.roomTitle.textContent = roomDisplayName(room);
    els.meetingTitle.textContent = row['Meeting Title'] ? `Meeting with ${row['Meeting Title']}` : 'Available';

    const guest = row['Guest Attendees'] || row['Host'] || '';
    els.guestLabel.textContent = row['Host'] ? 'Host' : 'Guest Attendees';
    els.guest.textContent = normalizeMultiline(guest);
    els.caris.textContent = normalizeMultiline(row['Caris Attendees']);

    const statusUrl = row['Status Image'];
    if (statusUrl) {
      els.status.src = statusUrl;
      els.status.style.display = 'block';
    } else {
      els.status.style.display = 'none';
    }

    const nextStart = row['Next Meeting Start Display'] || row['Next Meeting Start'] || '';
    const nextEnd = row['Next Meeting End Display'] || row['Next Meeting End'] || '';
    els.nextTime.textContent = nextEnd ? `${nextStart} - ${nextEnd}` : nextStart || '—';
    els.nextTitle.textContent = row['Next Meeting Title'] ? `Meeting with\n${row['Next Meeting Title']}` : '—';
    els.scheduleButton.href = `glance.html?sheet=${encodeURIComponent(scheduleSheet)}`;
  } catch (err) {
    console.error(err);
    els.meetingTitle.textContent = 'Data unavailable';
    els.meetingTitle.classList.add('error');
  }
}

function updateClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  els.date.textContent = now.toLocaleDateString([], { weekday: 'long', month: '2-digit', day: '2-digit', year: 'numeric' });
}

updateClock();
loadData();
setInterval(updateClock, 1000);
setInterval(loadData, refreshSeconds * 1000);
