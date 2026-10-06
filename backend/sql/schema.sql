-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: grandvista_hotel
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_services`
--

DROP TABLE IF EXISTS `booking_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_services`
--

LOCK TABLES `booking_services` WRITE;
/*!40000 ALTER TABLE `booking_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_reference` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_id` int NOT NULL,
  `guest_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `adults` int NOT NULL,
  `children` int DEFAULT '0',
  `rooms_count` int DEFAULT '1',
  `nights` int NOT NULL,
  `room_subtotal` decimal(10,2) NOT NULL,
  `services_subtotal` decimal(10,2) DEFAULT '0.00',
  `taxes` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','checked_in','checked_out','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_reference` (`booking_reference`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','read','responded') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiries`
--

LOCK TABLES `enquiries` WRITE;
/*!40000 ALTER TABLE `enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `dietary_type` enum('veg','non-veg') COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,1,'Kashmiri Morel & Truffle Tikka','Charcoal-tandoor smoked cottage cheese morsels stuffed with wild Himalayan morels, brushed with black truffle butter.','starters',1250.00,'veg','images/dining/signature-dish.svg'),(2,1,'Galouti Kebab on Sheermal','Melt-in-mouth Awadhi spiced lamb patties seasoned with 24 royal herbs, served atop miniature saffron milk breads.','starters',1400.00,'non-veg','images/dining/signature-dish.svg'),(3,1,'Burrata with Charred Fig & Kasundi','Fresh artisan burrata paired with wood-roasted figs, Bengal mustard Kasundi dressing, and roasted walnuts.','starters',950.00,'veg','images/dining/signature-dish.svg'),(4,1,'Pan-Seared Sea Bass with Saffron Jus','Wild-caught Chilean sea bass filet on a bed of curried leeks, served with fragrant Kashmiri saffron emulsion.','mains',1850.00,'non-veg','images/dining/signature-dish.svg'),(5,1,'Dal GrandVista — 36-Hour Simmered','Our legendary black lentils slowly simmered over woodfire embers for 36 hours with churned white butter and tomato puree.','mains',890.00,'veg','images/dining/signature-dish.svg'),(6,1,'Dum Pukht Awadhi Nalli Nihari','Slow-braised tender lamb shanks in an aromatic spiced marrow gravy, topped with ginger juliennes and fresh mint.','mains',1650.00,'non-veg','images/dining/signature-dish.svg'),(7,1,'Grand Cru Valrhona Chocolate Sphere','Dark chocolate dome filled with salted caramel mousse and hazelnut praline, melted table-side with hot berry coulis.','desserts',850.00,'veg','images/dining/dessert.svg'),(8,1,'Rosewater & Pistachio Kulfi Tasting','Slow-reduced clotted milk ice cream scented with Persian rosewater and edible 24K silver leaf.','desserts',680.00,'veg','images/dining/dessert.svg'),(9,1,'The Royal Viceroy — Signature Concoction','Rare scotch whisky infused with Darjeeling First Flush tea, smoked clove mist, and spiced demerara syrup.','drinks',1100.00,'veg','images/dining/cocktail.svg'),(10,1,'Saffron Cardamom Lassi Shrub (Mocktail)','Hand-churned organic yogurt shaken with organic saffron honey, crushed green cardamom, and rose petal infusion.','drinks',550.00,'veg','images/dining/cocktail.svg'),(11,2,'Robata Glazed Shiitake & Asparagus','Charcoal-grilled mountain asparagus and jumbo shiitake mushrooms glazed with sweet yuzu soy reduction.','starters',890.00,'veg','images/dining/signature-dish.svg'),(12,2,'Crispy Calamari & Tiger Prawns','Lightly tempura-dusted squid rings and wild prawns tossed in Togarashi spice with citrus wasabi aioli.','starters',1200.00,'non-veg','images/dining/signature-dish.svg'),(13,2,'Truffle & Edamame Crystal Dumplings','Delicate steamed translucent parcels filled with crushed edamame beans and aromatic black truffle oil.','starters',980.00,'veg','images/dining/signature-dish.svg'),(14,2,'Wagyu & Truffle Brioche Sliders (2 pcs)','Premium wagyu patties seared rare on toasted mini brioche buns with aged Gruyère and onion jam.','mains',1650.00,'non-veg','images/dining/signature-dish.svg'),(15,2,'Artisanal Mezze & Flatbread Platter','Roasted beet hummus, smoked baba ganoush, muhammara, marinated kalamata olives, and fresh wood-fired za\'atar lavash.','mains',1150.00,'veg','images/dining/signature-dish.svg'),(16,2,'Smoked Hickory Old Fashioned','Kentucky bourbon, aromatic bitters, brown sugar cube, presented in cut crystal with captured hickory smoke.','drinks',950.00,'veg','images/dining/cocktail.svg'),(17,2,'GrandVista Twilight Sky Martini','Empress 1908 botanical gin, elderflower liqueur, freshly squeezed lime juice, and a lavender mist float.','drinks',900.00,'veg','images/dining/cocktail.svg'),(18,2,'Yuzu Citrus Posset & Matcha Crisp','Velvety Japanese yuzu cream chilled and crowned with candied citrus peels and delicate matcha tuile cookies.','desserts',750.00,'veg','images/dining/dessert.svg'),(19,3,'Avocado & Burrata Sourdough Tartine','Artisan country loaf rubbed with garlic, crushed Hass avocado, creamy Puglia burrata, and basil oil drizzle.','starters',750.00,'veg','images/dining/signature-dish.svg'),(20,3,'Smoked Salmon & Capers Bagel','House-baked everything bagel with Norwegian smoked salmon, herbed cream cheese, capers, and shaved red onion.','starters',890.00,'non-veg','images/dining/signature-dish.svg'),(21,3,'Truffled Forest Mushroom Quiche','Flaky butter pastry filled with wild sautéed morels, porcini, Gruyère cheese custard, and organic petite salad.','mains',820.00,'veg','images/dining/signature-dish.svg'),(22,3,'GrandVista Club Sandwich','Triple-deck toasted brioche layered with herb-roasted chicken breast, applewood smoked bacon, farm eggs, and Dijon mayo.','mains',950.00,'non-veg','images/dining/signature-dish.svg'),(23,3,'Warm Hand-Laminated Pain Au Chocolat','French Normandy butter laminated pastry filled with double batons of 64% Valrhona dark chocolate.','desserts',380.00,'veg','images/dining/dessert.svg'),(24,3,'Madagascar Vanilla Bean Mille-Feuille','Crisp caramelized puff pastry sheets layered with light Tahitian vanilla diplomat cream and fresh raspberries.','desserts',540.00,'veg','images/dining/dessert.svg'),(25,3,'Single-Origin Chikmagalur Pour-Over','Specialty estate roast prepared via V60 filter, revealing bright citrus notes and a velvety bittersweet chocolate finish.','drinks',420.00,'veg','images/dining/cafe.svg'),(26,3,'Iced Spanish Saffron Latte','Double espresso shot layered over condensed milk, chilled oat milk, and a delicate pinch of real saffron threads.','drinks',490.00,'veg','images/dining/cafe.svg');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_benefits`
--

DROP TABLE IF EXISTS `offer_benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `offer_id` int NOT NULL,
  `benefit` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`),
  CONSTRAINT `offer_benefits_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_benefits`
--

LOCK TABLES `offer_benefits` WRITE;
/*!40000 ALTER TABLE `offer_benefits` DISABLE KEYS */;
INSERT INTO `offer_benefits` VALUES (1,1,'Lavish buffet breakfast at GrandVista Restaurant'),(2,1,'Traditional English Afternoon Tea for two'),(3,1,'Complimentary late checkout until 4:00 PM'),(4,1,'₹1,500 credit toward Aheli Spa therapies'),(5,2,'Guaranteed best available suite rates'),(6,2,'Welcome fruit basket & artisanal chocolates'),(7,2,'Complimentary high-speed premium Wi-Fi'),(8,2,'Flexible date change up to 7 days prior'),(9,3,'Chilled sparkling wine & strawberry platter on arrival'),(10,3,'4-course candlelit dinner at GrandVista Restaurant or Terrace'),(11,3,'60-minute signature couples massage at Aheli Spa'),(12,3,'Rose petal bath turndown service & late checkout'),(13,4,'Second adjoining room at 50% published rate'),(14,4,'Kids under 12 stay and dine complimentary from children\'s menu'),(15,4,'Daily family pass to the heated infinity pool & games lounge'),(16,4,'Complimentary evening movie & popcorn turndown for kids'),(17,5,'Chauffeured airport transfer (one-way)'),(18,5,'Daily 4 pieces of complimentary executive laundry/pressing'),(19,5,'2 hours complimentary boardroom access per stay'),(20,5,'Express check-in and lounge happy hour cocktail access'),(21,6,'Progressive weekly discount up to 35% on suite categories'),(22,6,'Complimentary weekly laundry service (up to 20 garments)'),(23,6,'20% savings on all hotel dining venues & room service'),(24,6,'Dedicated guest relations manager and priority housekeeping'),(25,7,'Grand festive gala dinner buffet with live culinary stations'),(26,7,'Curated artisanal mithai & gourmet festive gift hamper'),(27,7,'Exclusive invitations to the evening courtyard celebrations'),(28,7,'₹2,500 hotel dining & beverage credit');
/*!40000 ALTER TABLE `offer_benefits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `terms` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','expired') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,'Weekend Indulgence Getaway','weekend','Escape the weekly routine and surrender to unmatched luxury. Includes decadent champagne breakfast, gourmet high tea, and relaxed late checkout.','images/offers/weekend.svg',NULL,NULL,'*Minimum 2-night stay required across Friday–Sunday. Subject to room allocation.','active'),(2,'Early Bird Booking Privilege','early-bird','Plan ahead and enjoy guaranteed preferred room tiers, elevated welcome amenities, and exceptional rate savings on our premier suites.','images/offers/early-bird.svg',NULL,NULL,'*Full prepayment required at time of reservation. Non-refundable cancellation.','active'),(3,'Romantic Rendezvous For Two','couples','Celebrate your connection with bespoke romance. Enjoy private candlelit dining, couples hydrotherapy, and a bottle of sparkling wine upon arrival.','images/offers/couples.svg',NULL,NULL,'*Valid for double occupancy. Minimum 48-hour advance notice for spa slot.','active'),(4,'Family Holiday & Memories Package','family','Thoughtfully crafted for memorable family moments. Interconnecting suites, kid-friendly welcome surprises, and complimentary dining for young ones.','images/offers/family.svg',NULL,NULL,'*Applicable for 2 adults and up to 2 children. ID verification required at check-in.','active'),(5,'Executive Corporate Stay','business','Designed for demanding business travelers requiring seamless productivity, uninterrupted rest, and flawless concierge assistance.','images/offers/business.svg',NULL,NULL,'*Corporate business card or corporate ID required at arrival.','active'),(6,'Extended Luxury Residence','long-stay','Make GrandVista your premier city residence. Generous discounts, dedicated butler services, and full access to private hotel amenities.','images/offers/long-stay.svg',NULL,NULL,'*Minimum consecutive stay of 7 nights required. Early departure will re-rate to standard pricing.','active'),(7,'Grand Festive Celebration Package','festival','Immerse yourself in festive jubilation with traditional delicacies, cultural performances, and joyful curated experiences for the whole party.','images/offers/festival.svg',NULL,NULL,'*Special holiday cancellation window applies (7 days prior). Subject to festival calendar.','active');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuisine` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('open','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'open',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'grandvista-restaurant','GrandVista Restaurant','Modern Indian, European Contemporary, Awadhi Royal Cuisine','GrandVista Restaurant presents an epicurean journey marrying centuries-old royal culinary heritage with progressive global gastronomy. Under the guidance of our Master Executive Chef, each recipe honors heritage spices, sustainable farm-to-table produce, and theatrical table-side presentations.',NULL,NULL,'images/dining/restaurant.svg','open'),(2,'sky-lounge','Sky Lounge & Rooftop Bar','Artisanal Tapas, Wood-Fired Robata Grill, Craft Mixology & Rare Spirits','Perched on the 14th floor commanding uninterrupted 360-degree vistas across the capital skyline, Sky Lounge is the city\'s premier evening sanctuary. Sip bespoke barrel-aged concoctions, rare vintage malts, and sample artisanal small plates while listening to soothing deep ambient house grooves under the open sky.',NULL,NULL,'images/dining/sky-lounge.svg','open'),(3,'the-grand-cafe','The Grand Café','French Boulangerie & Viennoiserie, Specialty Single-Origin Coffees, Gourmet Sandwiches & All-Day High Tea','The Grand Café is an intimate, sun-dappled haven evoking Parisian boulevards. Savor morning sourdough croissants baked fresh throughout the day, pour-over specialty Arabica coffees from Chikmagalur estates, and bespoke afternoon high tea tiered stands served in bone china.',NULL,NULL,'images/dining/cafe.svg','open');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `amenity` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (1,1,'Wi-Fi'),(2,1,'TV'),(3,1,'Mini Bar'),(4,1,'Work Desk'),(5,1,'Air Conditioning'),(6,2,'Wi-Fi'),(7,2,'TV'),(8,2,'Mini Bar'),(9,2,'Bathtub'),(10,2,'Balcony'),(11,2,'Work Desk'),(12,2,'Air Conditioning'),(13,3,'Wi-Fi'),(14,3,'TV'),(15,3,'Mini Bar'),(16,3,'Bathtub'),(17,3,'Balcony'),(18,3,'Work Desk'),(19,3,'Air Conditioning'),(20,4,'Wi-Fi'),(21,4,'TV'),(22,4,'Mini Bar'),(23,4,'Balcony'),(24,4,'Work Desk'),(25,4,'Air Conditioning'),(26,5,'Wi-Fi'),(27,5,'TV'),(28,5,'Mini Bar'),(29,5,'Bathtub'),(30,5,'Balcony'),(31,5,'Work Desk'),(32,5,'Air Conditioning');
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_gallery`
--

DROP TABLE IF EXISTS `room_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `image_src` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_gallery_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_gallery`
--

LOCK TABLES `room_gallery` WRITE;
/*!40000 ALTER TABLE `room_gallery` DISABLE KEYS */;
INSERT INTO `room_gallery` VALUES (1,1,'images/rooms/deluxe-room.svg','Deluxe Bedroom & Ambient Lighting',0),(2,1,'images/rooms/gallery/bathroom.svg','Italian Marble Rain Shower & Vanity',1),(3,1,'images/rooms/gallery/living.svg','Executive Work Desk & Seating Lounge',2),(4,1,'images/rooms/gallery/view.svg','City Skyline Panoramic Window',3),(5,2,'images/rooms/premium-room.svg','Premium King Bedroom',0),(6,2,'images/rooms/gallery/balcony.svg','Private Step-Out Balcony',1),(7,2,'images/rooms/gallery/bathroom.svg','Deep-Soaking Oval Bathtub',2),(8,2,'images/rooms/gallery/living.svg','Garden-Facing Lounge Reading Nook',3),(9,3,'images/rooms/executive-suite.svg','Executive Master Suite & Salon',0),(10,3,'images/rooms/gallery/living.svg','Executive Workstation & Lounge',1),(11,3,'images/rooms/gallery/bathroom.svg','Luxury Marble Ensuite Bathroom',2),(12,3,'images/rooms/gallery/view.svg','Panoramic 270-Degree Skyline Outlook',3),(13,4,'images/rooms/family-room.svg','Twin Queen Family Accommodation',0),(14,4,'images/rooms/gallery/living.svg','Residential Family Lounge',1),(15,4,'images/rooms/gallery/balcony.svg','Courtyard Balcony',2),(16,4,'images/rooms/gallery/bathroom.svg','Dual-Vanity Family Bathroom',3),(17,5,'images/rooms/suite.svg','Presidential Grand Suite',0),(18,5,'images/rooms/gallery/balcony.svg','Wraparound Private Terrace',1),(19,5,'images/rooms/gallery/bathroom.svg','Spa Bathtub & Italian Travertine',2),(20,5,'images/rooms/gallery/view.svg','Capital Skyline Horizon',3);
/*!40000 ALTER TABLE `room_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `size_sqft` int NOT NULL,
  `max_guests` int NOT NULL,
  `bed_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `view_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `availability_status` enum('available','limited','sold_out') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `main_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'deluxe-room','Deluxe Room','Deluxe',5500.00,380,2,'King Bed','City View','An elegantly appointed sanctuary featuring custom walnut furnishings, Italian marble bathroom with rain shower, and sweeping views of the vibrant city skyline.','available','images/rooms/deluxe-room.svg',1,'2026-10-06 04:40:43'),(2,'premium-room','Premium Room','Premium',7800.00,460,2,'King Bed','Garden View','Designed for discerning guests, featuring a private step-out balcony overlooking manicured courtyard gardens, luxury plush bedding, and an exquisite soaking bathtub.','available','images/rooms/premium-room.svg',1,'2026-10-06 04:40:43'),(3,'executive-suite','Executive Suite','Executive',12500.00,650,3,'Super King Bed','Panoramic Skyline View','A sophisticated corner suite boasting an expansive separate lounge salon, ergonomic executive workstation, deep marble bath, and dedicated concierge privilege.','limited','images/rooms/executive-suite.svg',1,'2026-10-06 04:40:43'),(4,'family-room','Family Room','Family',10200.00,580,4,'2 Queen Beds','Courtyard View','Thoughtfully crafted for families seeking seamless togetherness without compromising on luxury, offering twin plush queen beds and an inviting residential seating alcove.','available','images/rooms/family-room.svg',0,'2026-10-06 04:40:43'),(5,'suite','Suite','Suite',21500.00,920,4,'California King Bed','Panoramic Skyline View','The crowning jewel of GrandVista. Features a grand master bedroom, private dining alcove, wraparound open-air terrace, and bespoke 24-hour butler assistance.','limited','images/rooms/suite.svg',0,'2026-10-06 04:40:43');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `table_reservations`
--

DROP TABLE IF EXISTS `table_reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `table_reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `guest_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `party_size` int NOT NULL,
  `special_request` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','confirmed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `table_reservations_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `table_reservations`
--

LOCK TABLES `table_reservations` WRITE;
/*!40000 ALTER TABLE `table_reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `table_reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'grandvista_hotel'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-06 17:26:15
