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

    private async request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
        const abortController = new AbortController();
        const abortTimerId = setTimeout(() => abortController.abort(), this._timeout);

        try {
            const response = await fetch(input, {
                ...init,
                signal: abortController.signal,
            })

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const {data} = await response.json();

            return data as T;
        } catch (e) {
            throw e;
        } finally {
            clearTimeout(abortTimerId);
        }
    }
}

export {HttpClient};
