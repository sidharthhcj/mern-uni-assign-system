const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/upload");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

const router = express.Router();

// ── Get my assignments ──────────────────────────────────────
router.get("/assignments", verifyToken, requireRole("STUDENT"), async (req, res) => {
    try {
        const assignments = await Assignment.find({ student: req.user.id })
            .populate("department", "name")
            .populate("reviewedBy", "name")
            .populate("approvedBy", "name")
            .sort({ updatedAt: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── Upload new assignment (DRAFT) ───────────────────────────
router.post(
    "/assignment",
    verifyToken,
    requireRole("STUDENT"),
    upload.single("file"),
    async (req, res) => {
        try {
            const { title, description } = req.body;
            if (!title) return res.status(400).json({ message: "Title is required" });

            const student = await User.findById(req.user.id);
            if (!student || !student.department) {
                return res.status(400).json({ message: "Student department not assigned" });
            }

            const assignment = await Assignment.create({
                title,
                description: description || "",
                student: req.user.id,
                department: student.department,
                filePath: req.file ? req.file.filename : "",
                status: "DRAFT",
            });

            res.status(201).json(assignment);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }
);

// ── Submit a draft assignment ───────────────────────────────
router.put("/assignment/:id/submit", verifyToken, requireRole("STUDENT"), async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            student: req.user.id,
        });

        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        if (assignment.status !== "DRAFT") {
            return res.status(400).json({ message: "Only DRAFT assignments can be submitted" });
        }

        if (!assignment.filePath) {
            return res.status(400).json({ message: "Please upload a file before submitting" });
        }

        assignment.status = "SUBMITTED";
        assignment.submittedAt = new Date();
        await assignment.save();

        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ── Resubmit a rejected assignment ──────────────────────────
router.put(
    "/assignment/:id/resubmit",
    verifyToken,
    requireRole("STUDENT"),
    upload.single("file"),
    async (req, res) => {
        try {
            const assignment = await Assignment.findOne({
                _id: req.params.id,
                student: req.user.id,
            });

            if (!assignment) return res.status(404).json({ message: "Assignment not found" });

            if (assignment.status !== "REJECTED") {
                return res.status(400).json({ message: "Only REJECTED assignments can be resubmitted" });
            }

            if (req.file) {
                assignment.filePath = req.file.filename;
            }
            if (req.body.description) {
                assignment.description = req.body.description;
            }

            assignment.status = "SUBMITTED";
            assignment.submittedAt = new Date();
            assignment.professorFeedback = "";
            assignment.hodFeedback = "";
            assignment.reviewedBy = undefined;
            assignment.approvedBy = undefined;
            assignment.reviewedAt = undefined;
            assignment.approvedAt = undefined;
            await assignment.save();

            res.json(assignment);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }
);

module.exports = router;
