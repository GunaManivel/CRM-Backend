import { Product } from "../Models/productModel.js";
import { REQUEST_STATUS } from "../Config/request_status.js";
import { Request } from "../Models/requestModel.js";
import { nanoid } from "nanoid";
import { ORDER_STATUS } from "../Config/order_status.js";
import { transporter, verifyTransporter } from "../Config/mailTransporter.js";

//create an request
export const createRequest = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.orderID || !req.body.cust_email) {
      return res
        .status(400)
        .json({ message: "Missing order ID or customer email" });
    }

    console.log("New request");

    // Generate request ID
    const id = nanoid(12);
    const requestID = "SR-" + id;

    // Create new request
    const createRequest = new Request({ ...req.body, requestID });
    await createRequest.save();
    console.log("New request placed data saved");

    // Send email to customer
    verifyTransporter();

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: req.body.cust_email,
      subject: `Your service request is placed. Request ID: ${requestID}`,
      text: `Your service request has been successfully placed. 
      Here is your request ID: ${requestID}. 
      Our dedicated engineer will promptly reach out to you to assist with your needs.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email not sent", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.status(200).json({
      message: "Request placed",
      request: { ...req.body, requestID },
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// get all requests of a customer or engineer ?
export const getRequests = async (req, res) => {
  console.log("Get request");
  try {
    // Extract pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // If the request body is empty, fetch all requests
    const filter = req.body ? req.body : {};

    // Retrieve requests based on the filter and pagination parameters
    const requestHist = await Request.find(filter)
      .sort({ request_date: -1 })
      .skip(skip)
      .limit(limit);

    // Check if any requests were found
    if (requestHist.length > 0) {
      return res.status(200).json({ requestsList: requestHist });
    } else {
      return res.status(404).json({ message: "No requests found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// get all requests of a Admin
export const getAllRequests = async (req, res) => {
  console.log("Get all requests monthly and yearly");
  try {
    // Extract pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;

    // Construct regex patterns for monthly and yearly requests
    const patternMonthly =
      "^" +
      String(year) +
      (month < 10 ? "0" + String(month) : String(month)) +
      ".*";
    const patternYearly = "^" + String(year) + ".*";

    // Retrieve monthly requests
    const requestMonthly = await Request.find({
      request_date: { $regex: patternMonthly },
    })
      .sort({ request_date: -1 })
      .skip(skip)
      .limit(limit);

    // Retrieve yearly requests
    const requestYearly = await Request.find({
      request_date: { $regex: patternYearly },
    })
      .sort({ request_date: -1 })
      .skip(skip)
      .limit(limit);

    // Check if any requests were found
    if (requestMonthly.length > 0 || requestYearly.length > 0) {
      return res.status(200).json({ requestMonthly, requestYearly });
    } else {
      return res.status(404).json({ message: "No requests found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

//  update request status by engg
export const updateRequest = async (req, res) => {
  console.log("Update status request");
  try {
    // Validate request body
    if (
      !req.body ||
      !req.body.requestID ||
      !req.body.request_status ||
      !req.body.request_engg
    ) {
      return res.status(400).json({
        message:
          "Invalid data. Please provide requestID, request_status, and request_engg",
      });
    }

    // Find and update the request
    const result = await Request.findOneAndUpdate(
      { requestID: req.body.requestID },
      {
        request_status: req.body.request_status,
        request_engg: req.body.request_engg,
      },
      { new: true }
    );

    // Check if the request was found and updated
    if (result) {
      return res.status(200).json({ result });
    } else {
      return res
        .status(404)
        .json({ message: "No request found with the provided ID" });
    }
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

//  update request summary by engg
export const updateSummary = async (req, res) => {
  console.log("Update summary request");
  try {
    // Validate request body
    if (!req.body || !req.body.requestID || !req.body.request_summary) {
      return res.status(400).json({
        message: "Invalid data. Please provide requestID and request_summary",
      });
    }

    // Find and update the request
    const result = await Request.findOneAndUpdate(
      { requestID: req.body.requestID },
      {
        request_summary: req.body.request_summary,
      },
      { new: true }
    );

    // Check if the request was found and updated
    if (result) {
      return res.status(200).json({ result });
    } else {
      return res
        .status(404)
        .json({ message: "No request found with the provided ID" });
    }
  } catch (error) {
    console.error("Error updating request summary:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
