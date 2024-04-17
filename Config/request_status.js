export const REQUEST_STATUS = {
  Pending: {
    code: "PENDING",
    description: "The request is awaiting assignment",
  },
  Assigned: {
    code: "ASSIGNED",
    description: "The request has been assigned to an agent",
  },
  InProgress: {
    code: "IN_PROGRESS",
    description: "The request is currently being worked on",
  },
  Resolved: {
    code: "RESOLVED",
    description: "The request has been resolved",
  },
  Closed: {
    code: "CLOSED",
    description: "The request has been closed",
  },
};
