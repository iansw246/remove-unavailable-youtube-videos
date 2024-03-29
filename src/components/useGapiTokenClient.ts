import { useEffect, useState } from "react";
import { TokenClient } from "../utils/requestHelpers";

function getEnvVarSafe(envVarName: string): string {
  const value = process.env[envVarName];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `Expected environment variable ${envVarName} to be defined, but was ${value}`,
    );
  }
  return value;
}

const youtubeApiName: string = "youtube";
const youtubeApiVersion: string = "v3";
const youtubeDiscoveryUrl = `https://www.googleapis.com/discovery/v1/apis/${youtubeApiName}/${youtubeApiVersion}/rest`;

const CLIENT_ID = getEnvVarSafe("REACT_APP_GAPI_CLIENT_ID");
const API_KEY = getEnvVarSafe("REACT_APP_GAPI_API_KEY");

const DEFAULT_YOUTUBE_SCOPES = "https://www.googleapis.com/auth/youtube";

/**
 * Loads the gapi client library and YouTube api definitions/discovery
 */
async function loadGapiLibrary() {
  await (window as any).gapiLoadPromise;
  await new Promise((resolve, reject) => {
    gapi.load("client", { callback: resolve, onerror: reject });
  });
  await gapi.client.init({
    apiKey: API_KEY,
    // clientId: CLIENT_ID // The API still works without this
  });
  await gapi.client.load(youtubeDiscoveryUrl);
  await (window as any).gisLoadPromise;
}

/**
 *
 * @param onTokenResponse Callback when user logs in with Google account
 * @returns Promise with token client
 */
function initTokenClient(
  onTokenResponse:
    | ((tokenResponse: google.accounts.oauth2.TokenResponse) => void)
    | null,
  scope: google.accounts.oauth2.TokenClientConfig["scope"] = DEFAULT_YOUTUBE_SCOPES,
  prompt: google.accounts.oauth2.TokenClientConfig["prompt"] = "",
): TokenClient {
  return google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: scope,
    prompt: prompt,
    callback: (tokenResponse) => {
      onTokenResponse?.(tokenResponse);
    },
  });
}

/**
 *
 * @param onGapiTokenClientLoaded Callback when the token client is loaded and ready to accept login requests
 * @param onGapiTokenClientLoadFail Callback when token client fails to load successfully
 * @param onTokenResponse Callback when user logs in with Google account
 */
export default function useGapiTokenClient(
  onGapiTokenClientLoaded: (tokenClient: TokenClient) => void,
  onGapiTokenClientLoadFail: (error: unknown) => void,
  onTokenResponse:
    | ((tokenResponse: google.accounts.oauth2.TokenResponse) => void)
    | null,
) {
  const [isGapiLoaded, setIsGapiLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadGapiLibrary().then(() => setIsGapiLoaded(true));
  }, []);
  useEffect(() => {
    if (!isGapiLoaded) {
      return;
    }
    try {
      const tokenClient = initTokenClient(onTokenResponse);
      onGapiTokenClientLoaded(tokenClient);
    } catch (error) {
      onGapiTokenClientLoadFail(error);
    }
  }, [
    isGapiLoaded,
    onTokenResponse,
    onGapiTokenClientLoaded,
    onGapiTokenClientLoadFail,
  ]);
}
