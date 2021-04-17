import { Router } from "express";

import { ACTION, RESOURCE } from "../../../../config/permissions";

import { Authorization } from "../../middleware/Authorization";
import { UsersController } from "./controller";

export class UsersRoutes {
  private readonly authorization: Authorization = new Authorization();
  private readonly controller: UsersController = new UsersController();
  private readonly _router: Router = Router();

  public constructor() {
    this.initRoutes();
    this.initChildRoutes();
  }

  public get router(): Router {
		return this._router;
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
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.READ_ALL),
      this.controller.readUsers.bind(this.controller)
    );
  
    /** Retrieve specific user */
    this.router.get("/:userId",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.READ_ONE),
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
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.DELETE_ONE),
      this.controller.deleteUser.bind(this.controller)
    );
  }

  /**
   * Initializing all child routes of the user component
   * 
   * Explanation: router.<METHOD>(<ENDPOINT>, [...<MIDDLEWARES>], <HANDLER>)
   */
  private initChildRoutes(): void {
    
  }
}