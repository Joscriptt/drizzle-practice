import { pgTable, unique, uuid, text, timestamp } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm"

export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: text().notNull(),
    username: text().notNull(),
    password: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    location: text().notNull(),
    status: text().notNull(),
    balance: text().notNull(),
  },
  (table) => [
    unique("users_email_unique").on(table.email),
    unique("users_username_unique").on(table.username),
  ]
);
