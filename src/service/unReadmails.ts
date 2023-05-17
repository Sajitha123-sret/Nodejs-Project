import { google } from "googleapis";
import { oauth2Client } from "../utils/clientCredentials";

export const getUnreadEmails = (auth: any, email: string) => {
  return new Promise((resolve, reject) => {
    oauth2Client.setCredentials(auth.credentials);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    gmail.users.messages.list(
      {
        userId: "me",
        q: `is:unread to:${email}`,
      },
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(res?.data.messages);
        }
      }
    );
  });
};

