import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { messages } from "../config/global";
import logger from "../config/logger";
import { RESOURCE, ACTION, hasPermission } from '../config/permissions';
import { createResponse } from "../config/response";

export class AuthService {
  /**
   * A middleware function to checks the authorization token included in the headers of the request
   * If the token verifies successfully, we call the #next function to continue the request
   * 
   * @returns <Optional> Response if the authorization token was declined 
   */
  public checkAuthorizationToken () {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if(!req.headers.authorization) {
          return res.status(400).json(createResponse(false, messages.missingAuthorizationHeader));
        }

        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, <Secret> process.env.JWT_SECRET, (err, decoded) => {
          if(err) {
            logger.error(err.message, err);
    
            return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
          } else if(!decoded) {
            logger.error("Could not get the decoded version of the token");
    
            return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
          }
    
          req.userId = (<any>decoded).id;
          next();
        });
      } catch(error) {
        logger.error(error);
        
        return res.status(403).json(createResponse(false, messages.failedToAuthenticate));
      }
    }
  }

  /**
   * A middleware function to check whether a user has permissions for a certain action on a certain resource
   * 
   * @param resource   Resource of the request
   * @param action     Action of the request
   * @returns          <Optional> Response if the user doesn't have permission to perform the action on the resource 
   */
  public hasPermission(resource: RESOURCE, action: ACTION) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.userId;

        if(!id)
          return res.status(400).json(createResponse(false, messages.forbidden));

        await hasPermission(id, resource, action)
          .then(result => {
            if(result)
              return next();
          })
          .catch(error => {
            logger.error(error.message, error);
          });
      } catch (exception) {
        console.log(exception);

        return res.status(500).json(createResponse(false, messages.internalServerError));
      }
    }
  }
}