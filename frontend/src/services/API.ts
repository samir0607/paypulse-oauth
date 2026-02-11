export const APIv1 = "http://localhost:5010";

export const getSAPAuthUrl = async () => {
  const res = await fetch(`${APIv1}/auth/sap/url`);
  const data = await res.json();
  return data.url;
};

export const getOracleAuthUrl = async () => {
  const res = await fetch(`${APIv1}/auth/oracle/url`);
  const data = await res.json();
  return data.url;
};
