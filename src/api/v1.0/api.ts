import express from "express";

import { UsersRoutes } from "./components/users/routes";
import { AuthRoutes } from "./components/auth/routes";

const router = express.Router();

router.use("/users", new UsersRoutes().router);
router.use("/auth", new AuthRoutes().router);

export default router;