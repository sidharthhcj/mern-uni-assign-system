const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

const router = express.Router();

// ── List forwarded assignments for HOD's department ─────────
router.get("/assignments", verifyToken, requireRole("HOD"), async (req, res) => {
    try {
        const hod = await User.findById(req.user.id);
        if (!hod || !hod.department) {
            return res.status(400).json({ message: "HOD department not assigned" });
        }

        const assignments = await Assignment.find({
            department: hod.department,
            status: "FORWARDED_TO_HOD",
        })
            .populate("student", "name email")
            .populate("department", "name")
            .populate("reviewedBy", "name")
            .sort({ reviewedAt: -1 });

        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── Final review (approve ✅  |  reject → student) ─────────
router.put("/assignment/:id/review", verifyToken, requireRole("HOD"), async (req, res) => {
    try {
        const { action, feedback } = req.body; // action: "approve" | "reject"

        if (!action || !["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
        }

        const hod = await User.findById(req.user.id);
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            department: hod.department,
            status: "FORWARDED_TO_HOD",
        });

        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        assignment.approvedBy = req.user.id;
        assignment.hodFeedback = feedback || "";

        if (action === "approve") {
            assignment.status = "APPROVED";
            assignment.approvedAt = new Date();
        } else {
            assignment.status = "REJECTED";
        }

        await assignment.save();
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
