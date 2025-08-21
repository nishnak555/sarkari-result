import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
    } else {
      console.log("⚠️ Admin already exists!");
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedAdmin();
