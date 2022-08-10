export const getCookie = (key: string) => {
    const prefix = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(prefix) === 0) {
            return c.substring(prefix.length, c.length);
        }
    }
    return undefined;
};

export const setCookie = (key: string, value: string | undefined, exdays: number) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${value || ""};expires=${d.toUTCString()}`;
};
