
async function reissueToken(token: string): Promise<boolean> {

    const response = await fetch("http://localhost:8080/api/v1/auth/reissue", {
        method: "GET",
        headers: {
            "Authorization": `Refresh ${token}`,
        }
    })

    if (response.status == 403) return false;

    const newToken = await response.text();
    if (!newToken) {
        return false;
    }

    localStorage.setItem("accessToken", newToken);
    return true;

}



export async function wrapRequest(
    url: string,
    options: RequestInit
): Promise<Response> {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    const currentAccessToken = localStorage.getItem("accessToken");

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${currentAccessToken}`,
        },
    });

    if (response.status === 401 && currentRefreshToken) {
        const refreshed = await reissueToken(currentRefreshToken);
        if (refreshed) {
            const newAccessToken = localStorage.getItem("accessToken");
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                },
            });
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            throw new Error("Refresh token expired or invalid");
        }
    }

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
}

