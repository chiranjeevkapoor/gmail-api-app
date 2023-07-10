const { google } = require("googleapis");

const createLabel = async (auth) => {
  try {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.labels.create({
      userId: "me",
      resource: {
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
        name: "Vacationss",
      },
    });

    // console.log(res);
  } catch (error) {
    console.log(error);
    return;
  }
};
module.exports = createLabel;
