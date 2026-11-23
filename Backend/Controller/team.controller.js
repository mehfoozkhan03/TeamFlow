const mongoose = require("mongoose");
const crypto = require("crypto");

const Team = require("../models/Team");
const Membership = require("../models/Membership");

// Generate a unique invitation code
const generateInviteCode = async () => {
  let inviteCode;
  let existingTeam;

  do {
    inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    existingTeam = await Team.findOne({ inviteCode });
  } while (existingTeam);

  return inviteCode;
};

// CREATE TEAM
exports.createTeam = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.id;
    const organizationId = req.user.activeOrganizationId;

    const { teamName, description, projectName } = req.body;

    // Validate required fields
    if (!teamName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Team name is required.",
      });
    }

    if (!projectName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Please select an active organization.",
      });
    }

    // Verify organization membership
    const membership = await Membership.findOne({
      userId,
      organizationId,
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this organization.",
      });
    }

    // Generate invitation code
    const inviteCode = await generateInviteCode();

    let createdTeam;

    await session.withTransaction(async () => {
      const team = await Team.create(
        [
          {
            organizationId,
            teamName: teamName.trim(),
            description: description?.trim() || "",
            leader: userId,
            members: [
              {
                user: userId,
                role: "leader",
                designation: "other",
              },
            ],
            inviteCode,
            inviteExpiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
          },
        ],
        { session }
      );

      createdTeam = team[0];
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully.",
      team: createdTeam,
    });
  } catch (error) {
    console.error("Create Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create team.",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};