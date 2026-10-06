-- GrandVista Hotel - Phase 1 Migration
-- Tables: events, event_images, event_enquiries, reviews
-- File: backend/sql/002_events_reviews.sql

USE `grandvista_hotel`;

-- 1. Events (Venues)
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` TEXT COLLATE utf8mb4_unicode_ci,
  `capacity` INT NOT NULL,
  `area_sqft` INT NOT NULL,
  `theatre_capacity` INT DEFAULT 0,
  `classroom_capacity` INT DEFAULT 0,
  `banquet_capacity` INT DEFAULT 0,
  `cocktail_capacity` INT DEFAULT 0,
  `stage` TINYINT(1) DEFAULT 1,
  `av_equipment` TEXT COLLATE utf8mb4_unicode_ci,
  `catering` TEXT COLLATE utf8mb4_unicode_ci,
  `decoration_options` TEXT COLLATE utf8mb4_unicode_ci,
  `image` VARCHAR(255) COLLATE utf8mb4_unicode_ci,
  `status` ENUM('available','maintenance','reserved') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Event Images (1:N Gallery)
CREATE TABLE IF NOT EXISTS `event_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `image` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Event Enquiries (Transactional)
CREATE TABLE IF NOT EXISTS `event_enquiries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` VARCHAR(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` VARCHAR(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` DATE NOT NULL,
  `guests` INT NOT NULL,
  `venue` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `budget` DECIMAL(12,2) DEFAULT NULL,
  `message` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` ENUM('new','in_progress','confirmed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_date` (`event_date`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `booking_reference` VARCHAR(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_name` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stay_type` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` TINYINT NOT NULL,
  `review` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `stay_date` DATE NOT NULL,
  `status` ENUM('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `booking_reference` (`booking_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data: Events (Venues)
INSERT INTO `events` (`id`, `name`, `slug`, `description`, `capacity`, `area_sqft`, `theatre_capacity`, `classroom_capacity`, `banquet_capacity`, `cocktail_capacity`, `stage`, `av_equipment`, `catering`, `decoration_options`, `image`, `status`)
VALUES
(1, 'The Grand Ballroom', 'the-grand-ballroom', 'A magnificent pillar-less ballroom adorned with crystal chandeliers, acoustic wall panels, and state-of-the-art audiovisual capabilities. Perfect for grand galas, high-profile diplomatic summits, and bespoke wedding celebrations.', 500, 8000, 500, 300, 380, 550, 1, 'Dual 4K Laser Projection, Line Array Audio, Wireless Shure Mics, Motorized Stage Trusses', 'Bespoke multi-course royal banquet menus curated by Master Chefs, artisanal live stations', 'Custom floral arches, crystal candelabras, dynamic intelligent ambient lighting', 'images/hotel/events.svg', 'available'),
(2, 'The Diplomatic Hall', 'the-diplomatic-hall', 'An executive conference and symposium venue designed for heads of state, diplomatic delegates, and corporate leadership forums. Features secure conferencing facilities and translation booths.', 150, 3200, 160, 100, 120, 150, 1, 'Encrypted Video Conferencing Hub, Polycom Microphones, Retractable HD Screens', 'Executive continental luncheons, barista tea & coffee breaks, high tea service', 'Minimalist diplomatic conference setup, executive ergonomic leather seating', 'images/hotel/events.svg', 'available'),
(3, 'The Terrace Pavilion', 'the-terrace-pavilion', 'An al fresco rooftop pavilion overlooking the heritage gardens and city skyline. Ideal for evening cocktail receptions, intimate soirees, and outdoor gala dinners under starlit skies.', 200, 4500, 180, 80, 150, 220, 1, 'Surround Acoustic Sound System, Ambient Weather-proof Uplighting', 'Gourmet barbecue grills, wood-fired artisanal pizzas, sommelier wine & cocktail pairings', 'Fairy light canopies, bespoke botanical centerpieces, teak wood outdoor cabanas', 'images/hotel/events.svg', 'available')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `description`=VALUES(`description`), `capacity`=VALUES(`capacity`);

-- Seed Data: Event Images
INSERT INTO `event_images` (`id`, `event_id`, `image`, `sort_order`)
VALUES
(1, 1, 'images/hotel/events.svg', 1),
(2, 1, 'images/hotel/lobby.svg', 2),
(3, 2, 'images/hotel/events.svg', 1),
(4, 2, 'images/hotel/exterior.svg', 2),
(5, 3, 'images/hotel/events.svg', 1),
(6, 3, 'images/hotel/restaurant.svg', 2)
ON DUPLICATE KEY UPDATE `image`=VALUES(`image`);

-- Seed Data: Reviews (6 Approved Reviews)
INSERT INTO `reviews` (`id`, `booking_reference`, `guest_name`, `email`, `stay_type`, `rating`, `review`, `stay_date`, `status`)
VALUES
(1, 'GVH-2026-10021', 'Ambassador Rajeshwar Sen', 'rajeshwar.sen@diplomacy.gov.in', 'Diplomatic Mission / Business', 5, 'An exemplary stay at GrandVista. The Executive Suite provided unmatched tranquility, flawless concierge security, and pristine heritage surroundings. The culinary standards at The Grand Pavilion remain second to none.', '2026-08-14', 'approved'),
(2, 'GVH-2026-10045', 'Lady Eleanor Vance', 'eleanor.vance@vancetravels.co.uk', 'Couples Leisure / Heritage Vacation', 5, 'From the moment our chauffeur met us at the airport to the personalized high tea in the private courtyard, GrandVista was pure magic. The Ayurvedic Spa treatments restored our energy after long travels.', '2026-09-02', 'approved'),
(3, 'GVH-2026-10088', 'Dr. Alistair Finch', 'alistair.finch@oxfordheritage.ac.uk', 'Academic Conference & Dining', 5, 'Attended a symposium hosted in The Diplomatic Hall followed by dinner at Spice Symphony. The audiovisual setup was seamless, acoustics superb, and the spice-infused tasting menu was unforgettable.', '2026-09-18', 'approved'),
(4, 'GVH-2026-10112', 'Priya & Vikram Malhotra', 'priya.malhotra@zenithexports.in', 'Wedding Anniversary', 5, 'Celebrated our 15th anniversary in the Presidential Suite. The champagne on arrival, rose petal turndown, and private dinner at The Terrace Pavilion exceeded every expectation. True luxury hospitality.', '2026-09-25', 'approved'),
(5, 'GVH-2026-10134', 'David M. Sterling', 'dsterling@singaporefin.org', 'Executive Business Solo', 4, 'Outstanding location in the coastal neighborhood with speedy fiber internet and an exceptional business center. Breakfast spread at The Grand Pavilion is extensive and healthy. Highly recommended.', '2026-10-01', 'approved'),
(6, 'GVH-2026-10156', 'Meera Subramaniam', 'meera.subramaniam@artcollective.org', 'Family Leisure / Suite Stay', 5, 'Our multi-generational family stayed in the Family Room and Deluxe Room. The staff went out of their way to care for my elderly mother and the infinity pool was beloved by the children.', '2026-10-04', 'approved')
ON DUPLICATE KEY UPDATE `guest_name`=VALUES(`guest_name`), `rating`=VALUES(`rating`), `review`=VALUES(`review`);
