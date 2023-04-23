
export class FetchError extends Error {
    constructor(
        readonly originalError: any,
        readonly request: RequestInfo,
        readonly response: Response | undefined,
    ) {
        super(originalError.message || 'FetchError');
    }
};

const PAYLOAD_METHODS: any[] = ['POST', 'PUT', 'PATCH'];

export const fetchApi = async <T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
    const request = input instanceof URL ? input.toString() : input;
    let response: Response | undefined = undefined;
    try {
        response = await fetch(request, {
            ...init,
            headers: {
                ...(PAYLOAD_METHODS.includes(init?.method?.toUpperCase()) && {
                    "Content-Type": "application/json",
                }),
                ...init?.headers,
            },
        });
        return await response.json();
    } catch (error: any) {
        throw new FetchError(
            error,
            request,
            response,
        );
    }
};

export default fetchApi;
