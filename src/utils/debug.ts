import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const debugLogger = {
  request: (config: AxiosRequestConfig) => {
    const { method, url, baseURL, headers, data } = config;
    console.group('🌐 API Request');
    console.log('URL:', `${baseURL}${url}`);
    console.log('Method:', method?.toUpperCase());
    console.log('Headers:', headers);
    if (data) console.log('Data:', data);
    console.groupEnd();
  },

  response: (response: AxiosResponse) => {
    const { status, config, data } = response;
    console.group('✅ API Response');
    console.log('URL:', `${config.baseURL}${config.url}`);
    console.log('Status:', status);
    console.log('Data:', data);
    console.groupEnd();
  },

  error: (error: AxiosError) => {
    console.group('❌ API Error');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Response Data:', error.response?.data);
    console.log('Error Message:', error.message);
    console.groupEnd();
  }
};