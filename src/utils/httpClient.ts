import { getCookie } from './cookies';

interface HttpClientConfig {
  baseUrl: string;
}

class HttpClient {
  readonly _baseUrl: string;
  readonly _timeout: number;
  private readonly ACCESS_COOKIE_KEY = 'accessToken';

  constructor({ baseUrl }: HttpClientConfig) {
    this._baseUrl = baseUrl;
    this._timeout = 60000;
  }

  private getHeaders(init?: RequestInit): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json;charset=utf-8' };

    const accessToken = getCookie(this.ACCESS_COOKIE_KEY);
    if (accessToken) {
      headers['Authorization'] = accessToken;
    }

    if (init?.headers) {
      Object.assign(headers, init.headers);
    }

    return headers;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request(`${this._baseUrl}${path}`, {
      method: 'GET',
      headers: this.getHeaders(init),
      ...init,
    });
  }

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const initReq: RequestInit = {
      ...init,
      method: 'POST',
      headers: this.getHeaders(init),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    };

    return this.request(`${this._baseUrl}${path}`, initReq);
  }

  async patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const initReq: RequestInit = {
      ...init,
      method: 'PATCH',
      headers: this.getHeaders(init),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    };

    return this.request(`${this._baseUrl}${path}`, initReq);
  }

  private async request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const abortController = new AbortController();
    const abortTimerId = setTimeout(() => abortController.abort(), this._timeout);

    try {
      const response = await fetch(input, {
        ...init,
        signal: abortController.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => response.statusText || `HTTP ошибка ${response.status}`);
        throw new Error(text || `HTTP ошибка ${response.status}`);
      }

      const parsed = await response.json().catch(() => ({}));

      return parsed as T;
    } catch (err) {
      // Обрабатываем ошибку прерывания запроса
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Превышено время ожидания ответа от сервера');
      }
      // Пробрасываем другие ошибки как есть
      throw err;
    } finally {
      clearTimeout(abortTimerId);
    }
  }
}

export { HttpClient };
