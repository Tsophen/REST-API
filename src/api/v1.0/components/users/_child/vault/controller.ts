import { Request, Response, NextFunction } from "express";

import { messages } from "$config/global";
import { createResponse } from "$config/response";

import { UsersVaultService } from "./service";
import logger from "$config/logger";

export class UsersVaultController {
  private readonly service: UsersVaultService = new UsersVaultService();

  /**
   * Retrieves a user's vault
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async getVault(req: Request, res: Response, next: NextFunction) {
    const userId = req.userId;

    if(!userId)
      return res.status(400).json(createResponse(false, messages.failedToAuthenticate));

    try {
      const vault = await this.service.getUserVault(userId);

      logger.debug(`Successfully retrieved user ${userId}'s vault`, vault);

      return res.status(200).json(createResponse(true, messages.successfullyLoadedVault, vault));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToLoadVault));
    }
  }

  /**
   * Update a user's vault
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async updateVault(req: Request, res: Response, next: NextFunction) {
    const userId = req.userId;

    if(!userId)
      return res.status(400).json(createResponse(false, messages.failedToAuthenticate));

    if(!req.body || !req.body.vault)
      return res.status(400).json(createResponse(false, messages.missingOneOrMoreFields));
    
    const vault = req.body.vault;

    try {
      const updatedUser = await this.service.updateUserVault(userId, vault);

      logger.debug(`Successfully updated user ${userId}'s vault`, updatedUser);

      // TODO: make sure that updateUser response only contains the updated fields and not all fields!
      return res.status(200).json(createResponse(true, messages.successfullyUpdatedUser, updatedUser));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToUpdateUser));
    }
  }
}