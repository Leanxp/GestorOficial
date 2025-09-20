-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para gestorcocina
CREATE DATABASE IF NOT EXISTS `gestorcocina` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `gestorcocina`;

-- Volcando estructura para tabla gestorcocina.admin_usuarios
CREATE TABLE IF NOT EXISTS `admin_usuarios` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `user` varchar(50) DEFAULT NULL,
  `pwd` varchar(255) DEFAULT '123',
  `grade` int(1) DEFAULT 5,
  `email` varchar(255) NOT NULL,
  `lastUpdate` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.admin_usuarios: ~2 rows (aproximadamente)
INSERT INTO `admin_usuarios` (`id`, `user`, `pwd`, `grade`, `email`, `lastUpdate`) VALUES
	(1, 'admin', '$2b$10$l19aHbjcpavO2ClbLEy5f.ry07ZOezKxnGqNxMRN3SE4X.p0pM25e', 0, 'admin@google.com', '2025-04-14 23:00:13'),
	(2, 'Leandro', '$2b$10$dvgJJE8zaV8BTTNhKajh5uatbOVE5Ohl/fbr1WB2UnpZgbvFU7yLO', 0, 'leandrocalvoduran@gmail.com', '2025-04-17 14:49:11');

-- Volcando estructura para tabla gestorcocina.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.categories: ~5 rows (aproximadamente)
INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'Frutas', 'Frutas frescas y de temporada', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(2, 'Verduras', 'Verduras y hortalizas', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(3, 'Carnes', 'Carnes y embutidos', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(4, 'Lácteos', 'Productos lácteos', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(5, 'Especias', 'Especias y condimentos', '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- Volcando estructura para tabla gestorcocina.ingredients
CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `unit_measure` varchar(50) DEFAULT NULL,
  `min_stock_level` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.ingredients: ~10 rows (aproximadamente)
INSERT INTO `ingredients` (`id`, `name`, `description`, `category_id`, `base_price`, `unit_measure`, `min_stock_level`, `active`, `created_at`, `updated_at`) VALUES
	(1, 'Manzana', 'Manzana roja', 1, 1.50, 'kg', 10, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(2, 'Lechuga', 'Lechuga romana', 2, 2.00, 'unidad', 5, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(3, 'Pollo', 'Pechuga de pollo', 3, 5.00, 'kg', 20, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(4, 'Leche', 'Leche entera', 4, 1.20, 'litro', 30, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(5, 'Sal', 'Sal fina', 5, 0.50, 'kg', 100, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(6, 'Tomate', 'Tomate pera', 2, 2.50, 'kg', 15, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(7, 'Pescado', 'Merluza', 3, 8.00, 'kg', 10, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(8, 'Queso', 'Queso manchego', 4, 12.00, 'kg', 5, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(9, 'Pimienta', 'Pimienta negra', 5, 3.00, 'kg', 50, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(10, 'Naranja', 'Naranja de mesa', 1, 1.80, 'kg', 20, 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- Volcando estructura para tabla gestorcocina.inventory
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL,
  `ingredient_id` int(11) DEFAULT NULL,
  `family_id` int(11) DEFAULT NULL,
  `subfamily_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ingredient_id` (`ingredient_id`),
  KEY `inventory_ibfk_2` (`family_id`),
  KEY `inventory_ibfk_3` (`subfamily_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`),
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`family_id`) REFERENCES `inventory_families` (`id`),
  CONSTRAINT `inventory_ibfk_3` FOREIGN KEY (`subfamily_id`) REFERENCES `inventory_subfamilies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.inventory: ~10 rows (aproximadamente)
INSERT INTO `inventory` (`id`, `ingredient_id`, `family_id`, `subfamily_id`, `quantity`, `purchase_price`, `expiry_date`, `batch_number`, `created_at`) VALUES
	(1, 1, 2, 4, 50.00, 1.00, '2025-05-17', 'Lote123', '2025-04-17 18:54:41'),
	(2, 2, 2, 4, 20.00, 1.50, '2025-05-02', 'Lote456', '2025-04-17 18:54:41'),
	(3, 3, 1, NULL, 100.00, 4.00, '2025-06-16', 'Lote789', '2025-04-17 18:54:41'),
	(4, 4, 4, NULL, 150.00, 0.80, '2025-05-07', 'Lote101', '2025-04-17 18:54:41'),
	(5, 5, 3, NULL, 500.00, 0.30, '2026-04-17', 'Lote112', '2025-04-17 18:54:41'),
	(6, 6, 2, 4, 30.00, 2.00, '2025-04-27', 'Lote113', '2025-04-17 18:54:41'),
	(7, 7, 1, NULL, 25.00, 6.50, '2025-06-01', 'Lote114', '2025-04-17 18:54:41'),
	(8, 8, 2, 3, 10.00, 10.00, '2025-05-17', 'Lote115', '2025-04-17 18:54:41'),
	(9, 9, 3, NULL, 200.00, 2.50, '2025-10-14', 'Lote116', '2025-04-17 18:54:41'),
	(10, 10, 2, 4, 40.00, 1.20, '2025-05-12', 'Lote117', '2025-04-17 18:54:41');

-- Volcando estructura para tabla gestorcocina.inventory_families
CREATE TABLE IF NOT EXISTS `inventory_families` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.inventory_families: ~4 rows (aproximadamente)
INSERT INTO `inventory_families` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'Congelador', 'Productos almacenados en congelador', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(2, 'Cámara de frío', 'Productos almacenados en cámaras de frío', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(3, 'Seco', 'Productos almacenados en seco', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(4, 'Productos de limpieza', 'Productos de limpieza y mantenimiento', '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- Volcando estructura para tabla gestorcocina.inventory_movements
CREATE TABLE IF NOT EXISTS `inventory_movements` (
  `id` int(11) NOT NULL,
  `ingredient_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `movement_type` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `inventory_movements_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.inventory_movements: ~5 rows (aproximadamente)
INSERT INTO `inventory_movements` (`id`, `ingredient_id`, `quantity`, `movement_type`, `user_id`, `notes`, `created_at`) VALUES
	(1, 1, -5.00, 'Salida', 1, 'Venta a cliente', '2025-04-17 18:54:42'),
	(2, 2, 10.00, 'Entrada', 1, 'Compra a proveedor', '2025-04-17 18:54:42'),
	(3, 3, -20.00, 'Salida', 1, 'Uso en cocina', '2025-04-17 18:54:42'),
	(4, 4, 50.00, 'Entrada', 1, 'Reposición de stock', '2025-04-17 18:54:42'),
	(5, 5, -10.00, 'Salida', 1, 'Uso en preparación', '2025-04-17 18:54:42');

-- Volcando estructura para tabla gestorcocina.inventory_subfamilies
CREATE TABLE IF NOT EXISTS `inventory_subfamilies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `family_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `family_id` (`family_id`),
  CONSTRAINT `inventory_subfamilies_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `inventory_families` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.inventory_subfamilies: ~4 rows (aproximadamente)
INSERT INTO `inventory_subfamilies` (`id`, `family_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, 2, 'Cámara de carne', 'Cámara específica para almacenamiento de carnes', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(2, 2, 'Cámara de pescado', 'Cámara específica para almacenamiento de pescados', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(3, 2, 'Cámara de productos terminados', 'Cámara para productos terminados', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(4, 2, 'Cámara de frutas y verduras', 'Cámara específica para frutas y verduras', '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- Volcando estructura para tabla gestorcocina.purchase_orders
CREATE TABLE IF NOT EXISTS `purchase_orders` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.purchase_orders: ~5 rows (aproximadamente)
INSERT INTO `purchase_orders` (`id`, `supplier_id`, `order_date`, `expected_delivery_date`, `actual_delivery_date`, `status`, `total_amount`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 1, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 60.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(2, 2, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 36.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(3, 3, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 450.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(4, 4, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 100.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(5, 5, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 200.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42');

-- Volcando estructura para tabla gestorcocina.purchase_order_items
CREATE TABLE IF NOT EXISTS `purchase_order_items` (
  `id` int(11) NOT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `ingredient_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_order_id` (`purchase_order_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `purchase_order_items_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.purchase_order_items: ~5 rows (aproximadamente)
INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `ingredient_id`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
	(1, 1, 1, 50.00, 1.20, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(2, 2, 2, 20.00, 1.80, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(3, 3, 3, 100.00, 4.50, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(4, 4, 4, 100.00, 1.00, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(5, 5, 5, 500.00, 0.40, '2025-04-17 18:54:42', '2025-04-17 18:54:42');

-- Volcando estructura para tabla gestorcocina.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.suppliers: ~5 rows (aproximadamente)
INSERT INTO `suppliers` (`id`, `name`, `contact_person`, `email`, `phone`, `address`, `active`, `created_at`, `updated_at`) VALUES
	(1, 'Frutas Hermanos García', 'Juan García', 'juan@frutasgarcia.com', '600111222', 'Calle Mayor, 123', 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(2, 'Verduras La Huerta', 'María López', 'maria@lahuerta.com', '611222333', 'Avenida del Campo, 456', 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(3, 'Carnes El Corral', 'Pedro Martínez', 'pedro@elcorral.com', '622333444', 'Plaza de la Carne, 789', 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(4, 'Lácteos La Vaquita', 'Ana Sánchez', 'ana@lavaquita.com', '633444555', 'Carretera de la Leche, 101', 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
	(5, 'Especias El Sabor', 'Luis Rodríguez', 'luis@elsabor.com', '644555666', 'Calle de las Especias, 112', 1, '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- Volcando estructura para tabla gestorcocina.supplier_ingredients
CREATE TABLE IF NOT EXISTS `supplier_ingredients` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `ingredient_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `last_purchase_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `supplier_ingredients_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `supplier_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla gestorcocina.supplier_ingredients: ~10 rows (aproximadamente)
INSERT INTO `supplier_ingredients` (`id`, `supplier_id`, `ingredient_id`, `price`, `notes`, `last_purchase_date`, `created_at`, `updated_at`) VALUES
	(1, 1, 1, 1.20, 'Manzanas de temporada', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(2, 2, 2, 1.80, 'Lechugas frescas', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(3, 3, 3, 4.50, 'Pechugas sin hueso', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(4, 4, 4, 1.00, 'Leche entera pasteurizada', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(5, 5, 5, 0.40, 'Sal fina de mesa', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(6, 1, 10, 1.50, 'Naranjas de temporada', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(7, 2, 6, 2.00, 'Tomates pera', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(8, 3, 7, 6.50, 'Merluza fresca', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(9, 4, 8, 10.00, 'Queso manchego curado', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
	(10, 5, 9, 2.50, 'Pimienta negra molida', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
