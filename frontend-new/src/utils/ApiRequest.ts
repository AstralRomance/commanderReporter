import { AxiosResponse } from 'axios';

export class ApiRequest<T = unknown> {
  data: T;
  constructor(private _request: () => Promise<AxiosResponse<T>>, private _controller: AbortController) {}

  public abort(): void {
    this._controller.abort();
  }

  public fetch(): Promise<AxiosResponse<T>> {
    return this._request();
  }
}
