import * as dotenv from "dotenv";
import { createPool } from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

dotenv.config();

const pool = createPool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

if(pool) console.log("Connected to database");
else console.log("Can't connect to database");

export const db = drizzle(pool);

export default db;