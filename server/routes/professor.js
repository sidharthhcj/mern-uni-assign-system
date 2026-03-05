const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

const router = express.Router();

// ── List submitted assignments for professor's department ───
router.get("/assignments", verifyToken, requireRole("PROFESSOR"), async (req, res) => {
    try {
        const professor = await User.findById(req.user.id);
        if (!professor || !professor.department) {
            return res.status(400).json({ message: "Professor department not assigned" });
        }

        const assignments = await Assignment.find({
            department: professor.department,
            status: { $in: ["SUBMITTED", "UNDER_REVIEW"] },
        })
            .populate("student", "name email")
            .populate("department", "name")
            .sort({ submittedAt: -1 });

        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── Review an assignment (approve → HOD  |  reject → student)
router.put("/assignment/:id/review", verifyToken, requireRole("PROFESSOR"), async (req, res) => {
    try {
        const { action, feedback } = req.body; // action: "approve" | "reject"

        if (!action || !["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
        }

        const professor = await User.findById(req.user.id);
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            department: professor.department,
            status: { $in: ["SUBMITTED", "UNDER_REVIEW"] },
        });

        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        assignment.reviewedBy = req.user.id;
        assignment.reviewedAt = new Date();
        assignment.professorFeedback = feedback || "";

        if (action === "approve") {
            assignment.status = "FORWARDED_TO_HOD";
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
