import { Router } from "express";

import { ACTION, RESOURCE } from "../../../../config/permissions";

import { AuthService } from "../../../../services/AuthService";

import { UsersController } from "./controller";

export class UsersRoutes {
  private readonly authService: AuthService = new AuthService();
  private readonly controller: UsersController = new UsersController();
  private _router: Router = Router();

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
    this.router.get(
      "/",
      this.authService.checkAuthorizationToken,
      this.authService.hasPermission(RESOURCE.users, ACTION.READ_ALL),
      this.controller.readUsers.bind(this.controller)
    );
  
    this.router.get(
      "/:userId",
      this.authService.checkAuthorizationToken,
      this.authService.hasPermission(RESOURCE.users, ACTION.READ),
      this.controller.readUser.bind(this.controller)
    );

    this.router.post(
      "/",
      this.controller.createUser.bind(this.controller)
    );

    this.router.put(
      "/:userId",
      this.authService.checkAuthorizationToken,
      this.authService.hasPermission(RESOURCE.users, ACTION.UPDATE_ALL),
      this.controller.updateUser.bind(this.controller)
    );

    this.router.delete(
      "/:userId",
      this.authService.checkAuthorizationToken,
      this.authService.hasPermission(RESOURCE.users, ACTION.DELETE),
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