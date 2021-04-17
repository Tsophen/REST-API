import { Request, Response, NextFunction } from "express";

import logger from "$config/logger";
import { messages } from "$config/global";
import { createResponse } from "$config/response";

import { AuthService } from "./service";

export class AuthController {
  private readonly service: AuthService = new AuthService();

  /**
   * Creates an access token for a specific user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async createAccessToken(req: Request, res: Response, next: NextFunction) {
    if(!req.userId)
      return res.status(400).json(createResponse(false, messages.failedToCreateAccessToken));

    try {
      const token = await this.service.createAccessToken(req.userId);

      logger.info(`Successfully created an access token for user ${req.userId}`, token);

      return res.status(201).json(createResponse(true, messages.successfullyCreatedAccessToken, { accessToken: token}));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToCreateAccessToken));
    }
  }
  
  /**
   * Creates a refresh token for a specific user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
   public async createRefreshToken(req: Request, res: Response, next: NextFunction) {
    if(!req.userId)
      return res.status(400).json(createResponse(false, messages.failedToCreateRefreshToken));

    try {
      const token = await this.service.createRefreshToken(req.userId);

      logger.info(`Successfully created a refresh token for user ${req.userId}`, token);

      // TODO: save refresh token to redis

      return res.status(201).json(createResponse(true, messages.successfullyCreatedRefreshToken, { refreshToken: token}));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToCreateRefreshToken));
    }
  }
}