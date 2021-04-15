import { Request, Response, NextFunction } from "express";

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-Requested-With, Origin");

  if(req.method == "OPTIONS")
    return res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT").status(200).json({});

  return next();
}

export default cors;