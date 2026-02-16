import { int, mysqlTable, varchar, datetime } from "drizzle-orm/mysql-core";
import { companyTable } from "./Company";
import { sql } from "drizzle-orm";

const systems = ["oracle", "sap"] as const

export const IntegrationTable = mysqlTable("integrations", {
	id: int().primaryKey().autoincrement(),
	company_id: int()
		.references(() => companyTable.company_id, {onDelete: "cascade"})
		.notNull(),
	type: varchar({ length: 255, enum: systems }).notNull(),
	client_id: varchar({ length: 255 }).notNull(),
	client_secret: varchar({ length: 500 }).notNull(),
	base_url: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 255 }).default("ACTIVE"),
	last_sync: datetime(),
	created_at: datetime().default(sql`CURRENT TIMESTAMP`),
	updated_at: datetime().default(sql`CURRENT TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT TIMESTAMP`)
});

export type Integration = typeof IntegrationTable.$inferSelect;
export type IntegrationInsert = typeof IntegrationTable.$inferInsert;