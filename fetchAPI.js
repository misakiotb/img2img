import { getEnv } from "https://code4fukui.github.io/ai_chat/getEnv.js";

const KEY = await getEnv("OPENAI_API_KEY");

// https://platform.openai.com/docs/api-reference/chat/create

export const fetchAPI = async (url, body) => {
  if (body instanceof FormData) {
    const opt = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Authorization": "Bearer " + KEY,
      },
      body,
    };
    const res = await (await fetch(url, opt)).json();
    return res;
  } else {
    if (typeof body == "object") {
      body = JSON.stringify(body);
    }
    const opt = {
      method: body ? "POST" : "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + KEY,
      },
      body,
    };
    const res = await (await fetch(url, opt)).json();
    return res;
  }
};
