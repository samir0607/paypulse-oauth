import { Request, Response } from "express";
import { randomUUID } from "crypto";


export default class OAuthController {
  public static async getSAPAuthUrl(req: Request, res: Response) {
    try {
      const state = randomUUID();
			const baseUrl = process.env.SAP_BASE_URL;
			const clientId = process.env.SAP_CLIENT_ID;
			const redirectUri = process.env.SAP_REDIRECT_URI;

      if (!baseUrl || !clientId || !redirectUri) {
        return res.status(500).json({
          message: "SAP OAuth configuration missing",
        });
      }
			console.log(300)
      const url =
        `${baseUrl}/oauth/authorize` +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}`;

      return res.status(200).json({url});

    } catch (error) {
      console.error("SAP OAuth URL error:", error);
      return res.status(500).json({
        message: "Failed to generate SAP OAuth URL",
      });
    }
  }

  public static async getOracleAuthUrl(req: Request, res: Response) {
    try {
      const state = randomUUID();
			const baseUrl = process.env.SAP_BASE_URL;
			const clientId = process.env.SAP_CLIENT_ID;
			const redirectUri = process.env.SAP_REDIRECT_URI;

      if (!baseUrl || !clientId || !redirectUri) {
        return res.status(500).json({
          message: "Oracle OAuth configuration missing",
        });
      }

      const url =
        `${baseUrl}/oauth2/v1/authorize` +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}`;

      return res.status(200).redirect(url);

    } catch (error) {
      console.error("Oracle OAuth URL error:", error);
      return res.status(500).json({
        message: "Failed to generate Oracle OAuth URL",
      });
    }
  }
}
