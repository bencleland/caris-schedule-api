const params = new URLSearchParams(window.location.search);
const sheetName = params.get('sheet') || 'Glance Meeting Room 1';
const refreshSeconds = Number(params.get('refresh') || 30);
const API_URL = `/.netlify/functions/schedule?sheet=${encodeURIComponent(sheetName)}`;
const title = document.getElementById('page-title');
const sat = document.getElementById('sat');
const sun = document.getElementById('sun');
const mon = document.getElementById('mon');

function titleFromSheet(name){ return name.replace(/^Glance\s+/,'').toUpperCase() + ' SCHEDULE'; }
function value(row, names){ for (const n of names) if (row[n]) return row[n]; return ''; }
async function loadGlance(){
  try{
    const res = await fetch(`${API_URL}&_=${Date.now()}`, { cache:'no-store' });
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : (data.result || data);
    title.textContent = titleFromSheet(sheetName);
    sat.textContent = value(row, ['Saturday List','Sat List','Saturday','Sat']) || '—';
    sun.textContent = value(row, ['Sunday List','Sun List','Sunday','Sun']) || '—';
    mon.textContent = value(row, ['Monday List','Mon List','Monday','Mon']) || '—';
  } catch(e){
    console.error(e); sat.textContent = 'Data unavailable'; sat.classList.add('error');
  }
}
loadGlance(); setInterval(loadGlance, refreshSeconds*1000);
