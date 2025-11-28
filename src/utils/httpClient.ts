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
    this._timeout = 5000;
  }

  private getHeaders(init?: RequestInit): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    const accessToken = getCookie(this.ACCESS_COOKIE_KEY);
    if (accessToken) {
      // API ожидает токен в заголовке Authorization
      // Добавляем префикс "Bearer" если его еще нет
      headers['Authorization'] = accessToken.startsWith('Bearer ')
        ? accessToken
        : `Bearer ${accessToken}`;
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

  async post<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    const initReq: RequestInit = {
      ...init,
      method: 'POST',
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
    } finally {
      clearTimeout(abortTimerId);
    }
  }
}

export { HttpClient };
