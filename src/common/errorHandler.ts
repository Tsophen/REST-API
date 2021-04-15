import { Request, Response, NextFunction } from "express";

import { createResponse } from "../config/response";

const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");

  return res.status(404).json(createResponse(false, error.message));
}

export default errorHandler;