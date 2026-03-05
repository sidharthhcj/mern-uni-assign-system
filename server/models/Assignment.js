const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        filePath: { type: String, default: "" },
        status: {
            type: String,
            enum: [
                "DRAFT",
                "SUBMITTED",
                "UNDER_REVIEW",
                "FORWARDED_TO_HOD",
                "APPROVED",
                "REJECTED",
            ],
            default: "DRAFT",
        },
        professorFeedback: { type: String, default: "" },
        hodFeedback: { type: String, default: "" },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        submittedAt: Date,
        reviewedAt: Date,
        approvedAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
