const fs = require("fs");
const crypto = require("crypto");

// Read the existing .env file
const envFilePath = ".env";
const existingEnv = fs.readFileSync(envFilePath, "utf8");

// Generate the secret keys
const accValidationTokenSecret = crypto.randomBytes(32).toString("hex");
const userAccessTokenSecret = crypto.randomBytes(32).toString("hex");
const resetPwdTokenSecret = crypto.randomBytes(32).toString("hex");

// Update the .env file with the generated keys
fs.writeFileSync(
  envFilePath,
  `${existingEnv}\nACC_VALIDATION_TOKEN_SECRET=${accValidationTokenSecret}\nRESET_PWD_TOKEN_SECRET=${resetPwdTokenSecret}\nUSER_ACCESS_TOKEN_SECRET=${userAccessTokenSecret}\n`
);

console.log("Secret keys generated and saved to .env file.");
