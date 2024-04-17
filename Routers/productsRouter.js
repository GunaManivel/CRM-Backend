import express from "express";
import { verifyRolePermission } from "../Middleware/verifyRolePermission.js";
import { USER_ROLES } from "../Config/user_roles.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";
import { getAvlProducts } from "../Controllers/productsController.js";

const router = express.Router();

// Route to get available products
router.get("/avl-products", getAvlProducts);

export const productsRouter = router;
