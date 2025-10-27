interface HttpClientConfig {
    baseUrl: string;
}

class HttpClient {
    readonly _baseUrl: string;
    readonly _timeout: number;

    constructor({baseUrl}: HttpClientConfig) {
        this._baseUrl = baseUrl;
        this._timeout = 5000;
    }

    async get<T>(path: string): Promise<T> {
        return this.request(`${this._baseUrl}${path}`);
    }

    async post<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
        const headers = Object.assign({ 'Content-Type': 'application/json' }, (init && init.headers) || {});

        const initReq: RequestInit = Object.assign({}, init, {
            method: 'POST',
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

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
                const text = await response.text().catch(() => response.statusText || `HTTP error ${response.status}`);

                throw new Error(text || `HTTP error ${response.status}`);
            }

            const parsed = await response.json().catch(() => ({}));

            return parsed as T;
        } finally {
            clearTimeout(abortTimerId);
        }
    }
}

export {HttpClient};
