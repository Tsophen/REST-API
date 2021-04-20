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
    /** Logs in with credentials and creates access & refresh tokens */
    this.router.post("/login",
      this.authorization.checkCredentials,
      this.controller.createTokens.bind(this.controller)
    );

    /** Creates access & refresh tokens */
    this.router.get("/refresh-token",
      this.authorization.checkRefreshToken,
      this.controller.createTokens.bind(this.controller)
    );
  }

  /**
   * Initializing all child routes of the auth component
   * 
   * Explanation: router.<METHOD>(<ENDPOINT>, [...<MIDDLEWARES>], <HANDLER>)
   */
  private initChildRoutes(): void {}
}