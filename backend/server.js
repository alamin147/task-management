import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import errorHandler from "./src/helpers/errorhandler.js";
import { routes } from "./src/routes/routes.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CLIENT_URI,"http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use("/api/v1", routes);

app.use("/", (req,res)=>{
  res.send({
    "name":"Welcome to project management",
    "message":"Server is running"
  })
});
// error handler middleware
app.use(errorHandler);


const server = async () => {
  try {
    await connect();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to strt server.....", error.message);
    process.exit(1);
  }
};

server();
