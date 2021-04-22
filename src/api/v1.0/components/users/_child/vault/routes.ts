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
    /** Loads user's vault */
    this.router.get("/",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.READ_ONE_FIELD),
      this.controller.loadVault.bind(this.controller)
    );

    /** Updates user's vault */
    this.router.put("/",
      this.authorization.checkAccessToken,
      (req, res, next) => this.authorization.checkPermissionLevel(req, res, next, RESOURCE.users, ACTION.UPDATE_ONE_FIELD),
      this.controller.updateVault.bind(this.controller)
    );
  }
}