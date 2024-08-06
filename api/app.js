import express from "express"
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import testRoute from "./routes/test.route.js";
import cors from "cors"
import userRoute from "./routes/user.route.js"
import chatRoute from "./routes/chat.route.js"
import messageRoute from "./routes/message.route.js"
import { verifyToken } from "./middleware/verifyToken.js";
const app = express();

// to allow express accept json
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute); // path : /api/posts call postRoute
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);


app.listen(8800, () => {
    console.log("Server is running");
});