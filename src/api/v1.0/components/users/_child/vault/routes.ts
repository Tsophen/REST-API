import { Router } from "express";

import { ACTION, RESOURCE } from "$config/permissions";

import { Authorization } from "$api/v1.0/middleware/Authorization";
import { UsersVaultController } from "./controller";

export class UsersVaultRoutes {
  private readonly authorization: Authorization = new Authorization();
  private readonly controller: UsersVaultController = new UsersVaultController();
  private readonly _router: Router = Router();

  public constructor() {
    this.initRoutes();
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
    
    /** Update user's vault */
    this.router.get("/",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.LOAD_ONE),
      this.controller.getVault.bind(this.controller)
    );

    /** Update user's vault */
    this.router.patch("/",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.UPDATE_ONE),
      this.controller.updateVault.bind(this.controller)
    );
  }
}