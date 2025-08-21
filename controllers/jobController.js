const Job = require("../models/Job");
const { successResponse, errorResponse } = require("../utils/response");

// ✅ Create a new Job
exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    return successResponse(res, job, "Job created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Get all Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return successResponse(res, jobs, "Jobs fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Get Single Job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return errorResponse(res, "Job not found", 404);
    return successResponse(res, job, "Job fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return errorResponse(res, "Job not found", 404);
    return successResponse(res, job, "Job updated successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return errorResponse(res, "Job not found", 404);
    return successResponse(res, null, "Job deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
