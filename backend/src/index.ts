import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OAuthRouter } from "./routes/OAuthRouter";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", OAuthRouter);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
