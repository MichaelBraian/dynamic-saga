create type if not exists "public"."character_status" as enum ('naming', 'questioning', 'attributes', 'specialty', 'faith_points', 'generated', 'completed', 'class', 'gender', 'race', 'animal_type', 'clothing', 'armor', 'morality');

create type if not exists "public"."question_category" as enum ('personality', 'background', 'morality');

create table if not exists "public"."character_analysis" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "personality_text" text not null,
    "traits_json" jsonb not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);

-- Drop existing characters table if it exists
drop table if exists "public"."characters" cascade;

create table "public"."characters" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "name" text not null,
    "status" character_status default 'naming'::character_status,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "gender" gender_type,
    "race" race_type,
    "class" text,
    "animal_type" text,
    "armor_type" text,
    "has_rolled_attributes" boolean not null default false,
    "has_rolled_faith_points" boolean not null default false
);


alter table "public"."character_analysis" enable row level security;

create table "public"."character_attributes" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "attribute_name" text not null,
    "value" integer not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_attributes" enable row level security;

create table "public"."character_clothing" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "clothing_type" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_clothing" enable row level security;

create table "public"."character_faith_points" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "points" integer not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_faith_points" enable row level security;

create table "public"."character_images" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "image_url" text not null,
    "is_selected" boolean default false,
    "prompt_used" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_images" enable row level security;

create table "public"."character_inventory" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "item_id" uuid,
    "quantity" integer default 1,
    "slot_position" integer not null,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."character_inventory" enable row level security;

create table "public"."character_morality" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "alignment_score" integer not null,
    "good_evil_scale" integer not null,
    "lawful_chaotic_scale" integer not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_morality" enable row level security;

create table "public"."character_prompts" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "dalle_prompt" text not null,
    "personality_prompt" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_prompts" enable row level security;

create table "public"."character_responses" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "question_id" uuid,
    "answer" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_responses" enable row level security;

create table "public"."character_specialties" (
    "id" uuid not null default uuid_generate_v4(),
    "character_id" uuid,
    "specialty_id" uuid,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."character_specialties" enable row level security;

create table "public"."item_attributes" (
    "id" uuid not null default uuid_generate_v4(),
    "item_id" uuid,
    "attribute_name" character varying(3) not null,
    "modifier_value" integer not null,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."item_attributes" enable row level security;

create table "public"."items" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying(255) not null,
    "description" text,
    "type" character varying(50) not null,
    "rarity" character varying(50) default 'common'::character varying,
    "is_stackable" boolean default false,
    "max_stack_size" integer default 1,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."items" enable row level security;

create table "public"."questions" (
    "id" uuid not null default uuid_generate_v4(),
    "question_text" text not null,
    "morality_weight" integer not null,
    "category" question_category not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."questions" enable row level security;

create table "public"."specialties" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "class_type" text not null,
    "description" text not null,
    "attribute_modifiers" jsonb not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."specialties" enable row level security;

CREATE UNIQUE INDEX character_analysis_pkey ON public.character_analysis USING btree (id);

CREATE UNIQUE INDEX character_attributes_character_id_attribute_name_key ON public.character_attributes USING btree (character_id, attribute_name);

CREATE UNIQUE INDEX character_attributes_pkey ON public.character_attributes USING btree (id);

CREATE UNIQUE INDEX character_clothing_character_id_clothing_type_key ON public.character_clothing USING btree (character_id, clothing_type);

CREATE UNIQUE INDEX character_clothing_pkey ON public.character_clothing USING btree (id);

CREATE UNIQUE INDEX character_faith_points_character_id_key ON public.character_faith_points USING btree (character_id);

CREATE UNIQUE INDEX character_faith_points_pkey ON public.character_faith_points USING btree (id);

CREATE UNIQUE INDEX character_images_pkey ON public.character_images USING btree (id);

CREATE INDEX character_inventory_character_id_idx ON public.character_inventory USING btree (character_id);

CREATE UNIQUE INDEX character_inventory_character_id_slot_position_key ON public.character_inventory USING btree (character_id, slot_position);

CREATE INDEX character_inventory_item_id_idx ON public.character_inventory USING btree (item_id);

CREATE UNIQUE INDEX character_inventory_pkey ON public.character_inventory USING btree (id);

CREATE UNIQUE INDEX character_morality_pkey ON public.character_morality USING btree (id);

CREATE UNIQUE INDEX character_prompts_pkey ON public.character_prompts USING btree (id);

CREATE UNIQUE INDEX character_responses_pkey ON public.character_responses USING btree (id);

CREATE UNIQUE INDEX character_specialties_character_id_key ON public.character_specialties USING btree (character_id);

CREATE UNIQUE INDEX character_specialties_pkey ON public.character_specialties USING btree (id);

CREATE UNIQUE INDEX characters_pkey ON public.characters USING btree (id);

CREATE INDEX item_attributes_item_id_idx ON public.item_attributes USING btree (item_id);

CREATE UNIQUE INDEX item_attributes_pkey ON public.item_attributes USING btree (id);

CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

CREATE UNIQUE INDEX specialties_pkey ON public.specialties USING btree (id);

CREATE UNIQUE INDEX unique_character_morality ON public.character_morality USING btree (character_id);

alter table "public"."character_analysis" add constraint "character_analysis_pkey" PRIMARY KEY using index "character_analysis_pkey";

alter table "public"."character_attributes" add constraint "character_attributes_pkey" PRIMARY KEY using index "character_attributes_pkey";

alter table "public"."character_clothing" add constraint "character_clothing_pkey" PRIMARY KEY using index "character_clothing_pkey";

alter table "public"."character_faith_points" add constraint "character_faith_points_pkey" PRIMARY KEY using index "character_faith_points_pkey";

alter table "public"."character_images" add constraint "character_images_pkey" PRIMARY KEY using index "character_images_pkey";

alter table "public"."character_inventory" add constraint "character_inventory_pkey" PRIMARY KEY using index "character_inventory_pkey";

alter table "public"."character_morality" add constraint "character_morality_pkey" PRIMARY KEY using index "character_morality_pkey";

alter table "public"."character_prompts" add constraint "character_prompts_pkey" PRIMARY KEY using index "character_prompts_pkey";

alter table "public"."character_responses" add constraint "character_responses_pkey" PRIMARY KEY using index "character_responses_pkey";

alter table "public"."character_specialties" add constraint "character_specialties_pkey" PRIMARY KEY using index "character_specialties_pkey";

alter table "public"."characters" add constraint "characters_pkey" PRIMARY KEY using index "characters_pkey";

alter table "public"."item_attributes" add constraint "item_attributes_pkey" PRIMARY KEY using index "item_attributes_pkey";

alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."specialties" add constraint "specialties_pkey" PRIMARY KEY using index "specialties_pkey";

alter table "public"."character_analysis" add constraint "character_analysis_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_analysis" validate constraint "character_analysis_character_id_fkey";

alter table "public"."character_attributes" add constraint "character_attributes_character_id_attribute_name_key" UNIQUE using index "character_attributes_character_id_attribute_name_key";

alter table "public"."character_attributes" add constraint "character_attributes_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_attributes" validate constraint "character_attributes_character_id_fkey";

alter table "public"."character_attributes" add constraint "character_attributes_name_check" CHECK ((attribute_name = ANY (ARRAY['STR'::text, 'DEX'::text, 'CON'::text, 'INT'::text, 'WIS'::text, 'CHA'::text, 'FTH'::text]))) not valid;

alter table "public"."character_attributes" validate constraint "character_attributes_name_check";

alter table "public"."character_attributes" add constraint "character_attributes_value_check" CHECK (((value >= 1) AND (value <= 20))) not valid;

alter table "public"."character_attributes" validate constraint "character_attributes_value_check";

alter table "public"."character_clothing" add constraint "character_clothing_character_id_clothing_type_key" UNIQUE using index "character_clothing_character_id_clothing_type_key";

alter table "public"."character_clothing" add constraint "character_clothing_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_clothing" validate constraint "character_clothing_character_id_fkey";

alter table "public"."character_faith_points" add constraint "character_faith_points_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_faith_points" validate constraint "character_faith_points_character_id_fkey";

alter table "public"."character_faith_points" add constraint "character_faith_points_character_id_key" UNIQUE using index "character_faith_points_character_id_key";

alter table "public"."character_images" add constraint "character_images_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_images" validate constraint "character_images_character_id_fkey";

alter table "public"."character_inventory" add constraint "character_inventory_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) not valid;

alter table "public"."character_inventory" validate constraint "character_inventory_character_id_fkey";

alter table "public"."character_inventory" add constraint "character_inventory_character_id_slot_position_key" UNIQUE using index "character_inventory_character_id_slot_position_key";

alter table "public"."character_inventory" add constraint "character_inventory_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) not valid;

alter table "public"."character_inventory" validate constraint "character_inventory_item_id_fkey";

alter table "public"."character_morality" add constraint "character_morality_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_morality" validate constraint "character_morality_character_id_fkey";

alter table "public"."character_morality" add constraint "character_morality_good_evil_scale_check" CHECK (((good_evil_scale >= '-100'::integer) AND (good_evil_scale <= 100))) not valid;

alter table "public"."character_morality" validate constraint "character_morality_good_evil_scale_check";

alter table "public"."character_morality" add constraint "character_morality_lawful_chaotic_scale_check" CHECK (((lawful_chaotic_scale >= '-100'::integer) AND (lawful_chaotic_scale <= 100))) not valid;

alter table "public"."character_morality" validate constraint "character_morality_lawful_chaotic_scale_check";

alter table "public"."character_morality" add constraint "unique_character_morality" UNIQUE using index "unique_character_morality";

alter table "public"."character_prompts" add constraint "character_prompts_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_prompts" validate constraint "character_prompts_character_id_fkey";

alter table "public"."character_responses" add constraint "character_responses_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_responses" validate constraint "character_responses_character_id_fkey";

alter table "public"."character_responses" add constraint "character_responses_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE not valid;

alter table "public"."character_responses" validate constraint "character_responses_question_id_fkey";

alter table "public"."character_specialties" add constraint "character_specialties_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) not valid;

alter table "public"."character_specialties" validate constraint "character_specialties_character_id_fkey";

alter table "public"."character_specialties" add constraint "character_specialties_character_id_key" UNIQUE using index "character_specialties_character_id_key";

alter table "public"."character_specialties" add constraint "character_specialties_specialty_id_fkey" FOREIGN KEY (specialty_id) REFERENCES specialties(id) not valid;

alter table "public"."character_specialties" validate constraint "character_specialties_specialty_id_fkey";

alter table "public"."item_attributes" add constraint "item_attributes_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) not valid;

alter table "public"."item_attributes" validate constraint "item_attributes_item_id_fkey";

alter table "public"."item_attributes" add constraint "valid_attribute" CHECK (((attribute_name)::text = ANY (ARRAY[('STR'::character varying)::text, ('DEX'::character varying)::text, ('CON'::character varying)::text, ('INT'::character varying)::text, ('WIS'::character varying)::text, ('CHA'::character varying)::text, ('FTH'::character varying)::text]))) not valid;

alter table "public"."item_attributes" validate constraint "valid_attribute";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.save_character_attributes(p_character_id uuid, p_strength integer, p_dexterity integer, p_constitution integer, p_intelligence integer, p_wisdom integer, p_charisma integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Insert or update attributes
    INSERT INTO character_attributes (
        character_id,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        updated_at
    ) VALUES (
        p_character_id,
        p_strength,
        p_dexterity,
        p_constitution,
        p_intelligence,
        p_wisdom,
        p_charisma,
        TIMEZONE('utc', NOW())
    )
    ON CONFLICT (character_id) DO UPDATE SET
        strength = EXCLUDED.strength,
        dexterity = EXCLUDED.dexterity,
        constitution = EXCLUDED.constitution,
        intelligence = EXCLUDED.intelligence,
        wisdom = EXCLUDED.wisdom,
        charisma = EXCLUDED.charisma,
        updated_at = TIMEZONE('utc', NOW());

    -- Update character status
    UPDATE characters
    SET status = 'specialty'
    WHERE id = p_character_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_specialty_selection(p_character_id uuid, p_specialty_id uuid, p_attribute_modifiers jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Insert or update specialty
  INSERT INTO character_specialties (character_id, specialty_id)
  VALUES (p_character_id, p_specialty_id)
  ON CONFLICT (character_id)
  DO UPDATE SET specialty_id = EXCLUDED.specialty_id;

  -- Update attributes with modifiers
  UPDATE character_attributes ca
  SET value = ca.value + COALESCE((p_attribute_modifiers->ca.attribute_name)::int, 0)
  WHERE ca.character_id = p_character_id;

  -- Update character status
  UPDATE characters
  SET status = 'faith_points'
  WHERE id = p_character_id;

EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$function$
;

grant delete on table "public"."character_analysis" to "anon";

grant insert on table "public"."character_analysis" to "anon";

grant references on table "public"."character_analysis" to "anon";

grant select on table "public"."character_analysis" to "anon";

grant trigger on table "public"."character_analysis" to "anon";

grant truncate on table "public"."character_analysis" to "anon";

grant update on table "public"."character_analysis" to "anon";

grant delete on table "public"."character_analysis" to "authenticated";

grant insert on table "public"."character_analysis" to "authenticated";

grant references on table "public"."character_analysis" to "authenticated";

grant select on table "public"."character_analysis" to "authenticated";

grant trigger on table "public"."character_analysis" to "authenticated";

grant truncate on table "public"."character_analysis" to "authenticated";

grant update on table "public"."character_analysis" to "authenticated";

grant delete on table "public"."character_analysis" to "service_role";

grant insert on table "public"."character_analysis" to "service_role";

grant references on table "public"."character_analysis" to "service_role";

grant select on table "public"."character_analysis" to "service_role";

grant trigger on table "public"."character_analysis" to "service_role";

grant truncate on table "public"."character_analysis" to "service_role";

grant update on table "public"."character_analysis" to "service_role";

grant delete on table "public"."character_attributes" to "anon";

grant insert on table "public"."character_attributes" to "anon";

grant references on table "public"."character_attributes" to "anon";

grant select on table "public"."character_attributes" to "anon";

grant trigger on table "public"."character_attributes" to "anon";

grant truncate on table "public"."character_attributes" to "anon";

grant update on table "public"."character_attributes" to "anon";

grant delete on table "public"."character_attributes" to "authenticated";

grant insert on table "public"."character_attributes" to "authenticated";

grant references on table "public"."character_attributes" to "authenticated";

grant select on table "public"."character_attributes" to "authenticated";

grant trigger on table "public"."character_attributes" to "authenticated";

grant truncate on table "public"."character_attributes" to "authenticated";

grant update on table "public"."character_attributes" to "authenticated";

grant delete on table "public"."character_attributes" to "service_role";

grant insert on table "public"."character_attributes" to "service_role";

grant references on table "public"."character_attributes" to "service_role";

grant select on table "public"."character_attributes" to "service_role";

grant trigger on table "public"."character_attributes" to "service_role";

grant truncate on table "public"."character_attributes" to "service_role";

grant update on table "public"."character_attributes" to "service_role";

grant delete on table "public"."character_clothing" to "anon";

grant insert on table "public"."character_clothing" to "anon";

grant references on table "public"."character_clothing" to "anon";

grant select on table "public"."character_clothing" to "anon";

grant trigger on table "public"."character_clothing" to "anon";

grant truncate on table "public"."character_clothing" to "anon";

grant update on table "public"."character_clothing" to "anon";

grant delete on table "public"."character_clothing" to "authenticated";

grant insert on table "public"."character_clothing" to "authenticated";

grant references on table "public"."character_clothing" to "authenticated";

grant select on table "public"."character_clothing" to "authenticated";

grant trigger on table "public"."character_clothing" to "authenticated";

grant truncate on table "public"."character_clothing" to "authenticated";

grant update on table "public"."character_clothing" to "authenticated";

grant delete on table "public"."character_clothing" to "service_role";

grant insert on table "public"."character_clothing" to "service_role";

grant references on table "public"."character_clothing" to "service_role";

grant select on table "public"."character_clothing" to "service_role";

grant trigger on table "public"."character_clothing" to "service_role";

grant truncate on table "public"."character_clothing" to "service_role";

grant update on table "public"."character_clothing" to "service_role";

grant delete on table "public"."character_faith_points" to "anon";

grant insert on table "public"."character_faith_points" to "anon";

grant references on table "public"."character_faith_points" to "anon";

grant select on table "public"."character_faith_points" to "anon";

grant trigger on table "public"."character_faith_points" to "anon";

grant truncate on table "public"."character_faith_points" to "anon";

grant update on table "public"."character_faith_points" to "anon";

grant delete on table "public"."character_faith_points" to "authenticated";

grant insert on table "public"."character_faith_points" to "authenticated";

grant references on table "public"."character_faith_points" to "authenticated";

grant select on table "public"."character_faith_points" to "authenticated";

grant trigger on table "public"."character_faith_points" to "authenticated";

grant truncate on table "public"."character_faith_points" to "authenticated";

grant update on table "public"."character_faith_points" to "authenticated";

grant delete on table "public"."character_faith_points" to "service_role";

grant insert on table "public"."character_faith_points" to "service_role";

grant references on table "public"."character_faith_points" to "service_role";

grant select on table "public"."character_faith_points" to "service_role";

grant trigger on table "public"."character_faith_points" to "service_role";

grant truncate on table "public"."character_faith_points" to "service_role";

grant update on table "public"."character_faith_points" to "service_role";

grant delete on table "public"."character_images" to "anon";

grant insert on table "public"."character_images" to "anon";

grant references on table "public"."character_images" to "anon";

grant select on table "public"."character_images" to "anon";

grant trigger on table "public"."character_images" to "anon";

grant truncate on table "public"."character_images" to "anon";

grant update on table "public"."character_images" to "anon";

grant delete on table "public"."character_images" to "authenticated";

grant insert on table "public"."character_images" to "authenticated";

grant references on table "public"."character_images" to "authenticated";

grant select on table "public"."character_images" to "authenticated";

grant trigger on table "public"."character_images" to "authenticated";

grant truncate on table "public"."character_images" to "authenticated";

grant update on table "public"."character_images" to "authenticated";

grant delete on table "public"."character_images" to "service_role";

grant insert on table "public"."character_images" to "service_role";

grant references on table "public"."character_images" to "service_role";

grant select on table "public"."character_images" to "service_role";

grant trigger on table "public"."character_images" to "service_role";

grant truncate on table "public"."character_images" to "service_role";

grant update on table "public"."character_images" to "service_role";

grant delete on table "public"."character_inventory" to "anon";

grant insert on table "public"."character_inventory" to "anon";

grant references on table "public"."character_inventory" to "anon";

grant select on table "public"."character_inventory" to "anon";

grant trigger on table "public"."character_inventory" to "anon";

grant truncate on table "public"."character_inventory" to "anon";

grant update on table "public"."character_inventory" to "anon";

grant delete on table "public"."character_inventory" to "authenticated";

grant insert on table "public"."character_inventory" to "authenticated";

grant references on table "public"."character_inventory" to "authenticated";

grant select on table "public"."character_inventory" to "authenticated";

grant trigger on table "public"."character_inventory" to "authenticated";

grant truncate on table "public"."character_inventory" to "authenticated";

grant update on table "public"."character_inventory" to "authenticated";

grant delete on table "public"."character_inventory" to "service_role";

grant insert on table "public"."character_inventory" to "service_role";

grant references on table "public"."character_inventory" to "service_role";

grant select on table "public"."character_inventory" to "service_role";

grant trigger on table "public"."character_inventory" to "service_role";

grant truncate on table "public"."character_inventory" to "service_role";

grant update on table "public"."character_inventory" to "service_role";

grant delete on table "public"."character_morality" to "anon";

grant insert on table "public"."character_morality" to "anon";

grant references on table "public"."character_morality" to "anon";

grant select on table "public"."character_morality" to "anon";

grant trigger on table "public"."character_morality" to "anon";

grant truncate on table "public"."character_morality" to "anon";

grant update on table "public"."character_morality" to "anon";

grant delete on table "public"."character_morality" to "authenticated";

grant insert on table "public"."character_morality" to "authenticated";

grant references on table "public"."character_morality" to "authenticated";

grant select on table "public"."character_morality" to "authenticated";

grant trigger on table "public"."character_morality" to "authenticated";

grant truncate on table "public"."character_morality" to "authenticated";

grant update on table "public"."character_morality" to "authenticated";

grant delete on table "public"."character_morality" to "service_role";

grant insert on table "public"."character_morality" to "service_role";

grant references on table "public"."character_morality" to "service_role";

grant select on table "public"."character_morality" to "service_role";

grant trigger on table "public"."character_morality" to "service_role";

grant truncate on table "public"."character_morality" to "service_role";

grant update on table "public"."character_morality" to "service_role";

grant delete on table "public"."character_prompts" to "anon";

grant insert on table "public"."character_prompts" to "anon";

grant references on table "public"."character_prompts" to "anon";

grant select on table "public"."character_prompts" to "anon";

grant trigger on table "public"."character_prompts" to "anon";

grant truncate on table "public"."character_prompts" to "anon";

grant update on table "public"."character_prompts" to "anon";

grant delete on table "public"."character_prompts" to "authenticated";

grant insert on table "public"."character_prompts" to "authenticated";

grant references on table "public"."character_prompts" to "authenticated";

grant select on table "public"."character_prompts" to "authenticated";

grant trigger on table "public"."character_prompts" to "authenticated";

grant truncate on table "public"."character_prompts" to "authenticated";

grant update on table "public"."character_prompts" to "authenticated";

grant delete on table "public"."character_prompts" to "service_role";

grant insert on table "public"."character_prompts" to "service_role";

grant references on table "public"."character_prompts" to "service_role";

grant select on table "public"."character_prompts" to "service_role";

grant trigger on table "public"."character_prompts" to "service_role";

grant truncate on table "public"."character_prompts" to "service_role";

grant update on table "public"."character_prompts" to "service_role";

grant delete on table "public"."character_responses" to "anon";

grant insert on table "public"."character_responses" to "anon";

grant references on table "public"."character_responses" to "anon";

grant select on table "public"."character_responses" to "anon";

grant trigger on table "public"."character_responses" to "anon";

grant truncate on table "public"."character_responses" to "anon";

grant update on table "public"."character_responses" to "anon";

grant delete on table "public"."character_responses" to "authenticated";

grant insert on table "public"."character_responses" to "authenticated";

grant references on table "public"."character_responses" to "authenticated";

grant select on table "public"."character_responses" to "authenticated";

grant trigger on table "public"."character_responses" to "authenticated";

grant truncate on table "public"."character_responses" to "authenticated";

grant update on table "public"."character_responses" to "authenticated";

grant delete on table "public"."character_responses" to "service_role";

grant insert on table "public"."character_responses" to "service_role";

grant references on table "public"."character_responses" to "service_role";

grant select on table "public"."character_responses" to "service_role";

grant trigger on table "public"."character_responses" to "service_role";

grant truncate on table "public"."character_responses" to "service_role";

grant update on table "public"."character_responses" to "service_role";

grant delete on table "public"."character_specialties" to "anon";

grant insert on table "public"."character_specialties" to "anon";

grant references on table "public"."character_specialties" to "anon";

grant select on table "public"."character_specialties" to "anon";

grant trigger on table "public"."character_specialties" to "anon";

grant truncate on table "public"."character_specialties" to "anon";

grant update on table "public"."character_specialties" to "anon";

grant delete on table "public"."character_specialties" to "authenticated";

grant insert on table "public"."character_specialties" to "authenticated";

grant references on table "public"."character_specialties" to "authenticated";

grant select on table "public"."character_specialties" to "authenticated";

grant trigger on table "public"."character_specialties" to "authenticated";

grant truncate on table "public"."character_specialties" to "authenticated";

grant update on table "public"."character_specialties" to "authenticated";

grant delete on table "public"."character_specialties" to "service_role";

grant insert on table "public"."character_specialties" to "service_role";

grant references on table "public"."character_specialties" to "service_role";

grant select on table "public"."character_specialties" to "service_role";

grant trigger on table "public"."character_specialties" to "service_role";

grant truncate on table "public"."character_specialties" to "service_role";

grant update on table "public"."character_specialties" to "service_role";

grant delete on table "public"."characters" to "anon";

grant insert on table "public"."characters" to "anon";

grant references on table "public"."characters" to "anon";

grant select on table "public"."characters" to "anon";

grant trigger on table "public"."characters" to "anon";

grant truncate on table "public"."characters" to "anon";

grant update on table "public"."characters" to "anon";

grant delete on table "public"."characters" to "authenticated";

grant insert on table "public"."characters" to "authenticated";

grant references on table "public"."characters" to "authenticated";

grant select on table "public"."characters" to "authenticated";

grant trigger on table "public"."characters" to "authenticated";

grant truncate on table "public"."characters" to "authenticated";

grant update on table "public"."characters" to "authenticated";

grant delete on table "public"."characters" to "service_role";

grant insert on table "public"."characters" to "service_role";

grant references on table "public"."characters" to "service_role";

grant select on table "public"."characters" to "service_role";

grant trigger on table "public"."characters" to "service_role";

grant truncate on table "public"."characters" to "service_role";

grant update on table "public"."characters" to "service_role";

grant delete on table "public"."item_attributes" to "anon";

grant insert on table "public"."item_attributes" to "anon";

grant references on table "public"."item_attributes" to "anon";

grant select on table "public"."item_attributes" to "anon";

grant trigger on table "public"."item_attributes" to "anon";

grant truncate on table "public"."item_attributes" to "anon";

grant update on table "public"."item_attributes" to "anon";

grant delete on table "public"."item_attributes" to "authenticated";

grant insert on table "public"."item_attributes" to "authenticated";

grant references on table "public"."item_attributes" to "authenticated";

grant select on table "public"."item_attributes" to "authenticated";

grant trigger on table "public"."item_attributes" to "authenticated";

grant truncate on table "public"."item_attributes" to "authenticated";

grant update on table "public"."item_attributes" to "authenticated";

grant delete on table "public"."item_attributes" to "service_role";

grant insert on table "public"."item_attributes" to "service_role";

grant references on table "public"."item_attributes" to "service_role";

grant select on table "public"."item_attributes" to "service_role";

grant trigger on table "public"."item_attributes" to "service_role";

grant truncate on table "public"."item_attributes" to "service_role";

grant update on table "public"."item_attributes" to "service_role";

grant delete on table "public"."items" to "anon";

grant insert on table "public"."items" to "anon";

grant references on table "public"."items" to "anon";

grant select on table "public"."items" to "anon";

grant trigger on table "public"."items" to "anon";

grant truncate on table "public"."items" to "anon";

grant update on table "public"."items" to "anon";

grant delete on table "public"."items" to "authenticated";

grant insert on table "public"."items" to "authenticated";

grant references on table "public"."items" to "authenticated";

grant select on table "public"."items" to "authenticated";

grant trigger on table "public"."items" to "authenticated";

grant truncate on table "public"."items" to "authenticated";

grant update on table "public"."items" to "authenticated";

grant delete on table "public"."items" to "service_role";

grant insert on table "public"."items" to "service_role";

grant references on table "public"."items" to "service_role";

grant select on table "public"."items" to "service_role";

grant trigger on table "public"."items" to "service_role";

grant truncate on table "public"."items" to "service_role";

grant update on table "public"."items" to "service_role";

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";

grant delete on table "public"."specialties" to "anon";

grant insert on table "public"."specialties" to "anon";

grant references on table "public"."specialties" to "anon";

grant select on table "public"."specialties" to "anon";

grant trigger on table "public"."specialties" to "anon";

grant truncate on table "public"."specialties" to "anon";

grant update on table "public"."specialties" to "anon";

grant delete on table "public"."specialties" to "authenticated";

grant insert on table "public"."specialties" to "authenticated";

grant references on table "public"."specialties" to "authenticated";

grant select on table "public"."specialties" to "authenticated";

grant trigger on table "public"."specialties" to "authenticated";

grant truncate on table "public"."specialties" to "authenticated";

grant update on table "public"."specialties" to "authenticated";

grant delete on table "public"."specialties" to "service_role";

grant insert on table "public"."specialties" to "service_role";

grant references on table "public"."specialties" to "service_role";

grant select on table "public"."specialties" to "service_role";

grant trigger on table "public"."specialties" to "service_role";

grant truncate on table "public"."specialties" to "service_role";

grant update on table "public"."specialties" to "service_role";

create policy "Users can manage their own character analysis"
on "public"."character_analysis"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_analysis.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can manage their own character attributes"
on "public"."character_attributes"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_attributes.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can manage their own character clothing"
on "public"."character_clothing"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_clothing.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can insert their own character faith points."
on "public"."character_faith_points"
as permissive
for insert
to public
with check ((auth.uid() IN ( SELECT characters.user_id
   FROM characters
  WHERE (characters.id = character_faith_points.character_id))));


create policy "Users can update their own character faith points."
on "public"."character_faith_points"
as permissive
for update
to public
using ((auth.uid() IN ( SELECT characters.user_id
   FROM characters
  WHERE (characters.id = character_faith_points.character_id))));


create policy "Users can view their own character faith points."
on "public"."character_faith_points"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT characters.user_id
   FROM characters
  WHERE (characters.id = character_faith_points.character_id))));


create policy "Users can manage their own character images"
on "public"."character_images"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_images.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can modify their own character's inventory"
on "public"."character_inventory"
as permissive
for all
to public
using ((character_id IN ( SELECT characters.id
   FROM characters
  WHERE (characters.user_id = auth.uid()))));


create policy "Users can view their own character's inventory"
on "public"."character_inventory"
as permissive
for select
to public
using ((character_id IN ( SELECT characters.id
   FROM characters
  WHERE (characters.user_id = auth.uid()))));


create policy "Users can manage their own character morality"
on "public"."character_morality"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_morality.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can manage their own character prompts"
on "public"."character_prompts"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_prompts.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can insert their own character responses"
on "public"."character_responses"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_responses.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can select their own character responses"
on "public"."character_responses"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_responses.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can view their own character responses"
on "public"."character_responses"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_responses.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can manage their own character specialties"
on "public"."character_specialties"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = character_specialties.character_id) AND (characters.user_id = auth.uid())))));


create policy "Users can delete their own characters"
on "public"."characters"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own characters"
on "public"."characters"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own characters"
on "public"."characters"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own characters"
on "public"."characters"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Everyone can view item attributes"
on "public"."item_attributes"
as permissive
for select
to authenticated
using (true);


create policy "Everyone can view items"
on "public"."items"
as permissive
for select
to authenticated
using (true);


create policy "Questions are readable by all authenticated users"
on "public"."questions"
as permissive
for select
to authenticated
using (true);


create policy "Specialties are readable by all authenticated users"
on "public"."specialties"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


