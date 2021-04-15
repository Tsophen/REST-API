import express from "express";

import { UsersRoutes } from "./components/users/routes";

const router = express.Router();

router.use("/users", new UsersRoutes().router);

export default router;