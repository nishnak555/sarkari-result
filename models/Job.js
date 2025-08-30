const mongoose = require("mongoose");

// Category-wise distribution schema
const categoryWiseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS", "Other"],
      required: true,
    },
    count: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Any"], default: "Any" },
    state: { type: String }, // optional
  },
  { _id: false }
);

// Vacancy schema (per post)
const vacancySchema = new mongoose.Schema(
  {
    postName: { type: String, required: true },
    count: { type: Number, required: true },
    eligibility: {
      education: { type: String },
      ageLimit: { min: { type: Number }, max: { type: Number } },
      relaxation: { type: String },
    },
    categoryWise: [categoryWiseSchema],
  },
  { _id: false }
);

// Selection process schema
const selectionProcessSchema = new mongoose.Schema(
  {
    step: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

// Main Job schema
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String },
    category: {
      type: String,
      enum: ["Job", "Result", "Answer Key"],
      default: "Job",
    },
    totalVacancies: { type: Number, required: true },
    vacancies: [vacancySchema],
    importantDates: {
      startDate: { type: Date },
      endDate: { type: Date },
      examDate: { type: Date },
      resultDate: { type: Date },
    },
    applicationFee: {
      general: { type: Number, default: 0 },
      obc: { type: Number, default: 0 },
      sc: { type: Number, default: 0 },
      st: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
    },
    importantLinks: { type: Object },
    selectionProcess: [selectionProcessSchema],
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },

    // ✅ Language field
    language: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
      required: true, // ✅ now mandatory
    },
  },
  { timestamps: true }
);

// ✅ Index on language for fast filtering
jobSchema.index({ language: 1 });

module.exports = mongoose.model("Job", jobSchema);
