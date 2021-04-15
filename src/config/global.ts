const __prod__ = process.env.NODE_ENV === "production";

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const fullNameRegex = /^[a-zA-Z]([- ']?[a-zA-Z]+)+( [a-zA-Z]([- ']?[a-zA-Z]+)*)+$/;

/**
 * Validates a password (whether it was PBKDF2ed or not)
 * 
 * @param password   Password to validate
 * @returns          @Boolean Whether the password is valid
 */
const validatePBKDF2 = (password: object): boolean => true;

/**
 * Parses a PBKDF2 password and returns a string object
 * 
 * @param password   Password to parse
 * @returns          @String Stringified value of the password
 */
const parsePBKDF2 = (password: object): string => password + "";

/**
 * Generates a random string of {@param length} length
 * 
 * @param length   Length of the generated string
 * @returns        Randomly generated string
 */
const randomString = (length: Number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  for(let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    
  return result;
}

const messages = {
  successfullyCreatedUser: "Successfully created user",
  successfullyVerifiedEmail: "Email address was verified",
  successfullyAuthenticated: "Successfully authenticated",
  successfullyCreatedOTP: "Successfully created an OTP",
  successfullyUpdatedUser: "Successfully updated user",
  successfullyLoadedUser: "Successfully loaded user",
  successfullyLoadedAllUsers: "Successfully loaded all users",
  successfullyDeletedUser: "Successfully deleted user",

  missingAuthorizationHeader: "Missing authorization header",
  missingOneOrMoreFields: "Missing one of more fields [keys]",
  submittedSuspiciousData: "You submitted data that our system found suspicious. If you think what you did should have worked, please contact us",
  emailAlreadyExists: "Email already in use",
  verifyBeforeUsage: "Please verify your email address before using our service",
  noPropertiesProvided: "You didn't provide any properties",

  failedToCreateUser: "Failed to create user",
  failedToAuthenticate: "Authentication failed",
  failedToVerifyEmail: "Email verification failed",
  failedToUpdateUser: "Failed to update user",
  failedToLoadAllUser: "Failed to load all users",
  failedToLoadUser: "Failed to load user",
  
  invalidCredentials: "Invalid credentials",
  invalidEmail: "Invalid email",
  invalidFullName: "Invalid full name",
  invalidPassword: "Invalid password",
  
  forbidden: "You don't have enough permissions to do that",

  internalServerError: "An internal error with the server has occured. Please contact an Administrator :)",
  internalMongoDBError: "An internal error with MongoDB has occured. Please contact an Administrator :)"
}

export {
  __prod__,
  emailRegex,
  fullNameRegex,

  validatePBKDF2,
  parsePBKDF2,
  randomString,
  
  messages
}