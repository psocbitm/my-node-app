import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

//register route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//login route with error handling
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    !user && res.status(404).json("User not found");
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("Wrong password");
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).send({
      message: "Login Successful",
      email: user.email,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
