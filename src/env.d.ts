declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: number;
      SECRET_KEY: string,
      EMAIL_USER: string,
      EMAIL_PASS: string
    }
  }
}

export { };
