const { google } = require("googleapis");

const getMsgDetails = async (auth, msgId) => {
  try {
    // console.log(msgId);
    const gmail = google.gmail({ version: "v1", auth });
    const allDetails = await gmail.users.messages.get({
      userId: "me",
      id: msgId,
    });
    // console.log(allDetails);
    // const obj = allDetails.data;

    // console.log(allDetails.payload);

    const new_obj = {};
    // const sendTo = allDetails.data.payload.headers[1].value;
    // subject = allDetails.data.payload.headers[3].value;

    const toval = allDetails.data.payload.headers.find(
      (obj) => obj["name"] == "To"
    );
    const subval = allDetails.data.payload.headers.find(
      (obj) => obj["name"] == "Subject"
    );
    // console.log(allDetails.data.payload.headers);
    const emailRegex = /<([^>]+)>/;
    // console.log(toval.value.match(emailRegex));
    console.log(toval);
    // console.log(subval);
    new_obj.sendTo = toval.value.match(emailRegex)[1];
    new_obj.subject = subval.value;
    // console.log(new_obj);
    // console.log(allDetails.data.payload.headers[1]);
    return new_obj;
  } catch (err) {
    console.log(err);
  }
};
// authorize().then(getMsgDetails).catch(console.error);

module.exports = getMsgDetails;
