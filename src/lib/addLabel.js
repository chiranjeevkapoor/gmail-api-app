const { google } = require("googleapis");

const addLabel = (auth, msgIds) => {
  const gmail = google.gmail({ version: "v1", auth });
  const hehe = gmail.users.messages.batchModify({
    userId: "me",
    resource: {
      ids: msgIds,
      addLabelIds: ["Label_6"],
    },
  });
  console.log(hehe);
};
module.exports = addLabel;
