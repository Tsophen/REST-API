import { Router } from "express";

import { ACTION, RESOURCE } from "$config/permissions";

import { Authorization } from "$api/v1.0/middleware/Authorization";
import { UsersController } from "./controller";

import { UsersVaultRoutes } from "./_child/vault/routes";

export class UsersRoutes {
  private readonly authorization: Authorization = new Authorization();
  private readonly controller: UsersController = new UsersController();
  private readonly _router: Router = Router();

  public constructor() {
    // Initializing child routes first to handle specific GET requests before a user GET request.
    // If we initialized main routes first, requesting "GET api.tsophen.com/v1.0/users/vault" with an access token
    // would return permission denied because it'll try to load the whole user with the ID of vault.
    this.initChildRoutes();
    this.initRoutes();
  }

  public get router(): Router {
		return this._router;
	}

  /**
   * Initializing all child routes of the user component
   * 
   * Explanation: router.<METHOD>(<ENDPOINT>, [...<MIDDLEWARES>], <HANDLER>)
   */
   private initChildRoutes(): void {
    this.router.use("/vault/", new UsersVaultRoutes().router);
  }

  /**
   * Initializing all routes of the user component
   * 
   * Explanation: router.<METHOD>(<ENDPOINT>, [...<MIDDLEWARES>], <HANDLER>)
   */
  private initRoutes(): void {
    /** Retrieve all users */
    this.router.get("/",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.READ_ALL_INSTANCES),
      this.controller.readUsers.bind(this.controller)
    );
  
    /** Retrieve specific user */
    this.router.get("/:userId",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.READ_ONE_INSTANCE),
      this.controller.readUser.bind(this.controller)
    );

    /** Create user */
    this.router.post("/",
      this.controller.createUser.bind(this.controller)
    );

    /** Update user */
    this.router.put("/:userId",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.UPDATE_ALL_FIELDS),
      this.controller.updateUser.bind(this.controller)
    );

    /** Delete user */
    this.router.delete("/:userId",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.DELETE_ONE_INSTANCE),
      this.controller.deleteUser.bind(this.controller)
    );
  }
}