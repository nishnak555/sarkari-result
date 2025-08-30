const Job = require("../models/Job");
const { successResponse, errorResponse } = require("../utils/response");
const { franc } = require("franc"); // use franc for language detection

// ✅ Create a new Job
exports.createJob = async (req, res) => {
  try {
    const { title, description, language } = req.body;

    // Validate language field
    if (!language || !["en", "hi"].includes(language)) {
      return errorResponse(
        res,
        "Language is required and must be 'en' or 'hi'"
      );
    }

    // Validate content language using description
    if (description && description.length > 10) {
      const detectedLang = franc(description, { minLength: 10 });

      if (
        (language === "hi" && detectedLang !== "hin") ||
        (language === "en" && detectedLang !== "eng")
      ) {
        return errorResponse(
          res,
          `Payload content does not match language '${language}'`
        );
      }
    }

    const job = new Job(req.body);
    await job.save();

    return successResponse(res, job, "Job created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Get all Jobs (optionally filter by language)
exports.getJobs = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // default English
    console.log(req.query,'language')
    const jobs = await Job.find({ language: lang }).sort({ createdAt: -1 });
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

// ✅ Update Job with language validation
exports.updateJob = async (req, res) => {
  try {
    const { title, description, language } = req.body;

    // Validate language if provided
    if (language && !["en", "hi"].includes(language)) {
      return errorResponse(res, "Language must be 'en' or 'hi'");
    }

    // Validate content language if description is present
    if (description && description.length > 10 && language) {
      const detectedLang = franc(description, { minLength: 10 });
      if (
        (language === "hi" && detectedLang !== "hin") ||
        (language === "en" && detectedLang !== "eng")
      ) {
        return errorResponse(
          res,
          `Payload content does not match language '${language}'`
        );
      }
    }

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
