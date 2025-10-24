import { boolean, integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const posts = pgTable("post", {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    content: text("content").notNull(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    author: varchar("author", { length: 100 }).default("Anonymous"),
    published: boolean("published").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 50 }).notNull(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
})

export const postCategories = pgTable(
    "post_categories",
    {
        postId: integer("post_id")
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        categoryId: integer("category_id")
            .notNull()
            .references(() => categories.id, { onDelete: "cascade" }),
    },
    (t) => [
        primaryKey({ columns: [t.postId, t.categoryId] }),
    ]
);