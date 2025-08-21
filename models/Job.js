const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    state: { type: String }, // e.g. "Uttar Pradesh", "Delhi"
    gender: { type: String, enum: ["Male", "Female", "Any"], default: "Any" },
    count: { type: Number, required: true },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "UP Police Constable Recruitment 2025"
    description: { type: String, required: true }, // full details of job
    department: { type: String }, // e.g. "Police Department"
    category: {
      type: String,
      enum: ["Job", "Result", "Answer Key"],
      default: "Job",
    },

    totalVacancies: { type: Number, required: true }, // total seats
    vacancies: [vacancySchema], // detailed state/gender wise vacancies

    eligibility: {
      education: { type: String }, // e.g. "10th Pass, Graduation"
      ageLimit: {
        min: { type: Number, required: true }, // min age
        max: { type: Number, required: true }, // max age
      },
      relaxation: { type: String }, // e.g. "OBC - 3 years, SC/ST - 5 years"
    },

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

    officialNotificationUrl: { type: String }, // PDF Link
    applyOnlineUrl: { type: String }, // Application Link
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },

    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who created
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
