// @ts-ignore
const baseUrl = process.env.ENV_API_URL || "";

export const fetchJson = (api: string) => fetch(`${baseUrl}${api}`).then((res) => res.json());
