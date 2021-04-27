import 'module-alias/register';

import https from "https";
import http from "http";
import path from "path";
import fs from "fs";

import express from "express";
import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import cors from "$common/cors";
import errorHandler from "$common/errorHandler";

import config from "$config/config";
import logger from "$config/logger";

import primary from "./routes/primary";
import api_v1_0 from "./api/v1.0/api";

if(!process.env.MONGODB_URI) {
  console.log("Your MongoDB URI in the .env file is not set! Please set it before running the REST-API!");
  process.exit();
}

/** Initializing Logger, Express, MongoDB */
const router = express();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => logger.info("Connected to MongoDB")).catch(error => logger.error("Could not connect to MongoDB", error));


/** Enabling the logger for every request */
router.use((req, res, next) => {
  logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.ip}]`);
  res.on("finish", () => logger.info(`METHOD: [${req.method}] - URL: [${req.baseUrl}] - IP: [${req.ip}] - STATUS: [${res.statusCode}]`));
  next();
});

/** Configuring Express & Applying CORS */
router.use(express.static(path.join(__dirname, "..", "public")));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(cookieParser());
router.use(compression());
router.use(helmet({ contentSecurityPolicy: false }));

router.use(cors);

/** Routes to handle endpoints */
router.use("/", primary);
router.use("/v1.0/", api_v1_0);

/** Applying the error handler to handle every request that was not solved by this point */
router.use(errorHandler);

/** Creating an HTTP router to redirect to HTTPS */
const httpRouter = express();
httpRouter.get('*', (req, res) => res.redirect('https://' + req.headers.host + req.url));

/** SSL Certificate */
const options = {
  key: fs.readFileSync("./cert/key.pem", "utf8"),
  cert: fs.readFileSync("./cert/server.crt", "utf8"),
}

/** Running the REST-API */
http.createServer(httpRouter).listen(config.server.httpPort, () => logger.info(`REST-API is running on ${config.server.hostname}:${config.server.httpPort}`));
https.createServer(options, router).listen(config.server.httpsPort, () => logger.info(`REST-API is running on ${config.server.hostname}:${config.server.httpsPort}`));