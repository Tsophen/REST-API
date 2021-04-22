import { Request, Response, NextFunction } from "express";
import { pbkdf2 } from "crypto";

import logger from "$config/logger";
import { createResponse } from "$config/response";
import { emailRegex, fullNameRegex, validatePBKDF2, parsePBKDF2, messages } from "$config/global";

import { UsersService } from "./service";
import { IUser } from "$api/v1.0/users/model";

export class UsersController {
  private readonly service: UsersService = new UsersService();

  /**
   * Loads all users
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async loadUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.service.loadUsers("_id email name");

      logger.debug(`Successfully retrieved information on all users`);

      return res.status(200).json(createResponse(true, messages.successfullyLoadedAllUsers, users));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToLoadAllUser));
    }
  }

  /**
   * Loads a specific user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async loadUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const user = await this.service.loadUser(userId, "_id email name")

      logger.debug(`Successfully retrieved information on user ${userId}`);

      return res.status(200).json(createResponse(true, messages.successfullyLoadedUser, user));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToLoadUser));
    }
  }

  /**
   * Creates a new user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async createUser(req: Request, res: Response, next: NextFunction) {
    const { email, name, password, reminder } = req.body;

    if(!email || !name || !password)
      return res.status(400).json(createResponse(false, messages.missingOneOrMoreFields));
    else if(!emailRegex.test(email))
      return res.status(400).json(createResponse(false, messages.invalidEmail));
    else if(!fullNameRegex.test(name))
      return res.status(400).json(createResponse(false, messages.invalidFullName));
    else if(!validatePBKDF2(password))
      return res.status(400).json(createResponse(false, messages.submittedSuspiciousData));

    if(!process.env.SALT_SECRET)
      return res.status(500).json(createResponse(false, messages.internalServerError));

    pbkdf2(parsePBKDF2(password), process.env.SALT_SECRET, 100000, 64, "sha512", async (err, derivedKey) => {
      if(err)
        return res.status(500).json(createResponse(false, messages.internalServerError));

      try {
        const createdUser = await this.service.createUser(email, name, derivedKey.toString("hex"), reminder);

        logger.debug(`Successfully created new user`, createdUser);
      
        return res.status(201).json(createResponse(true, messages.successfullyCreatedUser, {
          id: (<IUser>createdUser)._id,
          email: (<IUser>createdUser).email,
          emailVerificationToken: (<IUser>createdUser).emailVerificationToken,
          name: (<IUser>createdUser).name
        }));
      } catch(exception) {
        logger.error(exception.message, exception);
      
        return res.status(502).json(createResponse(false, messages.failedToCreateUser));
      }
    });
  }

  /**
   * Updates an existing user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    if(!req.body)
      return res.status(400).json(createResponse(false, messages.missingOneOrMoreFields));
      
    if(!(Symbol.iterator in Object(req.body)))
      return res.status(400).json(createResponse(false, messages.invalidRequestSyntax));

    const updateOperations: any = {};
    for(const operation of req.body)
      updateOperations[operation.property] = operation.value;

    try {
      const updatedUser = await this.service.updateUser(userId, updateOperations);

      logger.debug(`Successfully updated user ${userId}`, updatedUser);

      // TODO: make sure that updateUser response only contains the updated fields and not all fields!
      return res.status(200).json(createResponse(true, messages.successfullyUpdatedUser, updatedUser));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToUpdateUser));
    }
  }

  /**
   * Deletes an existing user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return JSON response
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const deletedUser = await this.service.deleteUser(userId);

      logger.debug(`Successfully deleted user ${userId}`, deletedUser);

      return res.status(204).json(createResponse(true, messages.successfullyDeletedUser));
    } catch(exception) {
      logger.error(exception.message, exception);

      return res.status(502).json(createResponse(false, messages.failedToCreateUser));
    }
  }
}