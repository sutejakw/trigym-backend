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
CREATE TABLE "supplement_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memberships" RENAME COLUMN "membership_type" TO "membership_plan_id";--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "membership_plan_id" TYPE integer USING CASE 
  WHEN "membership_plan_id" IS NULL THEN NULL 
  ELSE 1 
END;--> statement-breakpoint
ALTER TABLE "payments" RENAME COLUMN "membership_id" TO "reference_type";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_membership_id_memberships_id_fk";
--> statement-breakpoint
ALTER TABLE "journals" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "journals" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplement_stock_histories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "supplement_stock_histories" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplements" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "supplements" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplements" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "supplements" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trainers" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trainers" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trainers" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trainers" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "reference_id" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "transaction_id" varchar(255);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "cost_price" numeric;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "min_stock_level" integer;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "brand" varchar(255);--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "ingredients" text;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "usage_instructions" text;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "expiry_date" date;--> statement-breakpoint
ALTER TABLE "supplements" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "trainers" ADD COLUMN "hourly_rate" numeric;--> statement-breakpoint
ALTER TABLE "trainers" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "class_bookings" ADD CONSTRAINT "class_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_bookings" ADD CONSTRAINT "class_bookings_class_schedule_id_class_schedules_id_fk" FOREIGN KEY ("class_schedule_id") REFERENCES "public"."class_schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_gym_class_id_gym_classes_id_fk" FOREIGN KEY ("gym_class_id") REFERENCES "public"."gym_classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_trainer_id_trainers_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."trainers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_check_ins" ADD CONSTRAINT "gym_check_ins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_training_sessions" ADD CONSTRAINT "personal_training_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_training_sessions" ADD CONSTRAINT "personal_training_sessions_trainer_id_trainers_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."trainers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_membership_plan_id_membership_plans_id_fk" FOREIGN KEY ("membership_plan_id") REFERENCES "public"."membership_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplements" ADD CONSTRAINT "supplements_category_id_supplement_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."supplement_categories"("id") ON DELETE no action ON UPDATE no action;