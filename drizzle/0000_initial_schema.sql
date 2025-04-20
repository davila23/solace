CREATE TABLE IF NOT EXISTS "advocates" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "city" text NOT NULL,
  "degree" text NOT NULL,
  "specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "years_of_experience" integer NOT NULL,
  "phone_number" bigint NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "username" varchar(50) NOT NULL,
  "password_hash" text NOT NULL,
  "role" varchar(20) DEFAULT 'user' NOT NULL,
  "name" varchar(100) NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_username_unique" UNIQUE("username")
);
