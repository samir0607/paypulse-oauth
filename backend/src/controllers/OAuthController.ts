import { Request, Response } from "express";
import { OAuthService } from "../services/OAuthService";
import ErrorHandler from "../handler/ErrorHandler";
import { ResponseHandler } from "../handler/ResponseHandler";

type Provider = "sap" | "oracle";

export default class OAuthController {
  private static getCallback(provider: Provider) {
    return `${process.env.CURRENT_URL}/auth/${provider}/callback`;
  }

  public static async status(req: Request, res: Response) {
    try {
      const provider = req.params.provider as Provider;
      const companyId = Number(req.query.companyId);

      const connected = await OAuthService.getStatus(
        provider,
        companyId
      );

      ResponseHandler.sendSuccessResponse(res, "Status fetched", {
        connected,
      });

    } catch (e) {
      ErrorHandler(e, res);
    }
  }
  public static async integrate(req: Request, res: Response) {
    try {
      const provider = req.params.provider as Provider;
      const { companyId, client_id, client_secret, base_url } = req.body;

      if (!companyId || !client_id || !client_secret || !base_url) {
        throw new Error("Missing required integration fields");
      }

      await OAuthService.integrate(
        provider,
        companyId,
        client_id,
        client_secret,
        base_url,
      );

      ResponseHandler.sendSuccessResponse(
        res,
        `${provider.toUpperCase()} credentials inserted`,
      );
    } catch (err) {
      ErrorHandler(err, res);
    }
  }

  public static async getAuthUrl(req: Request, res: Response) {
    try {
      const provider = req.params.provider as Provider;
      const companyId = Number(req.query.companyId);

      if (!companyId) throw new Error("companyId missing");

      const callback = this.getCallback(provider);

      const result = await OAuthService.getRedirectURL(
        provider,
        callback,
        companyId,
      );

      if (result.isError()) throw new Error(result.getError());

      ResponseHandler.sendSuccessResponse(res, "URL Generated", {
        url: result.getData(),
      });
    } catch (err) {
      ErrorHandler(err, res);
    }
  }

  public static async callback(req: Request, res: Response) {
    try {
      const provider = req.params.provider as Provider;
      const { code, state } = req.query;

      if (!code || !state) throw new Error("Missing code/state");

      const callback = this.getCallback(provider);

      const result = await OAuthService.handleCallback(
        provider,
        code as string,
        state as string,
        callback,
      );

      if (result.isError()) throw new Error(result.getError());

      res.redirect(`${process.env.FRONTEND_URL}/integration-success`);
    } catch (err) {
      ErrorHandler(err, res);
    }
  }
}
