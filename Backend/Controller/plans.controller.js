
const mongoose = require("mongoose");
const Plan = require("../Model/plans.model");

// Helper: validate MongoDB ObjectId
const isValidId = (id) => mongoose.isValidObjectId(id);

// PUBLIC: LIST ACTIVE PLANS
// GET /
exports.listActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .select("-__v")
      .sort({ sortOrder: 1, price: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: plans.length,
      plans,
    });
  } catch (error) {
    console.error("List active plans error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
};

// PUBLIC: GET SINGLE ACTIVE PLAN
// GET /:planId
exports.getActivePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!isValidId(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const plan = await Plan.findOne({
      _id: planId,
      isActive: true,
    }).lean();

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Active plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Get active plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
    });
  }
};

// CREATE PLAN
// POST /
exports.createPlan = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      price,
      currency,
      interval,
      limits,
      features,
      isActive,
      sortOrder,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof code !== "string" ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Plan name and code are required",
      });
    }

    if (price === undefined || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    const normalizedCode = code.trim().toLowerCase();

    if (!/^[a-z0-9_-]+$/.test(normalizedCode)) {
      return res.status(400).json({
        success: false,
        message: "Plan code can contain only letters, numbers, _ and -",
      });
    }

    if (
      currency !== undefined &&
      (typeof currency !== "string" ||
        !/^[A-Za-z]{3}$/.test(currency.trim()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Currency must be a 3-letter code",
      });
    }

    if (
      interval !== undefined &&
      !["month", "year", "lifetime"].includes(interval)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing interval",
      });
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    if (
      features !== undefined &&
      (!Array.isArray(features) ||
        !features.every((feature) => typeof feature === "string"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array of strings",
      });
    }

    if (
      isActive !== undefined &&
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    if (
      sortOrder !== undefined &&
      (!Number.isInteger(sortOrder) || sortOrder < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "sortOrder must be a non-negative integer",
      });
    }

    if (
      limits !== undefined &&
      (!limits ||
        typeof limits !== "object" ||
        Array.isArray(limits))
    ) {
      return res.status(400).json({
        success: false,
        message: "limits must be an object",
      });
    }

    if (limits) {
      for (const key of ["members", "projects", "storageMB"]) {
        if (
          limits[key] !== undefined &&
          (!Number.isInteger(limits[key]) || limits[key] < 0)
        ) {
          return res.status(400).json({
            success: false,
            message: `limits.${key} must be a non-negative integer`,
          });
        }
      }

      const allowedLimitKeys = ["members", "projects", "storageMB"];
      const invalidKeys = Object.keys(limits).filter(
        (key) => !allowedLimitKeys.includes(key)
      );

      if (invalidKeys.length) {
        return res.status(400).json({
          success: false,
          message: `Unsupported limit fields: ${invalidKeys.join(", ")}`,
        });
      }
    }

    const plan = await Plan.create({
      name: name.trim(),
      code: normalizedCode,
      description: description?.trim(),
      price,
      currency: currency?.trim().toUpperCase() || "INR",
      interval: interval || "month",
      limits,
      features: features?.map((feature) => feature.trim()),
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan,
    });
  } catch (error) {
    console.error("Create plan error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Plan name or code already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create plan",
    });
  }
};

// UPDATE PLAN
// PATCH /:planId
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!isValidId(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const allowedFields = [
      "name",
      "code",
      "description",
      "price",
      "currency",
      "interval",
      "limits",
      "features",
      "isActive",
      "sortOrder",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" ||
        !updates.name.trim() ||
        updates.name.trim().length > 160)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan name",
      });
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.code !== undefined) {
      if (typeof updates.code !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid plan code",
        });
      }

      updates.code = updates.code.trim().toLowerCase();

      if (!/^[a-z0-9_-]+$/.test(updates.code)) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan code format",
        });
      }
    }

    if (updates.price !== undefined) {
      if (
        typeof updates.price !== "number" ||
        !Number.isFinite(updates.price) ||
        updates.price < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number",
        });
      }
    }

    if (updates.currency !== undefined) {
      if (
        typeof updates.currency !== "string" ||
        !/^[A-Za-z]{3}$/.test(updates.currency.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid currency",
        });
      }

      updates.currency = updates.currency.trim().toUpperCase();
    }

    if (
      updates.interval !== undefined &&
      !["month", "year", "lifetime"].includes(updates.interval)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing interval",
      });
    }

    if (updates.description !== undefined) {
      if (typeof updates.description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid description",
        });
      }

      updates.description = updates.description.trim();
    }

    if (updates.features !== undefined) {
      if (
        !Array.isArray(updates.features) ||
        !updates.features.every((feature) => typeof feature === "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array of strings",
        });
      }

      updates.features = updates.features.map((feature) => feature.trim());
    }

    if (
      updates.isActive !== undefined &&
      typeof updates.isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    if (
      updates.sortOrder !== undefined &&
      (!Number.isInteger(updates.sortOrder) || updates.sortOrder < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "sortOrder must be a non-negative integer",
      });
    }

    if (updates.limits !== undefined) {
      const limits = updates.limits;

      if (
        !limits ||
        typeof limits !== "object" ||
        Array.isArray(limits)
      ) {
        return res.status(400).json({
          success: false,
          message: "limits must be an object",
        });
      }

      const allowedLimitKeys = ["members", "projects", "storageMB"];

      if (
        Object.keys(limits).some(
          (key) => !allowedLimitKeys.includes(key)
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Unsupported limit field",
        });
      }

      for (const key of allowedLimitKeys) {
        if (
          limits[key] !== undefined &&
          (!Number.isInteger(limits[key]) || limits[key] < 0)
        ) {
          return res.status(400).json({
            success: false,
            message: `limits.${key} must be a non-negative integer`,
          });
        }
      }

      // Merge limits so a partial update does not reset other limits.
      const currentPlan = await Plan.findById(planId).select("limits");

      if (!currentPlan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      updates.limits = {
        ...currentPlan.limits.toObject(),
        ...limits,
      };
    }

    const plan = await Plan.findByIdAndUpdate(
      planId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Plan name or code already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update plan",
    });
  }
};

// DELETE PLAN
// DELETE /:planId
// Soft-delete by setting isActive=false
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!isValidId(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const plan = await Plan.findByIdAndUpdate(
      planId,
      {
        $set: {
          isActive: false,
        },
      },
      {
        new: true,
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan deactivated successfully",
    });
  } catch (error) {
    console.error("Delete plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate plan",
    });
  }
};
