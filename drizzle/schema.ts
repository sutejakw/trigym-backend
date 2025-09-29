export const refresh_tokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  token: varchar('token', { length: 255 }).notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  timestamp,
  text,
  decimal,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }),
  gender: varchar('gender', { length: 255 }),
  date_of_birth: date('date_of_birth'),
  role: varchar('role', { length: 255 }).default('user'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const memberships = pgTable('memberships', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  membership_type: varchar('membership_type', { length: 255 }),
  start_date: date('start_date'),
  end_date: date('end_date'),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
})

export const trainers = pgTable('trainers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  bio: text('bio'),
  specialization: varchar('specialization', { length: 255 }),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
})

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  membership_id: integer('membership_id').references(() => memberships.id),
  amount: decimal('amount'),
  payment_date: timestamp('payment_date'),
  payment_method: varchar('payment_method', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
})

export const supplements = pgTable('supplements', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  price: decimal('price'),
  stock: integer('stock'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
})

export const supplement_orders = pgTable('supplement_orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  order_date: timestamp('order_date'),
  total_amount: decimal('total_amount'),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
})

export const supplement_order_items = pgTable('supplement_order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => supplement_orders.id),
  supplement_id: integer('supplement_id').references(() => supplements.id),
  quantity: integer('quantity'),
  price: decimal('price'),
  subtotal: decimal('subtotal'),
})

export const supplement_stock_histories = pgTable('supplement_stock_histories', {
  id: serial('id').primaryKey(),
  supplement_id: integer('supplement_id').references(() => supplements.id),
  change_type: varchar('change_type', { length: 255 }),
  quantity_change: integer('quantity_change'),
  description: text('description'),
  created_at: timestamp('created_at'),
})

export const journals = pgTable('journals', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  reference_type: varchar('reference_type', { length: 255 }),
  reference_id: integer('reference_id'),
  description: text('description'),
  amount: decimal('amount'),
  type: varchar('type', { length: 255 }),
  created_at: timestamp('created_at'),
})
