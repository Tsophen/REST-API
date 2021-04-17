import { Router } from "express";

import { Authorization } from "$api/v1.0/middleware/Authorization";
import { AuthController } from "./controller";

export class AuthRoutes {
  private readonly authorization: Authorization = new Authorization();
  private readonly controller: AuthController = new AuthController();
  private readonly _router: Router = Router();

  public constructor() {
    this.initRoutes();
    this.initChildRoutes();
  }

  public get router(): Router {
		return this._router;
	}

  /**
   * Initializing all routes of the auth component
   * 
   * Explanation: router.<METHOD>(<ENDPOINT>, [...<MIDDLEWARES>], <HANDLER>)
   */
  private initRoutes(): void {
    /** Creates an access token */
    this.router.post("/access-token",
      this.authorization.checkLoginDetailsOrRefreshToken.bind(this.authorization),
      this.controller.createAccessToken.bind(this.controller)
    );

    /** Creates a refresh token */
    this.router.post("/refresh-token",
      this.authorization.checkLoginDetails,
      this.controller.createRefreshToken.bind(this.controller)
    );
  }

  /**
   * Initializing all child routes of the auth component
   * 
   * Explanation: router.<METHOD>(<ENDPOINT>, [...<MIDDLEWARES>], <HANDLER>)
   */
  private initChildRoutes(): void {
    
  }
}