import { Request, Response } from "express";
import { OAuthService } from "../services/OAuthService";
import ErrorHandler from "../handler/ErrorHandler";
import { ResponseHandler } from "../handler/ResponseHandler";
import { IntegrationRepository } from "../db/repository/IntegrationRepository";


export default class OAuthController {

  public static async getSAPAuthUrl(req: Request, res: Response) {
    try {
      const companyId = req.body.companyId;

      const callback = `${process.env.CURRENT_URL}/auth/sap/callback`;

      const result = await OAuthService.getSAPRedirectURL(callback, companyId);

      if (result.isError()) throw new Error(result.getError());

      ResponseHandler.sendSuccessResponse(res, "URL Generated", {
        url: result.getData(),
      });

    } catch (err) {
      ErrorHandler(err, res);
    }
  }

  public static async sapCallback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;

      const callback = `${process.env.CURRENT_URL}/auth/sap/callback`;

      const result = await OAuthService.handleSAPCallback(
        code as string,
        state as string,
        callback
      );

      if (result.isError()) throw new Error(result.getError());

      res.redirect(`${process.env.FRONTEND_URL}/integration-success`);

    } catch (err) {
      ErrorHandler(err, res);
    }
  }

  public static async integrateSAP(req: Request, res: Response) {
    try {
      const { companyId, client_id, client_secret, base_url } = req.body;
      if(!companyId || !client_id || !client_secret || !base_url) {
        throw new Error("companyId or client_id or client_secret or base_url is missing")
      }
      await IntegrationRepository.createIntegration({
        company_id: companyId,
        type: "sap",
        client_id,
        client_secret,
        base_url
      });
      ResponseHandler.sendSuccessResponse(res, "SAP credentials inserted");
    } catch(error) {
      ErrorHandler(error, res);
    }
  }

  public static async getOracleAuthUrl(req: Request, res: Response) {
    try {
      const companyId = req.body.companyId;

      const callback = `${process.env.CURRENT_URL}/auth/oracle/callback`;

      const result = await OAuthService.getOracleRedirectURL(
        callback,
        companyId
      );

      if (result.isError()) throw new Error(result.getError());

      ResponseHandler.sendSuccessResponse(res, "URL Generated", {
        url: result.getData(),
      });

    } catch (err) {
      ErrorHandler(err, res);
    }
  }
  public static async oracleCallback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;

      const callback = `${process.env.CURRENT_URL}/auth/oracle/callback`;

      const result = await OAuthService.handleOracleCallback(
        code as string,
        state as string,
        callback
      );

      if (result.isError()) throw new Error(result.getError());

      res.redirect(`${process.env.FRONTEND_URL}/integration-success`);

    } catch (err) {
      ErrorHandler(err, res);
    }
  }

  public static async integrateOracle(req: Request, res: Response) {
    try {
      const { companyId, client_id, client_secret, base_url } = req.body;
      if(!companyId || !client_id || !client_secret || !base_url) {
        throw new Error("companyId or client_id or client_secret or base_url is missing")
      }
      await IntegrationRepository.createIntegration({
        company_id: companyId,
        type: "oracle",
        client_id,
        client_secret,
        base_url
      });
      ResponseHandler.sendSuccessResponse(res, "SAP credentials inserted");
    } catch(error) {
      ErrorHandler(error, res);
    }
  }
}
