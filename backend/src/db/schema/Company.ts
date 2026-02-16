import {
  mysqlTable,
  json,
  serial,
  varchar,
  int,
  date,
  text,
  boolean,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { getDate } from "../../utils/utils";

const revenue = [
  "Less than 1M",
  "1M-25M",
  "25M-50M",
  "50M-100M",
  "100M+",
] as const;

export const companyTable = mysqlTable("company_table", {
  company_id: int().primaryKey().autoincrement(),
  name: varchar({ length: 512 }),
  logoUrl: varchar({ length: 255 }),
  industry: varchar({ length: 255 }).default(""),
  numberOfEmployees: int().default(0),
  website: varchar({ length: 512 }),
  currency: varchar({ length: 255 }),
  headLocation: varchar({ length: 255 }),
  revenue: varchar({ length: 20, enum: revenue }),
  isActive: boolean().default(true),
  city: varchar({ length: 255 }),
  domain: varchar({ length: 255 }),
  external_grading_model: varchar({ length: 255 }),
  isDeleted: boolean().default(false),
  model_id: int(),
  last_modified: date().default(getDate()),
  created_at: date().default(getDate()),
});
