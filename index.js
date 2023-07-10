const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const getMsgDetails = require("./src/lib/getMsgDetails");
const { getmails } = require("./src/lib/allrelevantmails");
const allrelevantmails = require("./src/lib/allrelevantmails");
const sendReply = require("./src/lib/sendreply");
const createLabel = require("./src/lib/createLabel");
const addLabel = require("./src/lib/addLabel");

// If modifying these scopes, delete token.json.
// const SCOPES = [
//   "https://www.googleapis.com/auth/gmail.readonly",
//   "https://www.googleapis.com/auth/gmail.send",
// ];
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.compose",
  "https://mail.google.com/",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  google.options({ client });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  // const gmail = google.gmail("v1");
  const gmail = google.gmail({ version: "v1", auth });

  const hehe = await gmail.users.messages.batchModify({
    userId: "me",
    resource: {
      ids: ["1893a2b334cf498a"],
      addLabelIds: ["Label_1"],
    },
  });
  console.log(hehe);

  // const rest = await gmail.users.labels.create({
  //   userId: "me",
  //   resource: {
  //     labelListVisibility: "labelShow",
  //     messageListVisibility: "show",
  //     name: "Vacation",
  //   },
  // });
  // console.log(rest);

  const res = await gmail.users.labels.list({
    userId: "me",
  });
  //   const hi = await gmail.users.messages.list({
  //     userId: "me",
  //   });
  //   const mem = hi.data.messages;
  //   console.log(mem);
  //reply email is working here
  const econtent =
    "To:chiranjeevk007@gmail.com\nSubject:yoyoyoyoyo\n\nhelo im under the water hooooo";
  const base64string = Buffer.from(econtent).toString("base64");
  console.log(base64string);

  const mail = await gmail.users.messages.send({
    userId: "me",
    resource: {
      // raw: "VG86IGNoaXJhbmplZXZrMDA3QGdtYWlsLmNvbQpGcm9tOiBrYXBvb3JjaGlyYW5qZWV2QGdtYWlsLmNvbQpTdWJqZWN0OiBBdXRvbWF0ZWQgZHJhZnQKCg==",
      raw: base64string,
      threadId: "1893a2b334cf498a",
    },
  });
  console.log(mail);
  //   const econtent = {
  //     To: "chiranjeevk007@gmail.com",
  //     Subject: "this is the subject of out email",
  //     body: "helo im under the water hooooo",
  //   };
  // const base64string = Buffer.from(econtent).toString("base64url");
  // console.log(mail.data);

  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }
  console.log("Labels:");
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

async function myfunc(auth) {
  // const gmail = google.gmail({ version: "v1", auth });

  try {
    const resp = await getmails(auth);

    console.log(resp);
  } catch (err) {
    console.err;
  }
}

// authorize().then(listLabels).catch(console.error);

const mainfn = async () => {
  console.log("startttt");
  const res = await authorize();
  // const hell = await listLabels(res);

  const relevantmails = await allrelevantmails(res);
  // console.log(relevantmails);
  const details = async (relevantmails) => {
    try {
      const arr = [];

      for (i = 0; i < relevantmails.length; i++) {
        const hi = await getMsgDetails(res, relevantmails[i].id);
        arr.push(hi);
      }
      return arr;
    } catch (err) {
      console.error;
    }
  };
  const relevantMailslist = await details(relevantmails);

  // console.log(relevantMailslist);

  const replyFunc = async (relevantMailslist) => {
    try {
      for (i = 0; i < relevantMailslist.length; i++) {
        const sen = await sendReply(
          res,
          relevantmails[i].threadId,
          relevantMailslist[i]
        );
        console.log(sen);
      }
    } catch (error) {
      console.error;
    }
  };
  await replyFunc(relevantMailslist);

  const lbl = await createLabel(res);

  const addLbl = async () => {
    try {
      for (i = 0; i < relevantMailslist.length; i++) {
        await addLabel(res, relevantmails[i].id);
      }
    } catch (error) {
      console.error;
    }
  };
  await addLbl();

  // const det = await getMsgDetails(res, "1893a2b334cf498a");
};
// authorize().then(myfunc).catch(console.error);
// console.log(authorize());
// const ans = authorize();

// console.log(ans.then(listLabels).catch(console.error));
// mainfn();
// var delay = Math.floor(Math.random() * (120 - 45 + 1) + 45);
setInterval(mainfn, 120000);
