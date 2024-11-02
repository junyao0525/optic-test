//Importing project dependancies that we installed earlier
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

//App Varaibles
dotenv.config();

//intializing the express app
const app = express();

//using the dependancies
app.use(helmet());
app.use(cors());
app.use(express.json());

//exporting app
export default app;
