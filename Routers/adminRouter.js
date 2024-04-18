import express from "express";
import {
  addAdmin,
  adminLogin,
  handleAddEmployee,
  handleAddProduct,
  handleUpdateProduct,
  removeEmployee,
  updateUser,
} from "../Controllers/adminController.js";
import { verifyRolePermission } from "../Middleware/verifyRolePermission.js";
import { USER_ROLES } from "../Config/user_roles.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";

const router = express.Router();

// Route to add a new admin
router.post("/add-admin", addAdmin);

// Route for adding a new product
router.post(
  "/add-product",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  handleAddProduct
);

// Route for admin login
router.post("/admin-login", adminLogin);

// Route for updating a product
router.put(
  "/update-product",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  handleUpdateProduct
);

// Route for adding a new employee
router.post(
  "/add-employee",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  handleAddEmployee
);

// Route for updating user details
router.put(
  "/update-user/:userId",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  updateUser
);

// Route for removing an employee
router.delete(
  "/remove-employee/:userId",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  removeEmployee
);

export const adminRouter = router;
