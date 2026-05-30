exports.handler = async function (event) {
  const sheet = event.queryStringParameters.sheet || "Current Meeting Room 1";

  const spreadsheetId = "1QEdkWr1mpMknGWdXVJGjrYqom1KZ4x2qIwyqiarBC_8";

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/" +
    spreadsheetId +
    "/gviz/tq?tqx=out:csv&sheet=" +
    encodeURIComponent(sheet) +
    "&t=" +
    Date.now();

  const response = await fetch(csvUrl, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  const csv = await response.text();
  const rows = parseCSV(csv);

  if (rows.length < 2) {
    return respond([]);
  }

  const headers = rows[0];
  const data = rows.slice(1)
    .filter(row => row.some(cell => cell !== ""))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      return obj;
    });

  return respond(data);
};

function respond(data) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (cell || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
      if (char === "\r" && next === "\n") i++;
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}
