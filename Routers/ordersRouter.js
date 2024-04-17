import express from "express";
import { verifyRolePermission } from "../Middleware/verifyRolePermission.js";
import { USER_ROLES } from "../Config/user_roles.js";
import { verifyAccessToken } from "../Middleware/verifyAccessToken.js";
import {
  cancelOrder,
  getOrders,
  getProductSold,
  getRevenue,
  handleCreateOrder,
  monthlyOrders,
  updateOrderStatus,
} from "../Controllers/productsController.js";

const router = express.Router();

// Route to get orders
router.post("/get-orders", verifyAccessToken, getOrders);

// Route to create an order
router.post(
  "/create-order",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Customer.code, USER_ROLES.Admin.code),
  handleCreateOrder
);

// Route to cancel an order
router.post(
  "/cancel-order",
  verifyAccessToken,
  verifyRolePermission(
    USER_ROLES.Customer.code,
    USER_ROLES.Sales.code,
    USER_ROLES.Admin.code
  ),
  cancelOrder
);

// Route to update order status
router.post(
  "/update-order",
  verifyAccessToken,
  verifyRolePermission(USER_ROLES.Sales.code, USER_ROLES.Admin.code),
  updateOrderStatus
);

// Route to get monthly orders
router.post(
  "/monthly-orders",
  verifyAccessToken,
  verifyRolePermission(
    USER_ROLES.Sales.code,
    USER_ROLES.Admin.code,
    USER_ROLES.Marketing.code
  ),
  monthlyOrders
);

// Route to get revenue
router.post(
  "/get-revenue",
  verifyAccessToken,
  verifyRolePermission(
    USER_ROLES.Sales.code,
    USER_ROLES.Admin.code,
    USER_ROLES.Marketing.code
  ),
  getRevenue
);

// Route to get product data
router.post(
  "/get-products-data",
  verifyAccessToken,
  verifyRolePermission(
    USER_ROLES.Marketing.code,
    USER_ROLES.Admin.code,
    USER_ROLES.Sales.code
  ),
  getProductSold
);

export const ordersRouter = router;
