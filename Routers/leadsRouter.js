import express from "express";
import { verifyRolePermission } from "../Middleware/verifyRolePermission.js";
import { USER_ROLES } from "../Config/user_roles.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";
import {
  addNewLead,
  getLeads,
  updateLead,
} from "../Controllers/leadsController.js";

const router = express.Router();

// Route to add new leads
router.post(
  "/add-leads",
  verifyAccessToken, // Middleware to verify access token
  verifyRolePermission(USER_ROLES.Marketing.code, USER_ROLES.Admin.code), // Middleware to verify role permissions
  addNewLead // Controller function to add new leads
);

// Route to update leads
router.post(
  "/update-leads",
  verifyAccessToken, // Middleware to verify access token
  verifyRolePermission(USER_ROLES.Marketing.code, USER_ROLES.Admin.code), // Middleware to verify role permissions
  updateLead // Controller function to update leads
);

// Route to get leads
router.post(
  "/get-leads",
  verifyAccessToken, // Middleware to verify access token
  verifyRolePermission(USER_ROLES.Marketing.code, USER_ROLES.Admin.code), // Middleware to verify role permissions
  getLeads // Controller function to get leads
);

export const leadsRouter = router;
