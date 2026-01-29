import axios from "axios";
import * as Sentry from "@sentry/react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest?.hostUri;
  const host = hostUri?.split(":")[0];

  if (host) {
    const resolvedHost =
      Platform.OS === "android" && (host === "localhost" || host === "127.0.0.1")
        ? "10.0.2.2"
        : host;
    return `http://${resolvedHost}:3000/api`;
  }

  return "http://localhost:3000/api";
};

const API_URL = getApiUrl();

// this is the same thing we did with useEffect setup but it's optimized version - it's better!!

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor registered once
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      Sentry.logger.error(
        Sentry.logger
          .fmt`API request failed: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        { status: error.response.status, endpoint: error.config?.url, method: error.config?.method }
      );
    } else if (error.request) {
      Sentry.logger.warn("API request failed - no response", {
        endpoint: error.config?.url,
        method: error.config?.method,
      });
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T>(config: Parameters<typeof api.request>[0]) => {
      const token = await getToken();
      return api.request<T>({
        ...config,
        headers: { ...config.headers, ...(token && { Authorization: `Bearer ${token}` }) },
      });
    },
    [getToken]
  );

  return { api, apiWithAuth };
};
