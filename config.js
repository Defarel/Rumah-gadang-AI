// config.js - versi aman connect ke CF Variables
// JANGAN taruh gsk_... atau secret asli di sini lagi

export function getConfig(env) {
  return {
    ADMIN_KEY: env.ADMIN_KEY || env.ADMI,
    GOOGLE_ID: env.GOOGLE_ID || env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET: env.GOOGLE_SECRET || env.GOOGLE_CLIENT_SECRET,
    GROQ_API_KEY: env.GROQ || env.GROQ_API_KEY || env.GROQ_KEY,
    DB: env.DB,
    RG_BLOCK: env.RG_BLOCK
  };
}

export const SITE = {
  name: "Rumah Gadang AI",
  domain: "www.rumahgadang-ai.my.id"
};
