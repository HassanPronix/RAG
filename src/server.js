import express from "express";
import dotenv from "dotenv";

import uploadRouter from "./routes/upload.js";
import chatRouter from "./routes/chat.js";
dotenv.config();

const app = express();

app.use(express.json());

app.use("/upload", uploadRouter);
app.use("/chat", chatRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});