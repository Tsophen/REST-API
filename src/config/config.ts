import dotenv from "dotenv";

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const SERVER_HTTP_PORT = process.env.SERVER_HTTP_PORT;
const SERVER_HTTPS_PORT = process.env.SERVER_HTTPS_PORT;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  httpPort: SERVER_HTTP_PORT,
  httpsPort: SERVER_HTTPS_PORT
}

const config = {
  server: SERVER
}

export default config;