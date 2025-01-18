// decode JWT token and get exp part
export const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    return JSON.parse(jsonPayload);
};

// check if the access token is expired
export const isTokenExpired = (accessToken) => {
    const decodedToken = parseJwt(accessToken);
    // convert current time to seconds
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};
