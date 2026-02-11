import { useState } from "react";
import { getOracleAuthUrl, getSAPAuthUrl } from "../services/API";

export const ConnectButton = ({type}: {type: "sap" | "oracle"}) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const url = (type==="sap")? await getSAPAuthUrl() : await getOracleAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error("SAP connection failed:", error);
      alert("Failed to connect to SAP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? "Connecting..." : (type==="sap")? "Connect SAP" : "Connect Oracle"}
    </button>
  );
};