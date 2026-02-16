import { useEffect, useState } from "react";
import { Button, Modal, TextInput, Stack } from "@mantine/core";
import { getAuthUrl, integrateOAuth, getIntegrationStatus } from "../services/API";

type Props = {
  provider: "sap" | "oracle";
  companyId: number;
};

export const ConnectButton = ({ provider, companyId }: Props) => {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [secret, setSecret] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    const check = async () => {
      try {
        const status = await getIntegrationStatus(provider, companyId);
        setConnected(status);
      } catch {
        console.error("Status check failed");
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [provider, companyId]);

  const resetForm = () => {
    setClientId("");
    setSecret("");
    setBaseUrl("");
    setError(null);
  };

  const startOAuth = async () => {
    const url = await getAuthUrl(provider, companyId);
    window.location.href = url;
  };

  const handleSubmit = async () => {
    const trimmedClient = clientId.trim();
    const trimmedSecret = secret.trim();
    const trimmedUrl = baseUrl.trim();

    if (!trimmedClient || !trimmedSecret || !trimmedUrl) {
      setError("All fields are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await integrateOAuth(provider, {
        companyId,
        client_id: trimmedClient,
        client_secret: trimmedSecret,
        base_url: trimmedUrl,
      });

      setOpened(false);
      resetForm();
      await startOAuth();

    } catch (err) {
      console.error("Integration failed", err);
      setError("Failed to save integration. Please check credentials.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Button disabled>Loading...</Button>;

  if (connected) return <Button disabled>Connected ✓</Button>;

  return (
    <>
      <Button onClick={() => setOpened(true)}>
        Connect {provider.toUpperCase()}
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          resetForm();
        }}
        title={`Connect ${provider.toUpperCase()}`}
        centered
      >
        <Stack>
          <TextInput
            label="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Client Secret"
            value={secret}
            onChange={(e) => setSecret(e.currentTarget.value)}
            required
          />

          <TextInput
            label="Base URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.currentTarget.value)}
            required
          />

          {error && (
            <div style={{ color: "red", fontSize: 14 }}>{error}</div>
          )}

          <Button
            loading={saving}
            onClick={handleSubmit}
            disabled={saving}
          >
            Save & Connect
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
