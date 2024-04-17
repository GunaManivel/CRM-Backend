import { nanoid } from "nanoid";
import { Lead } from "../Models/leadModel.js";
import dotenv from "dotenv";

dotenv.config();
import { transporter, verifyTransporter } from "../Config/mailTransporter.js";
import { USER_ROLES } from "../Config/user_roles.js";
import { LEAD_STATUS } from "../Config/lead_status.js";
const client_URL = process.env.CLIENT_URL;

// Add a new lead
export const addNewLead = async (req, res) => {
  console.log("Adding new lead:", req.body);
  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }

    // Check if required fields are present
    const { lead_name, lead_email, lead_phone, lead_source, lead_status } =
      req.body;
    if (
      !lead_name ||
      !lead_email ||
      !lead_phone ||
      !lead_source ||
      !lead_status
    ) {
      return res.status(400).json({ message: "Incomplete lead data" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lead_email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(lead_phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if lead status is valid
    const validLeadStatusCodes = Object.values(LEAD_STATUS).map(
      (status) => status.code
    );
    if (!validLeadStatusCodes.includes(lead_status)) {
      return res.status(400).json({ message: "Invalid lead status" });
    }

    // Generate unique lead ID
    const leadId = "LD-" + nanoid(6);

    // Create new lead
    const newLead = new Lead({ ...req.body, lead_id: leadId });
    await newLead.save();

    console.log("New lead added successfully");
    return res.status(201).json({ message: "Lead added", lead_id: leadId });
  } catch (error) {
    console.error("Error adding new lead:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// update lead
export const updateLead = async (req, res) => {
  console.log("Updating lead");

  try {
    // Check if request body and lead ID are provided
    if (!req.body || !req.body.lead_id) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const { lead_id, ...updateFields } = req.body;

    // Find the lead by lead ID and update its information
    const updatedLead = await Lead.findOneAndUpdate(
      { lead_id: lead_id },
      updateFields,
      { new: true }
    );

    if (updatedLead) {
      return res.status(200).json({
        message: "Lead information updated successfully",
        lead_id: updatedLead.lead_id,
      });
    } else {
      return res.status(404).json({ message: "Lead not found" });
    }
  } catch (error) {
    console.error("Error updating lead:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

// Get all leads with pagination
export const getLeads = async (req, res) => {
  console.log("Fetching leads");
  try {
    // Pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // Fetch all leads
    const leadsList = await Lead.find({})
      .sort({ lead_created: -1 })
      .skip(skip)
      .limit(limit);

    if (leadsList.length > 0) {
      return res.status(200).json({ leadsList });
    } else {
      return res.status(404).json({ message: "No leads found" });
    }
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
