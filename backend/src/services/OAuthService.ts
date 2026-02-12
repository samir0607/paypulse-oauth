import axios from "axios";
import { randomUUID } from "crypto";
import { Result } from "../utils/Result";
import { OAuthStateStore } from "../stores/OAuthStateStore";

type GetRedirectError = "INVALID_CONFIG";
type CallbackError = "INVALID_STATE" | "TOKEN_ERROR";

export class OAuthService {

  public static async getSAPRedirectURL(
    callbackUrl: string,
    companyId: string
  ): Promise<Result<string, GetRedirectError>> {

    if (!process.env.SAP_BASE_URL || !process.env.SAP_CLIENT_ID) {
      return Result.error("INVALID_CONFIG");
    }

    const state = randomUUID();

    const params = {
      response_type: "code",
      client_id: process.env.SAP_CLIENT_ID!,
      redirect_uri: callbackUrl,
      state,
    };

    const url = new URL(`${process.env.SAP_BASE_URL}/oauth/authorize`);
    url.search = new URLSearchParams(params).toString();

    OAuthStateStore.addState(state, {
      system: "SAP",
      companyId,
    });

    return Result.success(url.toString());
  }

  public static async handleSAPCallback(
    code: string,
    state: string,
    callbackUrl: string
  ): Promise<Result<any, CallbackError>> {

    if (!OAuthStateStore.isValidState(state)) {
      return Result.error("INVALID_STATE");
    }

    try {
      const tokenUrl = `${process.env.SAP_BASE_URL}/oauth/token`;

      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.SAP_CLIENT_ID!,
          client_secret: process.env.SAP_CLIENT_SECRET!,
          redirect_uri: callbackUrl,
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      OAuthStateStore.removeState(state);

      return Result.success(response.data);

    } catch {
      return Result.error("TOKEN_ERROR");
    }
  }

  public static async getOracleRedirectURL(
    callbackUrl: string,
    companyId: string
  ): Promise<Result<string, GetRedirectError>> {

    if (!process.env.ORACLE_BASE_URL || !process.env.ORACLE_CLIENT_ID) {
      return Result.error("INVALID_CONFIG");
    }

    const state = randomUUID();

    const params = {
      response_type: "code",
      client_id: process.env.ORACLE_CLIENT_ID!,
      redirect_uri: callbackUrl,
      state,
    };

    const url = new URL(`${process.env.ORACLE_BASE_URL}/oauth2/v1/authorize`);
    url.search = new URLSearchParams(params).toString();

    OAuthStateStore.addState(state, {
      system: "ORACLE",
      companyId,
    });

    return Result.success(url.toString());
  }

  public static async handleOracleCallback(
    code: string,
    state: string,
    callbackUrl: string
  ): Promise<Result<any, CallbackError>> {

    if (!OAuthStateStore.isValidState(state)) {
      return Result.error("INVALID_STATE");
    }

    try {
      const tokenUrl = `${process.env.ORACLE_BASE_URL}/oauth2/v1/token`;

      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.ORACLE_CLIENT_ID!,
          client_secret: process.env.ORACLE_CLIENT_SECRET!,
          redirect_uri: callbackUrl,
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      OAuthStateStore.removeState(state);

      return Result.success(response.data);

    } catch {
      return Result.error("TOKEN_ERROR");
    }
  }
}
