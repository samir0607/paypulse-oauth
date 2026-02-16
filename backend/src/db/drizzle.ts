import * as dotenv from "dotenv";
import { createPool } from "mysql2";
import config from "../../drizzle.config"
import { drizzle } from "drizzle-orm/mysql2";

dotenv.config();

const pool = createPool({
	uri: config.dbCredentials.url,
});

if(pool) console.log("Connected to database");
else console.log("Can't connect to database");

export const db = drizzle(pool);

export const schemaPath = config.schema;

export default db;