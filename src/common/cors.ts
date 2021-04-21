import { Request, Response, NextFunction } from "express";

const corss = (req: Request, res: Response, next: NextFunction) => {
  // TODO: add all domains
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Expose-Headers", "Set-Cookie, Cookie");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Accept, X-Token, Content-Type, X-Requested-With, Origin, Cookie");

  if(req.method == "OPTIONS")
    return res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT").status(200).json({});

  return next();
}

export default corss;