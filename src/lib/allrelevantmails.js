// const { google } = require("googleapis");
// const fs = require("fs").promises;
// const path = require("path");
// const process = require("process");
// const { authenticate } = require("@google-cloud/local-auth");

// const TOKEN_PATH = path.join(process.cwd(), "token.json");
// const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

// const SCOPES = [
//   "https://www.googleapis.com/auth/gmail.compose",
//   "https://mail.google.com/",
// ];
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: "authorized_user",
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }
const { google } = require("googleapis");
const getmails = async (auth) => {
  const gmail = google.gmail({ version: "v1", auth });
  try {
    console.log("this func ran");
    const mails = await gmail.users.messages.list({
      userId: "me",
      q: `from:diveshkapoor2013@gmail.com AFTER:2023/07/09`,
    });
    console.log(mails.data.messages);
    return mails.data.messages;
  } catch (err) {
    console.err;
  }
};

// authorize().then(getmails).catch(console.error);

module.exports = getmails;
