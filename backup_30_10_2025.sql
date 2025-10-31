-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admin_usuarios (
  id integer NOT NULL DEFAULT nextval('admin_usuarios_id_seq'::regclass),
  username character varying NOT NULL UNIQUE,
  pwd character varying NOT NULL,
  grade integer DEFAULT 0,
  email character varying NOT NULL UNIQUE,
  license_type character varying DEFAULT 'free'::character varying,
  license_expires_at timestamp with time zone,
  max_ingredients integer DEFAULT 15,
  max_suppliers integer DEFAULT 15,
  is_admin boolean DEFAULT false,
  last_update timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_usuarios_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id integer,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id)
);
CREATE TABLE public.ingredients (
  id integer NOT NULL DEFAULT nextval('ingredients_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  category_id integer,
  base_price numeric DEFAULT 0,
  unit_measure character varying DEFAULT 'kg'::character varying,
  min_stock_level integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  alerg_gluten boolean DEFAULT false,
  alerg_crustaceos boolean DEFAULT false,
  alerg_huevos boolean DEFAULT false,
  alerg_pescado boolean DEFAULT false,
  alerg_cacahuetes boolean DEFAULT false,
  alerg_soja boolean DEFAULT false,
  alerg_leche boolean DEFAULT false,
  alerg_frutos boolean DEFAULT false,
  alerg_apio boolean DEFAULT false,
  alerg_mostaza boolean DEFAULT false,
  alerg_sesamo boolean DEFAULT false,
  alerg_sulfitos boolean DEFAULT false,
  alerg_altramuces boolean DEFAULT false,
  alerg_moluscos boolean DEFAULT false,
  user_id integer,
  CONSTRAINT ingredients_pkey PRIMARY KEY (id),
  CONSTRAINT ingredients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id),
  CONSTRAINT ingredients_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.inventory (
  id integer NOT NULL DEFAULT nextval('inventory_id_seq'::regclass),
  ingredient_id integer,
  family_id integer,
  subfamily_id integer,
  quantity numeric NOT NULL DEFAULT 0,
  purchase_price numeric DEFAULT 0,
  expiry_date date,
  batch_number character varying,
  created_at timestamp with time zone DEFAULT now(),
  supplier_id integer,
  user_id integer,
  CONSTRAINT inventory_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_family_id_fkey FOREIGN KEY (family_id) REFERENCES public.inventory_families(id),
  CONSTRAINT inventory_subfamily_id_fkey FOREIGN KEY (subfamily_id) REFERENCES public.inventory_subfamilies(id),
  CONSTRAINT inventory_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT inventory_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id),
  CONSTRAINT inventory_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id)
);
CREATE TABLE public.inventory_families (
  id integer NOT NULL DEFAULT nextval('inventory_families_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_families_pkey PRIMARY KEY (id)
);
CREATE TABLE public.inventory_movements (
  id integer NOT NULL DEFAULT nextval('inventory_movements_id_seq'::regclass),
  ingredient_id integer,
  movement_type character varying NOT NULL,
  quantity numeric,
  reason text,
  user_id integer,
  created_at timestamp with time zone DEFAULT now(),
  inventory_id integer,
  field_changed character varying,
  old_value text,
  new_value text,
  CONSTRAINT inventory_movements_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_movements_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id),
  CONSTRAINT inventory_movements_admin_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id),
  CONSTRAINT inventory_movements_inventory_id_fkey FOREIGN KEY (inventory_id) REFERENCES public.inventory(id)
);
CREATE TABLE public.inventory_subfamilies (
  id integer NOT NULL DEFAULT nextval('inventory_subfamilies_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  family_id integer,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_subfamilies_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_subfamilies_family_id_fkey FOREIGN KEY (family_id) REFERENCES public.inventory_families(id)
);
CREATE TABLE public.purchase_order_items (
  id integer NOT NULL DEFAULT nextval('purchase_order_items_id_seq'::regclass),
  order_id integer,
  ingredient_id integer,
  quantity numeric NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.purchase_orders(id),
  CONSTRAINT purchase_order_items_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id)
);
CREATE TABLE public.purchase_orders (
  id integer NOT NULL DEFAULT nextval('purchase_orders_id_seq'::regclass),
  supplier_id integer,
  order_date timestamp with time zone DEFAULT now(),
  expected_delivery date,
  status character varying DEFAULT 'pending'::character varying,
  total_amount numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  user_id integer,
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT purchase_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id)
);
CREATE TABLE public.supplier_ingredients (
  id integer NOT NULL DEFAULT nextval('supplier_ingredients_id_seq'::regclass),
  supplier_id integer,
  ingredient_id integer,
  supplier_price numeric NOT NULL,
  supplier_unit character varying DEFAULT 'kg'::character varying,
  conversion_factor numeric DEFAULT 1,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  user_id integer,
  CONSTRAINT supplier_ingredients_pkey PRIMARY KEY (id),
  CONSTRAINT supplier_ingredients_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT supplier_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id),
  CONSTRAINT supplier_ingredients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id)
);
CREATE TABLE public.suppliers (
  id integer NOT NULL DEFAULT nextval('suppliers_id_seq'::regclass),
  name character varying NOT NULL,
  contact_person character varying,
  email character varying,
  phone character varying,
  address text,
  city character varying,
  postal_code character varying,
  country character varying,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id integer,
  CONSTRAINT suppliers_pkey PRIMARY KEY (id),
  CONSTRAINT suppliers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id)
);

-- inventory_recipes: recetas ligadas a inventario y usuarios
CREATE SEQUENCE public.inventory_recipes_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE public.inventory_recipes (
  id integer NOT NULL DEFAULT nextval('inventory_recipes_id_seq'::regclass),
  recipe_category varchar(255) NOT NULL,
  recipe_id integer NOT NULL,
  recipe_name character varying NOT NULL,
  inventory_id integer,
  user_id integer,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_recipes_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_recipes_inventory_id_fkey FOREIGN KEY (inventory_id) REFERENCES public.inventory(id) ON DELETE SET NULL,
  CONSTRAINT inventory_recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.admin_usuarios(id),
  CONSTRAINT inventory_recipes_unique_line UNIQUE (recipe_id, inventory_id)
);

CREATE INDEX inventory_recipes_recipe_idx ON public.inventory_recipes (recipe_id);
CREATE INDEX inventory_recipes_inventory_idx ON public.inventory_recipes (inventory_id);
CREATE INDEX inventory_recipes_user_idx ON public.inventory_recipes (user_id);

-- recipe_ingredients: ingredientes por receta (N por receta)
CREATE SEQUENCE public.recipe_ingredients_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE public.recipe_ingredients (
  id integer NOT NULL DEFAULT nextval('recipe_ingredients_id_seq'::regclass),
  recipe_id integer NOT NULL,
  ingredient_id integer NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  unit_measure varchar(32) NOT NULL DEFAULT 'g',
  position integer DEFAULT 1,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id),
  CONSTRAINT recipe_ingredients_recipe_fkey FOREIGN KEY (recipe_id) REFERENCES public.inventory_recipes(id) ON DELETE CASCADE,
  CONSTRAINT recipe_ingredients_ingredient_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON DELETE RESTRICT,
  CONSTRAINT recipe_ingredients_position_chk CHECK (position >= 1)
);

CREATE INDEX recipe_ingredients_recipe_idx ON public.recipe_ingredients (recipe_id);
CREATE INDEX recipe_ingredients_ingredient_idx ON public.recipe_ingredients (ingredient_id);

-- recipe_steps: pasos normalizados por receta (1..25)
CREATE SEQUENCE public.recipe_steps_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE public.recipe_steps (
  id integer NOT NULL DEFAULT nextval('recipe_steps_id_seq'::regclass),
  recipe_id integer NOT NULL,
  step_number integer NOT NULL,
  step_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recipe_steps_pkey PRIMARY KEY (id),
  CONSTRAINT recipe_steps_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.inventory_recipes(id) ON DELETE CASCADE,
  CONSTRAINT recipe_steps_step_number_range CHECK (step_number BETWEEN 1 AND 25),
  CONSTRAINT recipe_steps_unique_per_recipe UNIQUE (recipe_id, step_number)
);

CREATE INDEX recipe_steps_recipe_idx ON public.recipe_steps (recipe_id, step_number);
