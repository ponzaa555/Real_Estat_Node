import express from "express"
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import testRoute from "./routes/test.route.js";
import cors from "cors"
const app = express();

// to allow express accept json
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoute); // path : /api/posts call postRoute
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);

app.listen(8800, () => {
    console.log("Server is running");
});