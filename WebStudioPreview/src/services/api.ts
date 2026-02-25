const API_BASE: string =
    import.meta.env.VITE_API_BASE || "http://localhost:3001";

export interface SharePointResponse<T> {
    value: T[];
}

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {})
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
    }

    // 🔹 GET method returning SharePoint-style response
    public async get<T>(
        endpoint: string,
        params?: Record<string, string | number | null>
    ): Promise<SharePointResponse<T>> {
        let url = endpoint;

        if (params) {
            const query = Object.entries(params)
                .filter(([, value]) => value !== null && value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");

            if (query) {
                url += `?${query}`;
            }
        }

        return this.request<SharePointResponse<T>>(url, {
            method: "GET",
        });
    }
}

export const api = new ApiService(API_BASE);