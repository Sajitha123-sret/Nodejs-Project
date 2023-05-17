import express, { Response, Application, Request } from "express";
import cors from "cors";
import { createServer } from "http";
import corsOptions from "../utils/cors.utils";
import bodyParser from "body-parser";
import { allServices } from "../service/appService";

export const app: Application = express();
const port = process.env.port || 3000;
export const httpServer = createServer(app);

//For avoiding cors error
app.use(cors(corsOptions));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

//Using in json format
app.use(bodyParser.json());

app.get("/oauth2callback",  (req: Request, res: Response) => {
  const mailData: string = 'sajithasret@gmail.com';
  allServices(req, res, mailData);
  console.log("Entered email is : " , mailData);
});

httpServer.listen(port, () => console.log(`server running on port ${port}`));
