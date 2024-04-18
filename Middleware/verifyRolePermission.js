// Middleware function to verify user role permissions
export const verifyRolePermission = (...allowedRoles) => {
  return (req, res, next) => {
    // Log statement indicating entry into the middleware
    console.log("In verify permission");

    // Check if the user's role is provided in the request
    if (!req.role) {
      console.error("No role provided in the request");
      return res.status(401).json({ message: "Invalid role" });
    }

    // Convert the allowedRoles array to lowercase for case-insensitive comparison
    const rolesArray = allowedRoles.map((role) => {
      // Log each allowed role for debugging purposes
      console.log("Allowed role:", role);
      return role.toLowerCase();
    });

    // Convert the user's role to lowercase for case-insensitive comparison
    const userRole = req.role.toLowerCase();
    console.log("User's role:", userRole);

    // Check if the user's role is included in the allowedRoles array
    if (!rolesArray.includes(userRole)) {
      console.error("User's role is not allowed");
      return res.status(403).json({ message: "Unauthorized" });
    }

    // If the user's role is allowed, proceed to the next middleware
    next();
  };
};
