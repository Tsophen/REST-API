import { Request, Response, NextFunction } from "express";

import logger from "$config/logger";
import { messages } from "$config/global";
import { createResponse } from "$config/response";

import { AuthService } from "./service";

export class AuthController {
  private readonly service: AuthService = new AuthService();

  /**
   * Creates an access token and a refresh token for a specific user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async createTokens(req: Request, res: Response, next: NextFunction) {
    if(!req.userId)
      return res.status(400).json(createResponse(false, messages.failedToAuthenticate));

    try {
      const accessToken = await this.service.createAccessToken(req.userId);
      const refreshToken = await this.service.createRefreshToken(req.userId);

      // TODO: disable previous refresh token of user with userId

      logger.info(`Successfully created access & refresh tokens for user ${req.userId}`);

      res.cookie("refreshToken", refreshToken, { maxAge: (7 * 24 * 60 * 60 * 1000), path: "/", httpOnly: true, secure: true, sameSite: true });
      return res.status(200).json(createResponse(true, messages.successfullyCreatedAccessToken, { accessToken: accessToken}));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToCreateAccessToken));
    }
  }
}