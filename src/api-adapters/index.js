// Set the BASE_URL based on the environment (production or development)
// Use the production API URL when the environment is "production"
// Use the localhost API URL for development purposes

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ebazon-lrvp.onrender.com/api"
    : "http://localhost:3001/api";
