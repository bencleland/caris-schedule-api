function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const requestedSheet = e.parameter.sheet || "Current Meeting Room 1";

  // Glance tabs can still be read directly
  if (requestedSheet.startsWith("Glance")) {
    return output(readSheetAsRows(ss, requestedSheet));
  }

  // Convert Current tab names to room names
  const roomName = requestedSheet
    .replace("Current ", "")
    .trim();

  const sheet = ss.getSheetByName("Sheet1");
  const values = sheet.getDataRange().getValues();
  const displayValues = sheet.getDataRange().getDisplayValues();

  const headers = displayValues[0];
  const now = new Date();

  let activeRow = null;

  for (let i = 1; i < values.length; i++) {
    const rowRoom = String(values[i][0]).trim(); // Column A
    const start = values[i][1];                 // Column B
    const end = values[i][2];                   // Column C

    if (
      rowRoom === roomName &&
      start instanceof Date &&
      end instanceof Date &&
      now >= start &&
      now < end
    ) {
      activeRow = displayValues[i];
      break;
    }
  }

  if (!activeRow) {
    return output([{
      "Room Name": roomName,
      "Meeting Title": "Available",
      "Guest Attendees": "",
      "Caris Attendees": "",
      "Next Meeting Start Display": "",
      "Next Meeting Title": "",
      "Status Image": ""
    }]);
  }

  const obj = {};
  headers.forEach((header, i) => {
    obj[header] = activeRow[i] || "";
  });

  obj["_Updated"] = new Date().toLocaleTimeString();

  return output([obj]);
}

function readSheetAsRows(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [{ error: "Sheet not found: " + sheetName }];

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0];

  return values.slice(1)
    .filter(row => row.some(cell => cell !== ""))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      return obj;
    });
}

function output(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
