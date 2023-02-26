import axios, { AxiosRequestConfig } from 'axios';
import { ApiRequest } from './ApiRequest';

export class ApiCaller {
  private _baseUrl: string = '';

  constructor(_baseUrl: string = '') {
    const uriPrefix = import.meta.env.VITE_SERVER_URI || '';

    this._baseUrl = uriPrefix + _baseUrl;
  }

  /* async request<T = any>(cfg: AxiosRequestConfig): Promise<ApiRequest<T>> {
    const controller = ApiCaller.newTokenSource;
    const request = axios.request<T>({ ...cfg, baseURL: this._baseUrl, cancelToken: source.token });
    return new ApiRequest<T>(request, source);
  } */

  get<T = any>(url: string, cfg?: AxiosRequestConfig): ApiRequest<T> {
    const controller = new AbortController();
    const request = axios.get.bind(this, this._baseUrl + url, {
      ...cfg,
      signal: controller.signal,
    });
    return new ApiRequest<T>(request, controller);
  }

  post<T = any>(url: string, body: any, cfg?: AxiosRequestConfig): ApiRequest<T> {
    const controller = new AbortController();
    const request = axios.post.bind(this, this._baseUrl + url, body, {
      ...cfg,
      signal: controller.signal,
    });
    return new ApiRequest<T>(request, controller);
  }

  patch<T = any>(url: string, data: any, cfg?: AxiosRequestConfig): ApiRequest<T> {
    const controller = new AbortController();
    const request = axios.patch.bind(this, this._baseUrl + url, data, {
      ...cfg,
      signal: controller.signal,
    });
    return new ApiRequest<T>(request, controller);
  }

  put<T = any>(url: string, data: any, cfg?: AxiosRequestConfig): ApiRequest<T> {
    const controller = new AbortController();
    const request = axios.put.bind(this, this._baseUrl + url, data, {
      ...cfg,
      signal: controller.signal,
    });
    return new ApiRequest<T>(request, controller);
  }

  delete<T = any>(url: string, cfg?: AxiosRequestConfig): ApiRequest<T> {
    const controller = new AbortController();
    const request = axios.delete.bind(this, this._baseUrl + url, {
      ...cfg,
      signal: controller.signal,
    });
    return new ApiRequest<T>(request, controller);
  }
}
