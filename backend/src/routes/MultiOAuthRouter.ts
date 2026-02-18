import { Router } from "express";
import  { MultiOAuthController } from "../controllers/MultiOAuthController";

const OAuthRouter = Router();

OAuthRouter.post("/:provider/integrate", MultiOAuthController.integrate);
OAuthRouter.get("/:provider/auth-url", MultiOAuthController.getAuthUrl);
OAuthRouter.get("/:provider/callback", MultiOAuthController.callback);
OAuthRouter.get("/:provider/status", MultiOAuthController.status);

export default OAuthRouter;
