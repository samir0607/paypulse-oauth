import { int, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { companyTable } from "./Company";

export const systems = ["oracle", "sap"] as const

export const IntegrationTable = mysqlTable("integrations", {
	id: int().primaryKey().autoincrement(),
	company_id: int()
		.references(() => companyTable.company_id, {onDelete: "cascade"})
		.notNull(),
	type: varchar({ length: 50 }).$type<(typeof systems)[number]>().notNull(),
	client_id: varchar({ length: 255 }).notNull(),
	client_secret: varchar({ length: 500 }).notNull(),
	base_url: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 255 }).default("ACTIVE"),
	last_sync: timestamp(),
	created_at: timestamp().defaultNow(),
	updated_at: timestamp().defaultNow().onUpdateNow()
});

export type Integration = typeof IntegrationTable.$inferSelect;
export type IntegrationInsert = typeof IntegrationTable.$inferInsert;