import express from "express";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
dotenv.config();
const port = process.env.PORT || 8000;
import auth from "./auth.js";
import cors from "cors";
app.use(cors());

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());
app.use("/api/auth", authRoutes);

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

app.listen(port, () => {
  dbConnect();
  console.log(`Server is running on port ${port}`);
});
