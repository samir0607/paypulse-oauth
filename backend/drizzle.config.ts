import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
