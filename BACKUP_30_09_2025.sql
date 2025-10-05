INSERT INTO "public"."admin_usuarios" ("id", "username", "pwd", "grade", "email", "license_type", "license_expires_at", "max_ingredients", "max_suppliers", "is_admin", "last_update") VALUES ('1', 'admin', '$2b$10$l19aHbjcpavO2ClbLEy5f.ry07ZOezKxnGqNxMRN3SE4X.p0pM25e', '0', 'admin@google.com', 'premium', '2026-12-31 00:00:00+00', '300', '300', 'true', '2025-04-14 23:00:13+00'), ('2', 'Leandro', '$2b$10$dvgJJE8zaV8BTTNhKajh5uatbOVE5Ohl/fbr1WB2UnpZgbvFU7yLO', '0', 'leandrocalvoduran@gmail.com', 'premium', '2026-12-31 23:59:59+00', '999999', '999999', 'true', '2025-09-20 16:13:16.994309+00');
INSERT INTO "public"."categories" ("id", "name", "description", "created_at", "updated_at") VALUES ('1', 'Frutas', 'Frutas frescas y de temporada', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('2', 'Verduras', 'Verduras y hortalizas', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('3', 'Carnes', 'Carnes y embutidos', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('4', 'Lácteos', 'Productos lácteos', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('5', 'Especias', 'Especias y condimentos', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('6', 'Mariscos', 'El mar al mejor precio', '2025-09-28 08:57:12.825937+00', '2025-09-28 08:57:12.825937+00');
INSERT INTO "public"."ingredients" ("id", "name", "description", "category_id", "base_price", "unit_measure", "min_stock_level", "active", "created_at", "updated_at", "alerg_gluten", "alerg_crustaceos", "alerg_huevos", "alerg_pescado", "alerg_cacahuetes", "alerg_soja", "alerg_leche", "alerg_frutos", "alerg_apio", "alerg_mostaza", "alerg_sesamo", "alerg_sulfitos", "alerg_altramuces", "alerg_moluscos") VALUES ('1', 'Manzana', 'Manzana roja', '1', '1.50', 'kg', '10', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('2', 'Lechuga', 'Lechuga romana', '2', '2.00', 'unidad', '5', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('3', 'Pollo', 'Pechuga de pollo', '3', '5.00', 'kg', '20', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('4', 'Leche', 'Leche entera', '4', '1.20', 'litro', '30', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('5', 'Sal', 'Sal fina', '5', '0.50', 'kg', '100', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('6', 'Tomate', 'Tomate pera', '2', '2.50', 'kg', '15', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('7', 'Pescado', 'Merluza', '3', '8.00', 'kg', '10', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('8', 'Queso', 'Queso manchego', '4', '12.00', 'kg', '5', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('9', 'Pimienta', 'Pimienta negra', '5', '3.00', 'kg', '50', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('10', 'Naranja', 'Naranja de mesa', '1', '1.80', 'kg', '20', 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('11', 'Chuleta de cordero', '', '3', '0.00', 'kg', '0', 'true', '2025-09-28 08:52:57.246567+00', '2025-09-28 08:52:57.246567+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('12', 'Gambas', 'Gambas de huelva', '6', '0.00', 'kg', '0', 'true', '2025-09-28 08:57:29.482674+00', '2025-09-28 08:57:29.482674+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'true'), ('13', 'Cangrejo', '', '6', '0.00', 'kg', '0', 'true', '2025-09-28 08:58:29.702286+00', '2025-09-28 08:58:29.702286+00', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('14', 'Costillas de cerdo', 'Jugosas costillas, ideales para barbacoa.', '3', '6.30', 'kg', '0', 'true', '2025-09-28 09:00:31.13729+00', '2025-09-28 09:00:31.13729+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('15', 'Muslo de pavo', 'Muslo tierno, excelente para asados.', '3', '6.29', 'kg', '0', 'true', '2025-09-28 09:00:58.851684+00', '2025-09-28 09:00:58.851684+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('16', 'Chorizo', 'Chorizo especiado, ideal para parrilla.', '3', '9.50', 'kg', '0', 'true', '2025-09-28 09:01:33.55824+00', '2025-09-28 09:01:33.55824+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('17', 'Lomo de cordero', 'Lomo tierno, perfecto para platos gourmet.', '3', '14.00', 'kg', '0', 'true', '2025-09-28 09:02:04.657529+00', '2025-09-28 09:02:04.657529+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('18', 'Pimentón dulce', 'Polvo rojo suave, ideal para guisos y carnes.', '5', '12.00', 'kg', '0', 'true', '2025-09-28 09:06:29.894972+00', '2025-09-28 09:06:29.894972+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('19', 'Cúrcuma molida', 'Especia vibrante, perfecta para curries.', '5', '7.20', 'kg', '0', 'true', '2025-09-28 09:07:01.084949+00', '2025-09-28 09:07:01.084949+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('20', 'Comino en grano', 'Granos aromáticos, ideales para asados.', '5', '8.80', 'kg', '0', 'true', '2025-09-28 09:07:32.341729+00', '2025-09-28 09:07:32.341729+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('21', 'Orégano seco', 'Hierba fragante, perfecta para pizzas.', '5', '7.50', 'kg', '0', 'true', '2025-09-28 09:08:08.784707+00', '2025-09-28 09:08:08.784707+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('22', 'Canela en polvo', 'Dulce y cálida, ideal para postres.', '5', '2.97', 'paquete', '0', 'true', '2025-09-28 09:11:21.567621+00', '2025-09-28 09:11:21.567621+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('23', 'Azafrán en hebras', 'Hebras premium, para arroces y platos finos.', '5', '3.00', 'g', '0', 'true', '2025-09-28 09:13:14.124189+00', '2025-09-28 09:13:14.124189+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('24', 'Plátanos Cavendish', 'Plátanos dulces, perfectos para snacks.', '1', '1.50', 'kg', '0', 'true', '2025-09-28 09:36:45.288656+00', '2025-09-28 09:36:45.288656+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('28', 'Fresas', '', '1', '3.00', 'kg', '0', 'true', '2025-09-28 09:39:03.146629+00', '2025-09-28 09:39:03.146629+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('29', 'Mango Ataulfo', 'Mango suave y dulce, ideal para batidos.', '1', '2.80', 'unidad', '0', 'true', '2025-09-28 09:39:33.291403+00', '2025-09-28 09:39:33.291403+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('30', 'Arándanos secos', '', '1', '6.50', 'paquete', '0', 'true', '2025-09-28 09:40:01.046716+00', '2025-09-28 09:40:01.046716+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('31', 'Queso cheddar', '', '4', '1.20', 'l', '0', 'true', '2025-09-28 09:40:50.469726+00', '2025-09-28 09:40:50.469726+00', 'false', 'false', 'false', 'false', 'false', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('32', 'Yogur natural', '', '4', '2.00', 'paquete', '0', 'true', '2025-09-28 09:41:28.287177+00', '2025-09-28 09:41:28.287177+00', 'false', 'false', 'false', 'false', 'false', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('33', 'Yogur de fresa', '', '4', '0.90', 'unidad', '0', 'true', '2025-09-28 09:42:19.724799+00', '2025-09-28 09:42:19.724799+00', 'false', 'false', 'false', 'false', 'false', 'false', 'true', 'true', 'false', 'false', 'false', 'false', 'false', 'false'), ('34', 'Mantequilla', '', '4', '3.30', 'paquete', '0', 'true', '2025-09-28 09:42:57.086801+00', '2025-09-28 09:42:57.086801+00', 'false', 'false', 'false', 'false', 'false', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('35', 'Camarones', '', '6', '0.00', 'kg', '0', 'true', '2025-09-28 20:34:47.477839+00', '2025-09-28 20:34:47.477839+00', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('36', 'Mejillones', '', '6', '0.00', 'kg', '0', 'true', '2025-09-28 20:35:19.607983+00', '2025-09-28 20:35:19.607983+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'true'), ('37', 'Ostras', '', '6', '0.00', 'kg', '0', 'true', '2025-09-28 20:35:53.72459+00', '2025-09-28 20:35:53.72459+00', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'true'), ('38', 'Surimi', '', '6', '0.00', 'paquete', '0', 'true', '2025-09-28 20:36:40.43664+00', '2025-09-28 20:36:40.43664+00', 'true', 'false', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'), ('39', 'Langostinos', '', '6', '0.00', 'caja', '0', 'true', '2025-09-28 20:43:44.052501+00', '2025-09-28 20:43:44.052501+00', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'true');
INSERT INTO "public"."inventory" ("id", "ingredient_id", "family_id", "subfamily_id", "quantity", "purchase_price", "expiry_date", "batch_number", "created_at", "supplier_id") VALUES ('12', '11', '2', '1', '0.92', '20.96', '2025-09-16', 'Lote123', '2025-09-28 08:53:20.78329+00', '3'), ('13', '34', '2', '4', '3.00', '4.00', '2025-10-03', 'L001', '2025-09-28 09:44:12.759501+00', '4'), ('14', '30', '2', '4', '7.00', '8.00', '2025-10-24', '332', '2025-09-28 15:27:38.257425+00', '1'), ('15', '3', '2', '1', '15.00', '5.50', '2025-10-17', 'L004', '2025-09-28 16:48:55.83961+00', '3'), ('16', '20', '3', null, '6.00', '10.00', '2025-10-09', 'L005', '2025-09-28 16:49:42.159886+00', '5'), ('17', '24', '2', '4', '6.00', '1.80', '2025-10-01', 'Lote123', '2025-09-28 16:51:02.383049+00', '1'), ('18', '12', '2', '2', '24.00', '13.00', '2025-10-08', 'L005', '2025-09-28 16:51:31.89306+00', '6'), ('19', '21', '3', null, '5.00', '9.00', '2027-10-10', 'ALC-001', '2025-09-28 18:07:53.923549+00', '5'), ('20', '38', '1', null, '6.00', '5.00', '2025-10-01', 'Lote123', '2025-09-28 20:37:20.422179+00', '6'), ('21', '36', '2', '2', '13.00', '6.50', '2025-09-30', 'L315', '2025-09-28 20:46:40.993567+00', '6'), ('22', '35', '2', '2', '7.00', '12.99', '2025-10-12', 'L121', '2025-09-30 16:56:35.461336+00', '6'), ('23', '29', '2', '4', '5.00', '3.00', '2025-10-01', '332', '2025-09-30 17:07:27.378002+00', '1'), ('26', '4', '2', '4', '12.00', '1.00', '2025-11-14', 'L009', '2025-09-30 17:33:37.115096+00', '4');
INSERT INTO "public"."inventory_families" ("id", "name", "description", "created_at") VALUES ('1', 'Congelador', 'Productos almacenados en congelador', '2025-04-17 18:54:41+00'), ('2', 'Cámara de frío', 'Productos almacenados en cámaras de frío', '2025-04-17 18:54:41+00'), ('3', 'Seco', 'Productos almacenados en seco', '2025-04-17 18:54:41+00'), ('4', 'Productos de limpieza', 'Productos de limpieza y mantenimiento', '2025-04-17 18:54:41+00');
INSERT INTO "public"."inventory_movements" ("id", "ingredient_id", "movement_type", "quantity", "reason", "admin_user_id", "created_at") VALUES ('1', '1', 'Salida', '-5.00', 'Venta a cliente', '1', '2025-04-17 18:54:42+00'), ('2', '2', 'Entrada', '10.00', 'Compra a proveedor', '1', '2025-04-17 18:54:42+00'), ('3', '3', 'Salida', '-20.00', 'Uso en cocina', '1', '2025-04-17 18:54:42+00'), ('4', '4', 'Entrada', '50.00', 'Reposición de stock', '1', '2025-04-17 18:54:42+00'), ('5', '5', 'Salida', '-10.00', 'Uso en preparación', '1', '2025-04-17 18:54:42+00');
INSERT INTO "public"."inventory_subfamilies" ("id", "name", "family_id", "description", "created_at") VALUES ('1', 'Cámara de carne', '2', 'Cámara específica para almacenamiento de carnes', '2025-04-17 18:54:41+00'), ('2', 'Cámara de pescado', '2', 'Cámara específica para almacenamiento de pescados', '2025-04-17 18:54:41+00'), ('3', 'Cámara de productos terminados', '2', 'Cámara para productos terminados', '2025-04-17 18:54:41+00'), ('4', 'Cámara de frutas y verduras', '2', 'Cámara específica para frutas y verduras', '2025-04-17 18:54:41+00');
INSERT INTO "public"."purchase_order_items" ("id", "order_id", "ingredient_id", "quantity", "unit_price", "total_price", "created_at") VALUES ('1', '1', '1', '50.00', '1.20', '60.00', '2025-04-17 18:54:42+00'), ('2', '2', '2', '20.00', '1.80', '36.00', '2025-04-17 18:54:42+00'), ('3', '3', '3', '100.00', '4.50', '450.00', '2025-04-17 18:54:42+00'), ('4', '4', '4', '100.00', '1.00', '100.00', '2025-04-17 18:54:42+00'), ('5', '5', '5', '500.00', '0.40', '200.00', '2025-04-17 18:54:42+00');
INSERT INTO "public"."purchase_orders" ("id", "supplier_id", "order_date", "expected_delivery", "status", "total_amount", "notes", "created_at") VALUES ('1', '1', '2025-04-17 00:00:00+00', '2025-04-19', 'Pendiente', '60.00', null, '2025-04-17 18:54:42+00'), ('2', '2', '2025-04-17 00:00:00+00', '2025-04-19', 'Pendiente', '36.00', null, '2025-04-17 18:54:42+00'), ('3', '3', '2025-04-17 00:00:00+00', '2025-04-19', 'Pendiente', '450.00', null, '2025-04-17 18:54:42+00'), ('4', '4', '2025-04-17 00:00:00+00', '2025-04-19', 'Pendiente', '100.00', null, '2025-04-17 18:54:42+00'), ('5', '5', '2025-04-17 00:00:00+00', '2025-04-19', 'Pendiente', '200.00', null, '2025-04-17 18:54:42+00');
INSERT INTO "public"."supplier_ingredients" ("id", "supplier_id", "ingredient_id", "supplier_price", "supplier_unit", "conversion_factor", "notes", "created_at") VALUES ('1', '1', '1', '1.20', 'kg', '1.0000', 'Manzanas de temporada', '2025-04-17 18:54:42+00'), ('2', '2', '2', '1.80', 'kg', '1.0000', 'Lechugas frescas', '2025-04-17 18:54:42+00'), ('3', '3', '3', '5.50', 'kg', '1.0000', 'Pechugas sin hueso', '2025-04-17 18:54:42+00'), ('4', '4', '4', '1.00', 'kg', '1.0000', 'Leche entera pasteurizada', '2025-04-17 18:54:42+00'), ('5', '5', '5', '0.40', 'kg', '1.0000', 'Sal fina de mesa', '2025-04-17 18:54:42+00'), ('6', '1', '10', '1.50', 'kg', '1.0000', 'Naranjas de temporada', '2025-04-17 18:54:42+00'), ('7', '2', '6', '2.00', 'kg', '1.0000', 'Tomates pera', '2025-04-17 18:54:42+00'), ('9', '4', '8', '10.00', 'kg', '1.0000', 'Queso manchego curado', '2025-04-17 18:54:42+00'), ('10', '5', '9', '2.50', 'kg', '1.0000', 'Pimienta negra molida', '2025-04-17 18:54:42+00'), ('14', '3', '11', '20.96', 'kg', '1.0000', '', '2025-09-28 08:53:05.168793+00'), ('15', '6', '12', '13.00', 'kg', '1.0000', '', '2025-09-28 08:57:38.50813+00'), ('16', '6', '13', '7.00', 'kg', '1.0000', '', '2025-09-28 08:58:35.867282+00'), ('17', '3', '17', '14.00', 'kg', '1.0000', '', '2025-09-28 09:02:17.466209+00'), ('18', '3', '16', '6.79', 'kg', '1.0000', '', '2025-09-28 09:02:34.066168+00'), ('19', '3', '15', '9.00', 'kg', '1.0000', 'Ideal para platos rápidos', '2025-09-28 09:02:50.169221+00'), ('20', '3', '14', '16.00', 'kg', '1.0000', '', '2025-09-28 09:03:24.731066+00'), ('21', '5', '18', '12.00', 'kg', '1.0000', 'Polvo rojo suave, ideal para guisos y carnes.', '2025-09-28 09:06:37.858543+00'), ('22', '5', '19', '8.50', 'kg', '1.0000', 'Especia vibrante, perfecta para curries.', '2025-09-28 09:07:12.212711+00'), ('23', '5', '20', '10.00', 'kg', '1.0000', 'Granos aromáticos, ideales para asados.', '2025-09-28 09:07:43.461737+00'), ('24', '5', '21', '9.00', 'kg', '1.0000', 'Hierba fragante, perfecta para pizzas.', '2025-09-28 09:08:18.603527+00'), ('25', '5', '22', '3.99', 'kg', '1.0000', '', '2025-09-28 09:11:26.836617+00'), ('26', '5', '23', '5.00', 'kg', '1.0000', 'Hebras premium, para arroces y platos finos.', '2025-09-28 09:13:22.394978+00'), ('27', '1', '24', '1.80', 'kg', '1.0000', 'Plátanos dulces, perfectos para snacks.', '2025-09-28 09:36:53.901344+00'), ('29', '1', '28', '4.00', 'kg', '1.0000', '', '2025-09-28 09:39:07.536219+00'), ('30', '1', '29', '3.00', 'kg', '1.0000', '', '2025-09-28 09:39:37.890397+00'), ('31', '1', '30', '8.00', 'kg', '1.0000', '', '2025-09-28 09:40:07.123396+00'), ('32', '4', '31', '8.00', 'kg', '1.0000', '', '2025-09-28 09:41:01.942978+00'), ('33', '4', '32', '3.00', 'kg', '1.0000', '', '2025-09-28 09:41:35.327749+00'), ('34', '4', '33', '1.20', 'kg', '1.0000', '', '2025-09-28 09:42:28.452677+00'), ('35', '4', '34', '4.00', 'kg', '1.0000', '', '2025-09-28 09:43:08.023519+00'), ('36', '6', '35', '12.99', 'kg', '1.0000', '', '2025-09-28 20:34:53.849936+00'), ('37', '6', '36', '6.50', 'kg', '1.0000', '', '2025-09-28 20:35:32.937939+00'), ('38', '6', '37', '1.50', 'kg', '1.0000', '', '2025-09-28 20:36:04.596888+00'), ('39', '6', '38', '5.00', 'kg', '1.0000', '', '2025-09-28 20:36:49.842041+00'), ('40', '6', '39', '24.72', 'kg', '1.0000', '', '2025-09-28 20:43:51.417338+00');
INSERT INTO "public"."suppliers" ("id", "name", "contact_person", "email", "phone", "address", "city", "postal_code", "country", "active", "created_at", "updated_at") VALUES ('1', 'Frutas Hermanos García', 'Juan García', 'juan@frutasgarcia.com', '600111222', 'Calle Mayor, 123', null, null, null, 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('2', 'Verduras La Huerta', 'María López', 'maria@lahuerta.com', '611222333', 'Avenida del Campo, 456', null, null, null, 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('3', 'Carnes El Corral', 'Pedro Martínez', 'pedro@elcorral.com', '622333444', 'Plaza de la Carne, 78', null, null, null, 'true', '2025-04-17 18:54:41+00', '2025-09-21 09:20:52.987306+00'), ('4', 'Lácteos La Vaquita', 'Ana Sánchez', 'ana@lavaquita.com', '633444555', 'Carretera de la Leche, 101', null, null, null, 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('5', 'Especias El Sabor', 'Luis Rodríguez Cintas', 'luis@elsabor.com', '644555666', 'Calle de las Especias, 112', null, null, null, 'true', '2025-04-17 18:54:41+00', '2025-04-17 18:54:41+00'), ('6', 'Mariscos González', 'Gonzalez', 'mariscos@gonzalez.com', '675321212', 'Calle Sevilla 31', null, null, null, 'true', '2025-09-21 08:54:24.604321+00', '2025-09-21 08:54:24.604321+00');

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