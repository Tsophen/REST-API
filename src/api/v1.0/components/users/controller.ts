import { Request, Response, NextFunction } from "express";
import { pbkdf2 } from "crypto";

import logger from "../../../../config/logger";
import { emailRegex, fullNameRegex, validatePBKDF2, parsePBKDF2, messages } from "../../../../config/global";
import { createResponse } from "../../../../config/response";

import { UsersService } from "./service";
import { IUser } from "./model";

export class UsersController {
  private readonly service: UsersService = new UsersService();

  /**
   * Retrieves data on all users
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return Returns a Promise of a response or void
   */
  public async readUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    this.service.getUsers()
      .then(users => {
        logger.info("Successfully retrieved information on all users");

        return res.status(200).json(createResponse(true, messages.successfullyLoadedAllUsers, users));
      })
      .catch(error => {
        logger.error(error.message, error);

        return res.status(502).json(createResponse(false, messages.failedToLoadAllUser));
      });
  }

  /**
   * Retrieves data on a specific user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return Returns a Promise of a response or void
   */
  public async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { userId } = req.params;

    this.service.getUser(userId)
      .then(user => {
        logger.info(`Successfully retrieved information on user ${userId}`);

        return res.status(200).json(createResponse(true, messages.successfullyLoadedUser, user));
      })
      .catch(error => {
        logger.error(error.message, error);

        return res.status(502).json(createResponse(false, messages.failedToLoadUser));
      });
  }

  /**
   * Creates a new user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return Returns a Promise of a response or void
   */
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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

      this.service.createUser(email, name, derivedKey.toString("hex"), reminder)
        .then(createdUser => {
          logger.info(`Successfully created new user`, createdUser);

          return res.status(201).json(createResponse(true, messages.successfullyCreatedUser, {
            id: (<IUser>createdUser)._id,
            email: (<IUser>createdUser).email,
            emailVerificationToken: (<IUser>createdUser).emailVerificationToken,
            name: (<IUser>createdUser).name
          }));
        })
        .catch(error => {
          logger.error(error.message, error);

          return res.status(502).json(createResponse(false, messages.failedToCreateUser));
        });
    });
  }

  /**
   * Updates an existing user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return Returns a Promise of a response or void
   */
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { userId } = req.params;

    if(!req.body)
      return res.status(400).json(createResponse(false, messages.missingOneOrMoreFields));

    const updateOperations: any = {};
    for(const operation of req.body)
      updateOperations[operation.property] = operation.value;

    this.service.updateUser(userId, updateOperations)
      .then(updatedUser => {
        logger.info(`Successfully updated user ${userId}`, updatedUser);

        return res.status(200).json(createResponse(true, messages.successfullyUpdatedUser, updatedUser));
      })
      .catch(error => {
        logger.error(error.message, error);

        return res.status(502).json(createResponse(false, messages.failedToUpdateUser));
      });
  }

  /**
   * Deletes an existing user
   * 
   * @req    Request object
   * @res    Response object
   * @next   Next function
   * @return Returns a Promise of a response or void
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { userId } = req.params;

    this.service.deleteUser(userId)
      .then(deletedUser => {
        logger.info(`Successfully deleted user ${userId}`, deletedUser);

        return res.status(204).json(createResponse(true, messages.successfullyDeletedUser));
      })
      .catch(error => {
        logger.error(error.message, error);

        return res.status(502).json(createResponse(false, messages.failedToCreateUser));
      });
  }
}