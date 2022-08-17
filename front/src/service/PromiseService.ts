// @ts-ignore
const baseApiUrl = process.env.ENV_API_URL || "";

// @ts-ignore
const baseStaticUrl = process.env.ENV_STATIC_URL || "";

export const getStaticURL = (path: string) => `${baseStaticUrl}${path}`

export const fetchJson = (api: string) => fetch(`${baseApiUrl}${api}`).then((res) => res.json());
