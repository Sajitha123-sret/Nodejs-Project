import { google } from "googleapis";

export const processEmails = (auth: any, messages:any) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: "v1", auth });
        messages.forEach((message: any) => {
          const { id } = message;
          gmail.users.threads.get(
            {
              userId: "me",
              id: message.threadId,
            },
            (err:any, res:any) => {
              if(err){
                console.log(err);
                reject(err);
               }else{
                resolve(res?.data);
               }
            }
          );
        });
    });
  }