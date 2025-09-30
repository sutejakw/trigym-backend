import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  timestamp,
  text,
  decimal,
  boolean,
  time,
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

export const refresh_tokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  token: varchar('token', { length: 255 }).notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const membership_plans = pgTable('membership_plans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  price: decimal('price'),
  duration_months: integer('duration_months'),
  features: text('features'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const memberships = pgTable('memberships', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  membership_plan_id: integer('membership_plan_id').references(() => membership_plans.id),
  start_date: date('start_date'),
  end_date: date('end_date'),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const trainers = pgTable('trainers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  bio: text('bio'),
  specialization: varchar('specialization', { length: 255 }),
  hourly_rate: decimal('hourly_rate'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const gym_classes = pgTable('gym_classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  category: varchar('category', { length: 255 }),
  max_capacity: integer('max_capacity'),
  duration_minutes: integer('duration_minutes'),
  price: decimal('price'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const class_schedules = pgTable('class_schedules', {
  id: serial('id').primaryKey(),
  gym_class_id: integer('gym_class_id').references(() => gym_classes.id),
  trainer_id: integer('trainer_id').references(() => trainers.id),
  date: date('date'),
  start_time: time('start_time'),
  end_time: time('end_time'),
  available_spots: integer('available_spots'),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const class_bookings = pgTable('class_bookings', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  class_schedule_id: integer('class_schedule_id').references(() => class_schedules.id),
  booking_date: timestamp('booking_date'),
  status: varchar('status', { length: 255 }),
  payment_status: varchar('payment_status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const equipment = pgTable('equipment', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  category: varchar('category', { length: 255 }),
  brand: varchar('brand', { length: 255 }),
  model: varchar('model', { length: 255 }),
  purchase_date: date('purchase_date'),
  warranty_end_date: date('warranty_end_date'),
  status: varchar('status', { length: 255 }),
  location: varchar('location', { length: 255 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const equipment_maintenance = pgTable('equipment_maintenance', {
  id: serial('id').primaryKey(),
  equipment_id: integer('equipment_id').references(() => equipment.id),
  maintenance_type: varchar('maintenance_type', { length: 255 }),
  description: text('description'),
  performed_by: varchar('performed_by', { length: 255 }),
  maintenance_date: date('maintenance_date'),
  cost: decimal('cost'),
  next_maintenance_date: date('next_maintenance_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const supplement_categories = pgTable('supplement_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const personal_training_sessions = pgTable('personal_training_sessions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  trainer_id: integer('trainer_id').references(() => trainers.id),
  session_date: timestamp('session_date'),
  duration_minutes: integer('duration_minutes'),
  price: decimal('price'),
  status: varchar('status', { length: 255 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const gym_check_ins = pgTable('gym_check_ins', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  check_in_time: timestamp('check_in_time'),
  check_out_time: timestamp('check_out_time'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }),
  message: text('message'),
  type: varchar('type', { length: 255 }),
  is_read: boolean('is_read').default(false),
  scheduled_at: timestamp('scheduled_at'),
  sent_at: timestamp('sent_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  reference_type: varchar('reference_type', { length: 255 }),
  reference_id: integer('reference_id'),
  amount: decimal('amount'),
  payment_date: timestamp('payment_date'),
  payment_method: varchar('payment_method', { length: 255 }),
  status: varchar('status', { length: 255 }),
  transaction_id: varchar('transaction_id', { length: 255 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const supplements = pgTable('supplements', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').references(() => supplement_categories.id),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  price: decimal('price'),
  cost_price: decimal('cost_price'),
  stock: integer('stock'),
  min_stock_level: integer('min_stock_level'),
  brand: varchar('brand', { length: 255 }),
  ingredients: text('ingredients'),
  usage_instructions: text('usage_instructions'),
  expiry_date: date('expiry_date'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
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
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const journals = pgTable('journals', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  reference_type: varchar('reference_type', { length: 255 }),
  reference_id: integer('reference_id'),
  description: text('description'),
  amount: decimal('amount'),
  type: varchar('type', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
