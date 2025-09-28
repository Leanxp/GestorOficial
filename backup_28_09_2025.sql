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
  CONSTRAINT categories_pkey PRIMARY KEY (id)
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
  CONSTRAINT ingredients_pkey PRIMARY KEY (id),
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
  CONSTRAINT inventory_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_family_id_fkey FOREIGN KEY (family_id) REFERENCES public.inventory_families(id),
  CONSTRAINT inventory_subfamily_id_fkey FOREIGN KEY (subfamily_id) REFERENCES public.inventory_subfamilies(id),
  CONSTRAINT inventory_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
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
  quantity numeric NOT NULL,
  reason text,
  admin_user_id integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_movements_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_movements_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id),
  CONSTRAINT inventory_movements_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.admin_usuarios(id)
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
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
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
  CONSTRAINT supplier_ingredients_pkey PRIMARY KEY (id),
  CONSTRAINT supplier_ingredients_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT supplier_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id)
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
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);