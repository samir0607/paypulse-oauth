import axios from "axios";
import { randomUUID } from "crypto";
import { Result } from "../utils/Result";
import { OAuthStateStore } from "../stores/OAuthStateStore";
import { IntegrationRepository } from "../db/repository/IntegrationRepository";

type GetRedirectError = "INVALID_CONFIG";
type CallbackError = "INVALID_STATE" | "TOKEN_ERROR";

export class OAuthService {

  public static async getSAPRedirectURL(
    callbackUrl: string,
    companyId: number
  ): Promise<Result<string, GetRedirectError>> {

    const integration = await IntegrationRepository.getIntegrationByCompanyIdAndType(companyId, "sap");
    if(!integration) {
      throw new Error("Integration Not Found!");
    }
    const state = randomUUID();

    const params = {
      response_type: "code",
      client_id: integration.client_id,
      redirect_uri: callbackUrl,
      state,
    };

    const url = new URL(`${integration.base_url}/oauth/authorize`);
    url.search = new URLSearchParams(params).toString();

    OAuthStateStore.addState(state, {
      system: "sap",
      companyId,
    });

    return Result.success(url.toString());
  }

  public static async handleSAPCallback(
    code: string,
    state: string,
    callbackUrl: string
  ): Promise<Result<any, CallbackError>> {

    const stateData = OAuthStateStore.getData(state);

    if (!stateData) {
      return Result.error("INVALID_STATE");
    }

    const { companyId } = stateData;

    const integration = await IntegrationRepository.getIntegrationByCompanyIdAndType(companyId, "sap");
    if (!integration) {
      return Result.error("INVALID_STATE");
    }

    try {
      const tokenUrl = `${integration.base_url}/oauth/token`;

      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: integration.client_id,
          client_secret: integration.client_secret,
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
    companyId: number
  ): Promise<Result<string, GetRedirectError>> {

    const integration = await IntegrationRepository.getIntegrationByCompanyIdAndType(companyId, "oracle");
    if(!integration) {
      throw new Error("Integration Not Found!");
    }

    const state = randomUUID();

    const params = {
      response_type: "code",
      client_id: integration.client_id,
      redirect_uri: callbackUrl,
      state,
    };

    const url = new URL(`${integration.base_url}/oauth2/v1/authorize`);
    url.search = new URLSearchParams(params).toString();

    OAuthStateStore.addState(state, {
      system: "oracle",
      companyId,
    });

    return Result.success(url.toString());
  }

  public static async handleOracleCallback(
    code: string,
    state: string,
    callbackUrl: string
  ): Promise<Result<any, CallbackError>> {

    const stateData = OAuthStateStore.getData(state);

    if (!stateData) {
      return Result.error("INVALID_STATE");
    }

    const { companyId } = stateData;

    const integration = await IntegrationRepository.getIntegrationByCompanyIdAndType(companyId, "oracle");
    if(!integration) {
      return Result.error("INVALID_STATE");
    }

    try {
      const tokenUrl = `${integration.base_url}/oauth2/v1/token`;

      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: integration.client_id,
          client_secret: integration.client_secret,
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
