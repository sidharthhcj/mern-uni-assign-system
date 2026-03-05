require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminExists = await User.findOne({
    email: "admin@university.com"
  });

  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  await User.create({
    name: "Admin",
    email: "admin@university.com",
    password: hashedPassword,
    role: "ADMIN"
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();
