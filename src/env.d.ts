declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: number;
      SECRET_KEY: string,
      EMAIL_USER: string,
      EMAIL_PASS: string,
      DB_HOST: string,
      DB_USER: string,
      DB_DATABASE: string,
      DB_PASSWORD: string
      EMAIL_VERIFY_REDIRECT_LINK: string
    }
  }
}

export { };
