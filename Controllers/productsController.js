import { Product } from "../Models/productModel.js";
import { PRODUCT_STATUS } from "../Config/products_Types.js";
import { Order } from "../Models/orderModel.js";
import { nanoid } from "nanoid";
import { ORDER_STATUS } from "../Config/order_status.js";
import { transporter, verifyTransporter } from "../Config/mailTransporter.js";
import { User } from "../Models/userModel.js";

// get all available products
export const getAvlProducts = async (req, res) => {
  try {
    // Pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // Fetch available products with pagination
    const avlProducts = await Product.find({
      product_status: PRODUCT_STATUS.Available.code, // Use the code property of the status object
    })
      .skip(skip)
      .limit(limit);

    // Count total number of available products
    const totalProducts = await Product.countDocuments({
      product_status: PRODUCT_STATUS.Available.code, // Use the code property of the status object
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    if (avlProducts.length > 0) {
      return res.status(200).json({
        avlProducts: avlProducts,
        totalPages: totalPages,
        currentPage: page,
        totalProducts: totalProducts,
      });
    } else {
      return res.status(404).json({ message: "No available products found" });
    }
  } catch (error) {
    console.error("Error fetching available products:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// get orders with req.body criteria
export const getOrders = async (req, res) => {
  console.log("Fetching orders");
  try {
    // Pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // Check if customer_id is provided in the request body or query parameters
    const customer_id = req.body.customer_id || req.query.customer_id;
    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Check if the customer ID exists in the database
    const customerExists = await User.exists({ _id: customer_id });
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch orders with pagination and sorting based on customer_id
    const orderHist = await Order.find({ customer_id })
      .sort({ order_date: -1 })
      .skip(skip)
      .limit(limit);

    if (orderHist.length > 0) {
      return res.status(200).json({
        ordersList: orderHist,
        currentPage: page,
        totalPages: Math.ceil(orderHist.length / limit),
      });
    } else {
      return res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// Get all orders from current month and current year
export const monthlyOrders = async (req, res) => {
  console.log("Fetching monthly and yearly orders");

  try {
    // Pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;

    // Pattern for current month
    const pattern1 =
      "^" +
      String(year) +
      (month < 10 ? "0" + String(month) : String(month)) +
      ".*";
    const ordersMonthly = await Order.find({
      order_date: { $regex: pattern1 },
    })
      .sort({ order_date: -1 })
      .skip(skip)
      .limit(limit);

    // Pattern for current year
    const pattern2 = "^" + String(year) + ".*";
    const ordersYearly = await Order.find({
      order_date: { $regex: pattern2 },
    })
      .sort({ order_date: -1 })
      .skip(skip)
      .limit(limit);

    if (ordersMonthly.length > 0 || ordersYearly.length > 0) {
      return res.status(200).json({
        ordersMonthly,
        ordersYearly,
        currentPage: page,
        totalPages: Math.max(
          Math.ceil(ordersMonthly.length / limit),
          Math.ceil(ordersYearly.length / limit)
        ),
      });
    } else {
      return res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    console.error("Error fetching monthly and yearly orders:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// Get revenue from monthwise and yearwise for delivered orders
export const getRevenue = async (req, res) => {
  console.log("Getting revenue for month and year");

  try {
    if (!req.body || !req.body.month || !req.body.year) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const { month, year } = req.body;

    const ordersYearly = await Order.aggregate([
      {
        $project: {
          order_status: 1,
          order_amount: 1,
          year: { $substr: ["$order_date", 0, 4] },
          month: { $substr: ["$order_date", 5, 2] }, // Fix: Use 5 instead of 4 to get the month
        },
      },
      {
        $match: {
          year: year,
          order_status: "DELIVERED", // Fix: Correct the order status value
        },
      },
      {
        $group: {
          _id: "$year",
          revenue: { $sum: "$order_amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const ordersAllYearly = await Order.aggregate([
      {
        $project: {
          order_status: 1,
          order_amount: 1,
          year: { $substr: ["$order_date", 0, 4] },
        },
      },
      {
        $match: {
          order_status: "DELIVERED", // Fix: Correct the order status value
        },
      },
      {
        $group: {
          _id: "$year",
          revenue: { $sum: "$order_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const ordersMonthly = await Order.aggregate([
      {
        $project: {
          order_status: 1,
          order_amount: 1,
          year: { $substr: ["$order_date", 0, 4] },
          month: { $substr: ["$order_date", 5, 2] }, // Fix: Use 5 instead of 4 to get the month
        },
      },
      {
        $match: {
          year: year,
          month: month,
          order_status: "DELIVERED", // Fix: Correct the order status value
        },
      },
      {
        $group: {
          _id: "$month",
          revenue: { $sum: "$order_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    if (
      ordersMonthly.length > 0 ||
      ordersYearly.length > 0 ||
      ordersAllYearly.length > 0
    ) {
      return res.status(200).json({
        ordersMonthly,
        ordersYearly,
        ordersAllYearly,
      });
    } else {
      return res.status(404).json({ message: "No revenue data found" });
    }
  } catch (error) {
    console.error("Error getting revenue:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// create new order
export const handleCreateOrder = async (req, res) => {
  try {
    // Extract order items and customer ID from request body
    const { order_items, cust_email, order_ETA, customer_id } = req.body;

    // Initialize total order amount
    let order_amount = 0;

    // Update product stock and calculate total order amount
    const low_stock = [];
    for (const item of order_items) {
      // Find product details by product ID
      const product = await Product.findOne({ product_ID: item.product_ID });

      // Check if product exists
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.product_ID} not found` });
      }

      // Calculate subtotal for the current item
      const subtotal = product.product_price * item.qty;

      // Increase total order amount
      order_amount += subtotal;

      // Update product stock
      const result = await Product.findOneAndUpdate(
        { product_ID: item.product_ID },
        { $inc: { product_stock: -item.qty } },
        { new: true }
      );

      // Check if product is low in stock
      if (result.product_stock <= 10) {
        low_stock.push(result.product_ID);
      }
    }

    // If any products are low in stock, notify sales team
    if (low_stock.length > 0) {
      console.log("Notify sales team to restock:", low_stock);
      // Additional logic to notify sales team
    }

    // Generate order ID
    const orderID = "OD-" + nanoid(12);

    // Create new order with updated order amount
    const createOrder = new Order({
      ...req.body,
      orderID,
      customer_id,
      order_amount,
    });
    await createOrder.save();
    console.log("New order placed data saved");

    // Send email to customer
    verifyTransporter();
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: cust_email,
      subject: `Your Order is placed. order ID : ${orderID}`,
      text: `Greetings from Clean Life ! 
          Your order has been placed: Your order ID : ${orderID}
          Your order will reach you by ${order_ETA}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email not sent", error);
        return res.status(500).send({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with success message and order details
    return res.status(200).json({
      message: "Order placed",
      order: { ...req.body, orderID, order_amount },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// cancel an order
export const cancelOrder = async (req, res) => {
  console.log("Cancel order request");
  try {
    // Validate request body
    if (!req.body?.orderID) {
      return res.status(400).json({ message: "Invalid orderID" });
    }

    // Find and update the order status to "CancelReq"
    const cancel = await Order.findOneAndUpdate(
      { orderID: req.body.orderID },
      { order_status: ORDER_STATUS.CancelReq.code },
      { new: true }
    );

    // Check if the order was successfully updated
    if (cancel) {
      return res
        .status(200)
        .json({ message: "Order cancellation request placed" });
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  console.log("Update order status request");
  try {
    // Validate request body
    if (!req.body?.orderID || !req.body?.order_status) {
      return res
        .status(400)
        .json({ message: "Invalid orderID or order status" });
    }

    // Find the order
    const order = await Order.findOne({ orderID: req.body.orderID });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.order_status = req.body.order_status;

    // Update the order delivered on date if the order status is "DELIVERED"
    if (req.body.order_status === "DELIVERED") {
      order.order_delivered_on = new Date();
    } else if (req.body.order_status === "CANCELLED") {
      // Update the order cancelled on date if the order status is "CANCELLED"
      order.order_cancelled_on = new Date();
    }

    // Save the updated order
    const updatedOrder = await order.save();

    // Respond with success message and updated order details
    let response = {
      message: "Order status updated",
      updatedOrder: updatedOrder.toObject(),
    };

    // Remove order_delivered_on field if order status is "CANCELLED"
    if (req.body.order_status === "CANCELLED") {
      delete response.updatedOrder.order_delivered_on;
    }

    // Include order_cancelled_on field if order status is "CANCELLED"
    if (req.body.order_status === "CANCELLED") {
      response.updatedOrder.order_cancelled_on =
        updatedOrder.order_cancelled_on;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// get all products sold count- category wise
export const getProductSold = async (req, res) => {
  console.log("Get product sales data request");
  try {
    // Validate request body
    if (!req.body?.year) {
      return res.status(400).json({ message: "Invalid year" });
    }

    // Retrieve products sold
    const productsSold = await Order.aggregate([
      {
        $match: {
          order_status: ORDER_STATUS.Delivered.code,
          order_date: { $regex: req.body.year },
        },
      },
      {
        $project: {
          order_items: 1,
          order_date: 1,
          order_qty: 1,
          order_status: 1,
        },
      },
    ]);

    // Retrieve products sold count and amount
    const productsSoldCount = await Order.aggregate([
      {
        $match: {
          order_status: ORDER_STATUS.Delivered.code,
          order_date: { $regex: req.body.year },
        },
      },
      {
        $group: {
          _id: "$order_status",
          count: { $sum: "$order_qty" },
          amount: { $sum: "$order_amount" },
        },
      },
    ]);

    // Retrieve products cancelled
    const productsCancelled = await Order.aggregate([
      {
        $match: {
          order_status: ORDER_STATUS.Cancelled.code,
          order_date: { $regex: req.body.year },
        },
      },
      {
        $project: {
          order_items: 1,
          order_date: 1,
          order_qty: 1,
          order_status: 1,
        },
      },
    ]);

    // Retrieve products cancelled count and amount
    const productsCancelledCount = await Order.aggregate([
      {
        $match: {
          order_status: ORDER_STATUS.Cancelled.code,
          order_date: { $regex: req.body.year },
        },
      },
      {
        $group: {
          _id: "$order_status",
          count: { $sum: "$order_qty" },
          amount: { $sum: "$order_amount" },
        },
      },
    ]);

    // Check if any data found
    if (
      (productsSold.length > 0 && productsSoldCount.length > 0) ||
      (productsCancelled.length > 0 && productsCancelledCount.length > 0)
    ) {
      return res.status(200).json({
        productsSold: {
          count: productsSoldCount[0]?.count || 0,
          amount: productsSoldCount[0]?.amount || 0,
          details: productsSold,
        },
        productsCancelled: {
          count: productsCancelledCount[0]?.count || 0,
          amount: productsCancelledCount[0]?.amount || 0,
          details: productsCancelled,
        },
      });
    } else {
      return res.status(400).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error getting product sales data:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
