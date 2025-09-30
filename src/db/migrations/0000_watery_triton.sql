CREATE TABLE "journals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"reference_type" varchar(255),
	"reference_id" integer,
	"description" text,
	"amount" numeric,
	"type" varchar(255),
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"membership_type" varchar(255),
	"start_date" date,
	"end_date" date,
	"status" varchar(255),
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"membership_id" integer,
	"amount" numeric,
	"payment_date" timestamp,
	"payment_method" varchar(255),
	"status" varchar(255),
	"created_at" timestamp,
	"updated_at" timestamp
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
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "supplements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"price" numeric,
	"stock" integer,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "trainers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"bio" text,
	"specialization" varchar(255),
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password_hash" varchar(255),
	"phone" varchar(255),
	"gender" varchar(255),
	"date_of_birth" date,
	"role" varchar(255),
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "journals" ADD CONSTRAINT "journals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_order_items" ADD CONSTRAINT "supplement_order_items_order_id_supplement_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."supplement_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_order_items" ADD CONSTRAINT "supplement_order_items_supplement_id_supplements_id_fk" FOREIGN KEY ("supplement_id") REFERENCES "public"."supplements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_orders" ADD CONSTRAINT "supplement_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_stock_histories" ADD CONSTRAINT "supplement_stock_histories_supplement_id_supplements_id_fk" FOREIGN KEY ("supplement_id") REFERENCES "public"."supplements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;