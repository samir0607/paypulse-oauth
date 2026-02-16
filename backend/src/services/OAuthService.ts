import axios from "axios";
import { randomUUID } from "crypto";
import { Result } from "../utils/Result";
import { OAuthStateStore } from "../stores/OAuthStateStore";
import { IntegrationRepository } from "../db/repository/IntegrationRepository";

type Provider = "sap" | "oracle";

type GetRedirectError = "INVALID_CONFIG";
type CallbackError = "INVALID_STATE" | "TOKEN_ERROR";

const providerConfig: Record<Provider, { authorizePath: string; tokenPath: string }> = {
  sap: {
    authorizePath: "/oauth/authorize",
    tokenPath: "/oauth/token",
  },
  oracle: {
    authorizePath: "/oauth2/v1/authorize",
    tokenPath: "/oauth2/v1/token",
  },
};

export class OAuthService {
  public static async integrate(provider: Provider, company_id: number, client_id: string, client_secret: string, base_url: string) {
    await IntegrationRepository.createIntegration({
      company_id,
      type: provider,
      client_id,
      client_secret,
      base_url,
    });
  }

  public static async getRedirectURL(provider: Provider, callbackUrl: string,companyId: number): Promise<Result<string, GetRedirectError>> {
    const integration = await IntegrationRepository.getIntegrationByCompanyIdAndType(companyId, provider);
    if (!integration) {
      return Result.error("INVALID_CONFIG");
    }

    const state = randomUUID();

    const params = {
      response_type: "code",
      client_id: integration.client_id,
      redirect_uri: callbackUrl,
      state,
    };

    const url = new URL(`${integration.base_url}${providerConfig[provider].authorizePath}`);
    url.search = new URLSearchParams(params).toString();

    OAuthStateStore.addState(state, {
      system: provider,
      companyId,
    });

    return Result.success(url.toString());
  }

  public static async handleCallback(provider: Provider, code: string, state: string, callbackUrl: string,): Promise<Result<any, CallbackError>> {
    const stateData = OAuthStateStore.getData(state);
    if (!stateData) return Result.error("INVALID_STATE");

    const { companyId } = stateData;

    const integration = await IntegrationRepository.getIntegrationByCompanyIdAndType(companyId,provider);

    if (!integration) return Result.error("INVALID_STATE");

    try {
      const tokenUrl = `${integration.base_url}${providerConfig[provider].tokenPath}`;

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
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      OAuthStateStore.removeState(state);

      return Result.success(response.data);
    } catch {
      return Result.error("TOKEN_ERROR");
    }
  }
}
