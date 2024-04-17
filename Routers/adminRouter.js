import express from "express";
import {} from "../Controllers/userController.js";
import { verifyRolePermission } from "../Middleware/verifyRolePermission.js";
import { USER_ROLES } from "../Config/user_roles.js";
import {
  addAdmin,
  adminLogin,
  handleAddEmployee,
  handleAddProduct,
  handleUpdateProduct,
  removeEmployee,
  updateUser,
} from "../Controllers/adminController.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";

const router = express.Router();

// Route to add a new admin
router.post("/add-admin", addAdmin);

router.post(
  "/add-product",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  handleAddProduct
);
// Route for admin login
router.post("/admin-login", adminLogin);

// Define route for updating a product
router.put(
  "/update-product",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Admin.code),
  handleUpdateProduct
);
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
