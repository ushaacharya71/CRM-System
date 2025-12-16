// =========================================
// GLOWLOGICS CRM SEED FILE
// Creates: Admin, Employee, Intern
// =========================================
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

// ✅ Load environment variables
dotenv.config({ path: "./.env" });

// ✅ Read from .env
const MONGO_URI = process.env.MONGO_URI;
const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@glowcrm.com";
const adminPass = process.env.SEED_ADMIN_PASS || "Admin@123";

// ✅ Default users
const usersToSeed = [
  {
    name: "Super Admin",
    email: adminEmail.toLowerCase(),
    password: adminPass,
    role: "admin",
    joiningDate: new Date(),
  },
  {
    name: "Riya Singh",
    email: "riya@glowcrm.com",
    password: "Riya@123",
    phone: "9876543210",
    role: "employee",
    position: "Frontend Developer",
    joiningDate: new Date(),
  },
  {
    name: "Aman Kumar",
    email: "aman@glowcrm.com",
    password: "Aman@123",
    phone: "9998887770",
    role: "intern",
    teamName: "Frontend Team",
    joiningDate: new Date(),
  },
];

const seedDatabase = async () => {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI not found in .env file");
      process.exit(1);
    }

    console.log("🌐 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    for (const userData of usersToSeed) {
      const existing = await User.findOne({ email: userData.email.toLowerCase() });
      if (existing) {
        console.log(`⚠️ ${userData.role.toUpperCase()} already exists: ${userData.email}`);
      } else {
        const newUser = new User(userData);
        await newUser.save();
        console.log(`🎉 Created ${userData.role.toUpperCase()}: ${userData.email}`);
      }
    }

    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error while seeding:", err.message);
    process.exit(1);
  }
};

seedDatabase();
