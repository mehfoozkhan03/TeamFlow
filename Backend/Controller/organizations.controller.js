
const mongoose = require("mongoose");

const Organization = require("../Model/organizations.model");
const OrganizationMember = require("../Model/organizationMembers.model");

// Helper: validate ObjectId
const isValidId = (id) => mongoose.isValidObjectId(id);

// Helper: get active membership
const getActiveMembership = async (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

// Helper: create URL-friendly slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// CREATE ORGANIZATION
// POST /
exports.createOrganization = async (req, res) => {
  let organization;

  try {
    const userId = req.user?._id;
    const { name, logoUrl, timezone } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    if (name.trim().length > 160) {
      return res.status(400).json({
        success: false,
        message: "Organization name cannot exceed 160 characters",
      });
    }

    const slug = createSlug(name);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Cannot generate a valid organization slug",
      });
    }

    if (logoUrl !== undefined && typeof logoUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid logo URL",
      });
    }

    if (timezone !== undefined && typeof timezone !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid timezone",
      });
    }

    if (logoUrl && logoUrl.trim().length > 2048) {
      return res.status(400).json({
        success: false,
        message: "Logo URL is too long",
      });
    }

    // Create organization
    organization = await Organization.create({
      name: name.trim(),
      slug,
      logoUrl: logoUrl?.trim(),
      timezone: timezone?.trim() || "UTC",
      createdBy: userId,
    });

    // Add creator as owner
    try {
      await OrganizationMember.create({
        organization: organization._id,
        user: userId,
        role: "owner",
        status: "active",
        joinedAt: new Date(),
      });
    } catch (membershipError) {
      // Avoid leaving an organization without its owner
      await Organization.deleteOne({
        _id: organization._id,
        createdBy: userId,
      });

      throw membershipError;
    }

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    console.error("Create organization error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Organization slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create organization",
    });
  }
};

// GET MY ORGANIZATIONS
// GET /
exports.getMyOrganizations = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const memberships = await OrganizationMember.find({
      user: userId,
      status: "active",
    })
      .select("organization role")
      .lean();

    const organizationIds = memberships.map(
      (membership) => membership.organization
    );

    const organizations = await Organization.find({
      _id: { $in: organizationIds },
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    const roleMap = new Map(
      memberships.map((membership) => [
        String(membership.organization),
        membership.role,
      ])
    );

    const data = organizations.map((organization) => ({
      ...organization,
      role: roleMap.get(String(organization._id)),
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      organizations: data,
    });
  } catch (error) {
    console.error("Get my organizations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch organizations",
    });
  }
};

// GET ORGANIZATION DETAILS
// GET /:organizationId
exports.getOrganizationById = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization access denied",
      });
    }

    const organization = await Organization.findOne({
      _id: organizationId,
      status: "active",
    }).lean();

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      organization: {
        ...organization,
        role: membership.role,
      },
    });
  } catch (error) {
    console.error("Get organization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch organization",
    });
  }
};

// UPDATE ORGANIZATION
// PATCH /:organizationId
exports.updateOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership || membership.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can update it",
      });
    }

    const { name, slug, logoUrl, timezone } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 160
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid organization name",
        });
      }

      updates.name = name.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid organization slug",
        });
      }

      const normalizedSlug = createSlug(slug);

      if (!normalizedSlug) {
        return res.status(400).json({
          success: false,
          message: "Invalid organization slug",
        });
      }

      updates.slug = normalizedSlug;
    }

    if (logoUrl !== undefined) {
      if (
        typeof logoUrl !== "string" ||
        logoUrl.trim().length > 2048
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid logo URL",
        });
      }

      updates.logoUrl = logoUrl.trim();
    }

    if (timezone !== undefined) {
      if (
        typeof timezone !== "string" ||
        !timezone.trim() ||
        timezone.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid timezone",
        });
      }

      updates.timezone = timezone.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const organization = await Organization.findOneAndUpdate(
      {
        _id: organizationId,
        status: "active",
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error("Update organization error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Organization slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update organization",
    });
  }
};

// DELETE / ARCHIVE ORGANIZATION
// DELETE /:organizationId
exports.deleteOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership || membership.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can archive it",
      });
    }

    const organization = await Organization.findOneAndUpdate(
      {
        _id: organizationId,
        status: "active",
      },
      {
        $set: {
          status: "deleted",
        },
      },
      {
        new: true,
      }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or already archived",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organization archived successfully",
    });
  } catch (error) {
    console.error("Delete organization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to archive organization",
    });
  }
};
