exports.handler = async function (event) {
  const sheet = event.queryStringParameters.sheet || "Current Meeting Room 1";

  const scriptUrl =
    "https://script.google.com/macros/s/AKfycbwl795C9PEaQE6JViLFU-sqCCLrjl9_j6_SRViPpB_BYaWj3woYitD6iBW4tshx2Vi4/exec?sheet=" +
    encodeURIComponent(sheet) +
    "&t=" +
    Date.now();

  const response = await fetch(scriptUrl, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  const data = await response.json();
  const body = Array.isArray(data) ? data : [data.result || data];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
};
