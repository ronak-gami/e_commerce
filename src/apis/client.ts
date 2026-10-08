import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export const BASE_URL = 'https://makeup-api.herokuapp.com';

// In-memory token store
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Axios Client Instance
 */
export const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 */
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject Authorization header if token exists
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (__DEV__) {
      console.log(
        `🚀 [API Request] [${config.method?.toUpperCase()}] ${config.baseURL || ''}${config.url}`,
        config.params ? { params: config.params } : '',
        config.data ? { body: config.data } : ''
      );
    }

    return config;
  },
  (error: any) => {
    if (__DEV__) {
      console.error('❌ [API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log(
        `✅ [API Response] [${response.status}] ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Handle Network / Offline error
    if (!error.response) {
      if (__DEV__) {
        console.error('🌐 [Network Error] Please check your internet connection.');
      }
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        status: null,
        raw: error,
      });
    }

    const status = error.response.status;
    const errorData = error.response.data;

    if (__DEV__) {
      console.error(`❌ [API Error] [${status}] ${originalRequest?.url}`, errorData);
    }

    switch (status) {
      case 401:
        // Handle Unauthorized / Session Expiry (e.g., trigger logout or refresh token)
        break;
      case 403:
        // Handle Forbidden
        break;
      case 404:
        // Handle Not Found
        break;
      case 500:
      case 502:
      case 503:
        // Handle Server Error
        break;
      default:
        break;
    }

    return Promise.reject({
      status,
      message: errorData?.message || error.message || 'Something went wrong',
      data: errorData,
      raw: error,
    });
  }
);

export default client;
