// Define order status codes and descriptions
export const ORDER_STATUS = {
  // Order placed but not yet shipped
  Placed: {
    code: "PLACED",
    description: "Order placed",
  },
  // Order shipped but not yet delivered
  Shipped: {
    code: "SHIPPED",
    description: "Order shipped",
  },
  // Order delivered successfully
  Delivered: {
    code: "DELIVERED",
    description: "Order delivered",
  },
  // Request for cancellation initiated by the customer
  CancelReq: {
    code: "CANCEL_REQ",
    description: "Cancellation requested",
  },
  // Order cancelled
  Cancelled: {
    code: "CANCELLED",
    description: "Order cancelled",
  },
  // Order returned by the customer
  Returned: {
    code: "RETURNED",
    description: "Order returned",
  },
  // Refund processed for the order
  Refunded: {
    code: "REFUNDED",
    description: "Refund processed",
  },
};
