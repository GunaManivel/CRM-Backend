// Define request status options with their respective codes and descriptions
export const REQUEST_STATUS = {
  // The request is pending and awaiting assignment
  Pending: {
    code: "PENDING",
    description: "The request is awaiting assignment",
  },
  // The request has been assigned to an agent
  Assigned: {
    code: "ASSIGNED",
    description: "The request has been assigned to an agent",
  },
  // The request is currently being worked on
  InProgress: {
    code: "IN_PROGRESS",
    description: "The request is currently being worked on",
  },
  // The request has been resolved
  Resolved: {
    code: "RESOLVED",
    description: "The request has been resolved",
  },
  // The request has been closed
  Closed: {
    code: "CLOSED",
    description: "The request has been closed",
  },
};
