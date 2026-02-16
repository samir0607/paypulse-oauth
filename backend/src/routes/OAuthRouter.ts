import { Router } from "express";
import OAuthController from "../controllers/OAuthController";

export const OAuthRouter = Router();

OAuthRouter.get("/sap/url", OAuthController.getSAPAuthUrl);
OAuthRouter.get("/oracle/url", OAuthController.getOracleAuthUrl);

OAuthRouter.get("/sap/callback", OAuthController.sapCallback);
OAuthRouter.get("/oracle/callback", OAuthController.oracleCallback);

OAuthRouter.post("/sap/integrate", OAuthController.integrateSAP);
OAuthRouter.post("/oracle/integrate", OAuthController.integrateOracle);
