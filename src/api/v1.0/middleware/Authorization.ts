import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pbkdf2 } from "crypto";

import logger from "$config/logger";
import { createResponse } from "$config/response";
import { emailRegex, messages, parsePBKDF2, validatePBKDF2 } from "$config/global";
import { RESOURCE, ACTION, hasPermission } from '$config/permissions';

import User, { IUser } from "$api/v1.0/components/users/model"

export class Authorization {
  /**
   * A middleware function to checks the login details of a user in post requests
   * If the credentials verify successfully, we call the #next function to continue the request
   * 
   * @returns <Optional> Response if the authorization token was declined 
   */
  public async checkCredentials(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if(!email || !password)
      return res.status(400).json(createResponse(false, messages.missingOneOrMoreFields));
    else if(!emailRegex.test(email))
      return res.status(400).json(createResponse(false, messages.invalidEmail));
    else if(!validatePBKDF2(password))
      return res.status(400).json(createResponse(false, messages.submittedSuspiciousData));

    if(!process.env.SALT_SECRET)
      return res.status(500).json(createResponse(false, messages.internalServerError));

    try {
      const user = <IUser> await User.findOne({ email }).exec();

      if(!user)
        return res.status(400).json(createResponse(false, messages.invalidCredentials));

      pbkdf2(parsePBKDF2(password), process.env.SALT_SECRET, 100000, 64, "sha512", async (err, derivedKey) => {
        if(err)
          return res.status(500).json(createResponse(false, messages.internalServerError));

        if(!user.vaultKey || user.vaultKey !== derivedKey.toString("hex"))
          return res.status(400).json(createResponse(false, messages.invalidCredentials));

        // if(!user.verified)
        //   return res.status(403).json(createResponse(false, messages.verifyBeforeUsage));

        req.userId = user._id;
        next();
      });
    } catch(exception) {
      console.log(exception);

      return res.status(500).json(createResponse(false, messages.failedToAuthenticate));
    }
  }

  /**
   * A middleware function to checks the access token included in the headers of the request
   * If the token verifies successfully, we call the #next function to continue the request
   * 
   * @returns <Optional> Response if the access token was declined 
   */
  public async checkAccessToken(req: Request, res: Response, next: NextFunction) {
    if(!process.env.JWT_ACCESS_SECRET)
      return res.status(500).json(createResponse(false, messages.internalServerError));

    try {
      let token = req.headers["x-token"];

      if(!token)
        return res.status(400).json(createResponse(false, messages.missingAuthorizationHeader));

      token = (<string>token).split(" ")[1];

      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if(err) {
          logger.error(err.message, err);
    
          return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
        } else if(!decoded) {
          logger.error("Could not get the decoded version of the access token");
    
          return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
        }
    
        req.userId = (<any>decoded).id;
        next();
      });
    } catch(exception) {
      logger.error(exception);
        
      return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
    }
  }

  /**
   * A middleware function to checks the refresh token included in the headers of the request
   * If the token verifies successfully, we call the #next function to continue the request
   * 
   * @returns <Optional> Response if the refresh token was declined 
   */
  public async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)
      return res.status(400).json(createResponse(false, messages.missingOneOrMoreFields));

    if(!process.env.JWT_REFRESH_SECRET)
      return res.status(500).json(createResponse(false, messages.internalServerError));

    try {
      // TODO: check redis to find the refresh token, then validate it with JWT, match ip & match device uid.
      // If valdiation fails, return a fail response, else call #next.

      jwt.verify(<string>refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if(err) {
          logger.error(err.message, err);
    
          return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
        } else if(!decoded) {
          logger.error("Could not get the decoded version of the refresh token");
    
          return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
        }
    
        req.userId = (<any>decoded).id;
        next();
      });
    } catch(exception) {
      logger.error(exception);
        
      return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
    }
  }

  /**
   * A middleware function to check whether a user has permissions for a certain action on a certain resource
   * 
   * @param resource   Resource of the request
   * @param action     Action of the request
   * @returns          <Optional> Response if the user doesn't have permission to perform the action on the resource 
   */
  public async checkPermissionLevel(req: Request, res: Response, next: NextFunction, resource: RESOURCE, action: ACTION) {
    try {
      const id = req.userId;

      if(!id)
        return res.status(400).json(createResponse(false, messages.forbidden));

      await hasPermission(id, resource, action);
      next();
    } catch (exception) {
      console.log(exception);

      return res.status(403).json(createResponse(false, messages.forbidden));
    }
  }
}