import { Router } from "express";
import OAuthController from "../controllers/OAuthController";

const OAuthRouter = Router();

OAuthRouter.post("/:provider/integrate", OAuthController.integrate);
OAuthRouter.get("/:provider/auth-url", OAuthController.getAuthUrl);
OAuthRouter.get("/:provider/callback", OAuthController.callback);

export default OAuthRouter;
