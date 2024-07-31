import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import conn from "./config/connectDB.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use("/api", router);


conn()
  .then(() => {
    app.listen(port, () => {
      console.log(`server running listen port ${port}`);
    });
  })
  .catch((error) => console.log("server error something", error));
