import express from "express";
import { verifyRolePermission } from "../Middleware/verifyRolePermission.js";
import { USER_ROLES } from "../Config/user_roles.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";
import {
  createRequest,
  getAllRequests,
  getRequests,
  updateRequest,
  updateSummary,
} from "../Controllers/requestController.js";

const router = express.Router();

// Route to get requests
router.post("/get-requests", verifyAccessToken, getRequests);

// Route to get all requests (accessible to Admin only)
router.post(
  "/get-all-requests",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  getAllRequests
);

// Route to create a new request
router.post(
  "/create-request",
  verifyAccessToken,
  verifyRolePermission(
    USER_ROLES.Customer.code,
    USER_ROLES.Engineer.code,
    USER_ROLES.Admin.code
  ),
  createRequest
);

// Route to update request status
router.post(
  "/update-status",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Engineer.code, USER_ROLES.Admin.code),
  updateRequest
);

// Route to update request summary
router.post(
  "/update-summary",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Engineer.code, USER_ROLES.Admin.code),
  updateSummary
);

export const requestRouter = router;
