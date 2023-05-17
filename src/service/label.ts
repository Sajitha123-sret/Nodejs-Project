import { google } from "googleapis";

export const labelEmail=(auth: any, messageId:any)=> {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: "v1", auth });
    gmail.users.messages.modify(
      {
        userId: "me",
        id: messageId,
        requestBody: {
          addLabelIds: ["Label_1"],
        },
      },
      (err: any, res:any) => {
        // Handle the response
        if(err){
          console.log(err);
          reject(err);
         }else{
          resolve(res?.data);
         }
      }
    );
    })
  }