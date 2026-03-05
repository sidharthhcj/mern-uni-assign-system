const express = require("express");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const User = require("../models/User");
const Department = require("../models/Department");
const Assignment = require("../models/Assignment");

const router = express.Router();

// ── Dashboard ───────────────────────────────────────────────
router.get("/dashboard", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const usersCount = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    res.json({ totalDepartments, totalAssignments, usersCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── Department CRUD ─────────────────────────────────────────
router.get("/departments", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/department", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Department name is required" });

    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: "Department already exists" });

    const dept = await Department.create({ name });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/department/:id", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── User CRUD ───────────────────────────────────────────────
router.get("/users", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("department", "name")
      .sort({ role: 1, name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/user", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (["STUDENT", "PROFESSOR", "HOD"].includes(role) && !department) {
      return res.status(400).json({ message: "Department is required for this role" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: department || undefined,
    });

    const populated = await User.findById(user._id)
      .select("-password")
      .populate("department", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/user/:id", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
