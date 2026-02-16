import axios from "axios";
export const APIv1 = axios.create({
  baseURL: import.meta.env.BASE_URL
})

export const integrateOAuth = async (
  provider: string,
  payload: {
    companyId: number;
    client_id: string;
    client_secret: string;
    base_url: string;
  }
) => {
  const { data } = await APIv1.post(`/auth/${provider}/integrate`, payload);
  return data;
};


export const getAuthUrl = async (provider: string, companyId: number) => {
  const { data } = await APIv1.get(`/auth/${provider}/auth-url`, { params: { companyId } });
  return data.data.url; 
};

export const getIntegrationStatus = async (
  provider: string,
  companyId: number
) => {
  const { data } = await APIv1.get(
    `/integrations/${provider}/status`,
    { params: { companyId } }
  );
  return data.data.connected;
};