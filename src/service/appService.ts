import { Request, Response } from "express";
import { google } from "googleapis";
import {
  INTERVAL_MIN,
  INTERVAL_MAX,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  SCOPEDATA,
  ACCESS_TYPES,
} from "../utils/variables";
import { getUnreadEmails } from "../service/unReadmails";
import { oauth2Client } from "../utils/clientCredentials";
import { processEmails } from "./processEmails";
import { replyToEmail } from "./reply";
import { labelEmail } from "./label";

export const allServices = (req: Request, res: Response, mailData: string) => {
  const SCOPES = [SCOPEDATA];

  //To set credentials for authentication
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
    access_token: ACCESS_TOKEN,
  });

  //To access the authentication
  const authenticate = () => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: ACCESS_TYPES,
      scope: SCOPES,
    });

    //Ask the user to visit the authorization URL and enter the code
    console.log(`Authorize this app by visiting this URL: ${authUrl}`);
  };

  //To set the interval for a function
  const startAutoresponder =(auth: any, email: string) => {
    setInterval(() => {
      getUnreadEmails(auth, email);
    }, getRandomInterval());
  }

  //Setting the interval with min and max time
  const getRandomInterval =() => {
    console.log("running at random interval");
    return (
      Math.floor(Math.random() * (INTERVAL_MAX - INTERVAL_MIN + 1)) +
      INTERVAL_MIN
    );
  }
  //Main function
  const main = async () => {
    //Perform Authentication
    authenticate();
    //Identify unread mails
    const allMails = await getUnreadEmails(oauth2Client, mailData);
    console.log("all mails", allMails);
    //Process the unread mails
    const processData: any = await processEmails(oauth2Client, allMails); //insted of any type i can improve the code by declaring the interface
    console.log("processed data", processData);
    //print the threadId
    const allThreads = processData.messages.map((item: any) => {//insted of any type i can improve the code by declaring the interface
      return item.threadId;
    });
    console.log("Threads", allThreads);
    //print the unique threadId
    const uniqueThreads = [...new Set(allThreads)];
    console.log("Unique Threads:", uniqueThreads);
    //Automate the reply to the mail
    const replyData: any = await replyToEmail(oauth2Client, uniqueThreads); 
    console.log("messaage sent", replyData);
    //Add Label to the mail
    const messageId = replyData.id;
    const addLabel = await labelEmail(oauth2Client, messageId);
    console.log("Label added", addLabel);
    //Call the timer function
    startAutoresponder(oauth2Client, mailData);
  };

  main();
};
