export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://us-central1-judith-beck.cloudfunctions.net/getResponseToMessage"
    : "https://us-central1-judith-staging.cloudfunctions.net/getResponseToMessage";
