import { google } from "googleapis";

export const replyToEmail = (auth: any, threadId: any) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: "v1", auth });
        gmail.users.messages.send(
          {
            userId: "me",
            requestBody: {
              raw: encodeMessage(
                "sender@example.com",
                "Auto-reply",
                "Thank you for your email."
              ),
              threadId,
            },
          },
          (err: any, res: any) => {
            // Handle the response
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(res?.data);
            }
          }
        );
    })
};
const encodeMessage = (to: string, subject: string, message: string) => {
  const email = [
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    message,
  ].join("\r\n");

  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
