-- alter table "public"."profiles" add column "city" text not null;

-- alter table "public"."profiles" add column "gpa" numeric;

-- alter table "public"."profiles" add column "state" text not null;

-- alter table "public"."profiles" add column "year" integer;

-- alter table "public"."surveys" enable row level security;
ALTER TABLE surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE chats ADD COLUMN isFavorited BOOLEAN DEFAULT FALSE;

ALTER TABLE messages
ADD COLUMN thumbs_up BOOLEAN DEFAULT FALSE,
ADD COLUMN thumbs_down BOOLEAN DEFAULT FALSE,
ADD COLUMN comments TEXT;
-- alter table "public"."profiles" add constraint "profiles_city_check" CHECK ((char_length(city) <= 100)) not valid;

-- alter table "public"."profiles" validate constraint "profiles_city_check";

-- alter table "public"."profiles" add constraint "profiles_gpa_check" CHECK (((gpa >= (0)::numeric) AND (gpa <= 4.0))) not valid;

-- alter table "public"."profiles" validate constraint "profiles_gpa_check";

-- alter table "public"."profiles" add constraint "profiles_state_check" CHECK ((char_length(state) <= 100)) not valid;

-- alter table "public"."profiles" validate constraint "profiles_state_check";

-- alter table "public"."profiles" add constraint "profiles_year_check" CHECK ((year > 0)) not valid;

-- alter table "public"."profiles" validate constraint "profiles_year_check";


