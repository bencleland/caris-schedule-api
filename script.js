function doGet(e) {
  SpreadsheetApp.flush();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = e.parameter.sheet || "Current Meeting Room 1";
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return output([{ error: "Sheet not found: " + sheetName }]);
  }

  // Force formulas to settle
  SpreadsheetApp.flush();

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0];

  const rows = values
    .slice(1)
    .filter(row => row.some(cell => cell !== ""))
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      obj["_Last Updated"] = new Date().toLocaleTimeString();
      return obj;
    });

  return output(rows);
}

function output(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
