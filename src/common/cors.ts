import { Request, Response, NextFunction } from "express";

let ALLOWED_ORIGINS = ["http://localhost:3000",
  "https://tsophen.com", "https://www.tsophen.com",
  "https://tsofen.net", "https://www.tsofen.net",
  "https://tsofen.io", "https://www.tsofen.io"
];

const cors = (req: Request, res: Response, next: NextFunction) => {
  let origin = req.headers.origin;
  let allowOrigin = (origin && ALLOWED_ORIGINS.includes(origin)) ? origin : ALLOWED_ORIGINS[0];

  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "Set-Cookie, Cookie");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Accept, X-Token, Content-Type, X-Requested-With, Origin, Cookie");

  if(req.method == "OPTIONS")
    return res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT").status(200).json({});

  return next();
}

export default cors;