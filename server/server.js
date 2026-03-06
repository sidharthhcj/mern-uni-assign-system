require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ── Middlewares ──────────────────────────────────────────────
// ── Middlewares ──────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mern-uni-assign-system.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Database ────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ── Routes ──────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Server is alive");
});

app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));
app.use("/student", require("./routes/student"));
app.use("/professor", require("./routes/professor"));
app.use("/hod", require("./routes/hod"));

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
