//Importing project dependancies that we installed earlier
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import "src/overrides/bigint";
import initailRouter from "./modules/router";

//App Varaibles
dotenv.config();

//intializing the express app
const app = express();

//using the dependancies
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: false,
    tempFileDir: "/tmp/",
  })
);
initailRouter(app);

//exporting app
export default app;
