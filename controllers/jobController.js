const Job = require("../models/Job");
const { successResponse, errorResponse } = require("../utils/response");
const { franc } = require("franc"); // use franc for language detection
const mongoose = require("mongoose");


// ✅ Create a new Job
exports.createJob = async (req, res) => {
  try {
    const { title, description, language } = req.body;

    // Validate language field
    // if (!language || !["en", "hi"].includes(language)) {
    //   return errorResponse(
    //     res,
    //     "Language is required and must be 'en' or 'hi'"
    //   );
    // }

    // // Validate content language using description
    // if (description && description.length > 10) {
    //   const detectedLang = franc(description, { minLength: 10 });

    //   if (
    //     (language === "hi" && detectedLang !== "hin") ||
    //     (language === "en" && detectedLang !== "eng")
    //   ) {
    //     return errorResponse(
    //       res,
    //       `Payload content does not match language '${language}'`
    //     );
    //   }
    // }

    const job = new Job(req.body);
    await job.save();

    return successResponse(res, job, "Job created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ✅ Get all Jobs (Load More for web OR Page/Limit for admin OR All when no query)
exports.getJobs = async (req, res) => {
  try {
    const { lang, lastId, page, limit } = req.query;
    const defaultWebLimit = 20; // first 20 jobs for web portal
    let jobs, total, hasMore;

    // ---------------------------------
    // 🔹 Web Portal - Load More or First 20
    // ---------------------------------
    if (lastId !== undefined || lastId === "0" || !page) {
      const query = {};
      if (lang) query.language = lang;
      if (lastId && lastId !== "0") {
        query._id = { $lt: new mongoose.Types.ObjectId(lastId) };
      }

      const pageLimit = defaultWebLimit;

      // fetch jobs
      jobs = await Job.find(query).sort({ _id: -1 }).limit(pageLimit);

      // check if more jobs exist
      const nextJob = await Job.findOne({
        ...query,
        _id: { $lt: jobs.length > 0 ? jobs[jobs.length - 1]._id : "0" },
      });
      hasMore = !!nextJob;

      return successResponse(
        res,
        { jobs, hasMore },
        "Jobs fetched successfully"
      );
    }

    // ---------------------------------
    // 🔹 Admin Panel - Page/Limit Pagination
    // ---------------------------------
    if (page) {
      const pageLimit = Number(limit) || 10;
      const query = {};
      if (lang) query.language = lang;

      total = await Job.countDocuments(query);

      jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageLimit)
        .limit(pageLimit);

      return successResponse(
        res,
        {
          jobs,
          pagination: {
            total,
            page: Number(page),
            limit: pageLimit,
            totalPages: Math.ceil(total / pageLimit),
          },
        },
        "Jobs fetched successfully"
      );
    }

    // ---------------------------------
    // 🔹 Default: No query params → return all jobs
    // ---------------------------------
    jobs = await Job.find().sort({ createdAt: -1 });
    return successResponse(res, jobs, "All jobs fetched successfully");
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
