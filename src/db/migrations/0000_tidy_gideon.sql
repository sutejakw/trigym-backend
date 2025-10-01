CREATE TABLE "class_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"class_schedule_id" integer,
	"booking_date" timestamp,
	"status" varchar(255),
	"payment_status" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"gym_class_id" integer,
	"trainer_id" integer,
	"date" date,
	"start_time" time,
	"end_time" time,
	"available_spots" integer,
	"status" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"category" varchar(255),
	"brand" varchar(255),
	"model" varchar(255),
	"purchase_date" date,
	"warranty_end_date" date,
	"status" varchar(255),
	"location" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipment_id" integer,
	"maintenance_type" varchar(255),
	"description" text,
	"performed_by" varchar(255),
	"maintenance_date" date,
	"cost" numeric,
	"next_maintenance_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_check_ins" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"check_in_time" timestamp,
	"check_out_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"category" varchar(255),
	"max_capacity" integer,
	"duration_minutes" integer,
	"price" numeric,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"reference_type" varchar(255),
	"reference_id" integer,
	"description" text,
	"amount" numeric,
	"type" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"price" numeric,
	"duration_months" integer,
	"features" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"membership_plan_id" integer,
	"start_date" date,
	"end_date" date,
	"status" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(255),
	"message" text,
	"type" varchar(255),
	"is_read" boolean DEFAULT false,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"reference_type" varchar(255),
	"reference_id" integer,
	"amount" numeric,
	"payment_date" timestamp,
	"payment_method" varchar(255),
	"status" varchar(255),
	"transaction_id" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_training_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"trainer_id" integer,
	"session_date" timestamp,
	"duration_minutes" integer,
	"price" numeric,
	"status" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplement_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplement_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"supplement_id" integer,
	"quantity" integer,
	"price" numeric,
	"subtotal" numeric
);
--> statement-breakpoint
CREATE TABLE "supplement_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"order_date" timestamp,
	"total_amount" numeric,
	"status" varchar(255),
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "supplement_stock_histories" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplement_id" integer,
	"change_type" varchar(255),
	"quantity_change" integer,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplements" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"name" varchar(255),
	"description" text,
	"price" numeric,
	"cost_price" numeric,
	"stock" integer,
	"min_stock_level" integer,
	"brand" varchar(255),
	"ingredients" text,
	"usage_instructions" text,
	"expiry_date" date,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trainers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"bio" text,
	"specialization" varchar(255),
	"hourly_rate" numeric,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"phone" varchar(255),
	"gender" varchar(255),
	"date_of_birth" date,
	"role" varchar(255) DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "class_bookings" ADD CONSTRAINT "class_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_bookings" ADD CONSTRAINT "class_bookings_class_schedule_id_class_schedules_id_fk" FOREIGN KEY ("class_schedule_id") REFERENCES "public"."class_schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_gym_class_id_gym_classes_id_fk" FOREIGN KEY ("gym_class_id") REFERENCES "public"."gym_classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_trainer_id_trainers_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."trainers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_check_ins" ADD CONSTRAINT "gym_check_ins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journals" ADD CONSTRAINT "journals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_membership_plan_id_membership_plans_id_fk" FOREIGN KEY ("membership_plan_id") REFERENCES "public"."membership_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_training_sessions" ADD CONSTRAINT "personal_training_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_training_sessions" ADD CONSTRAINT "personal_training_sessions_trainer_id_trainers_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."trainers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_order_items" ADD CONSTRAINT "supplement_order_items_order_id_supplement_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."supplement_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_order_items" ADD CONSTRAINT "supplement_order_items_supplement_id_supplements_id_fk" FOREIGN KEY ("supplement_id") REFERENCES "public"."supplements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_orders" ADD CONSTRAINT "supplement_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_stock_histories" ADD CONSTRAINT "supplement_stock_histories_supplement_id_supplements_id_fk" FOREIGN KEY ("supplement_id") REFERENCES "public"."supplements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplements" ADD CONSTRAINT "supplements_category_id_supplement_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."supplement_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;