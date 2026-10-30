<?php
/**
 * GrandVista Hotel - Seed Migration Script
 * Reads data/*.json files and populates MySQL database tables.
 * File: backend/migrate_seed_data.php
 */

require_once __DIR__ . '/config.php';

echo "Starting migration of seed data into MySQL..." . PHP_EOL;

// 1. Migrate Rooms
$roomsFile = dirname(__DIR__) . '/data/rooms.json';
if (file_exists($roomsFile)) {
    $rooms = json_decode(file_get_contents($roomsFile), true);
    
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE room_gallery;");
    $pdo->exec("TRUNCATE TABLE room_amenities;");
    $pdo->exec("TRUNCATE TABLE rooms;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    $stmtRoom = $pdo->prepare("
        INSERT INTO rooms (id, slug, name, room_type, price_per_night, size_sqft, max_guests, bed_type, view_type, description, availability_status, main_image, is_featured)
        VALUES (:id, :slug, :name, :room_type, :price_per_night, :size_sqft, :max_guests, :bed_type, :view_type, :description, :availability_status, :main_image, :is_featured)
    ");

    $stmtAmenity = $pdo->prepare("
        INSERT INTO room_amenities (room_id, amenity) VALUES (:room_id, :amenity)
    ");

    $stmtGallery = $pdo->prepare("
        INSERT INTO room_gallery (room_id, image_src, caption, sort_order) VALUES (:room_id, :image_src, :caption, :sort_order)
    ");

    foreach ($rooms as $r) {
        $stmtRoom->execute([
            ':id'                  => $r['id'],
            ':slug'                => $r['slug'],
            ':name'                => $r['name'],
            ':room_type'           => $r['type'],
            ':price_per_night'     => $r['price_per_night'],
            ':size_sqft'           => $r['size_sqft'],
            ':max_guests'          => $r['max_guests'],
            ':bed_type'            => $r['bed_type'],
            ':view_type'           => $r['view'],
            ':description'         => $r['description'],
            ':availability_status' => $r['availability_status'],
            ':main_image'          => $r['image'],
            ':is_featured'         => !empty($r['is_featured']) ? 1 : 0
        ]);
        $roomId = $r['id'];

        if (!empty($r['amenities']) && is_array($r['amenities'])) {
            foreach ($r['amenities'] as $amenity) {
                $stmtAmenity->execute([
                    ':room_id' => $roomId,
                    ':amenity' => $amenity
                ]);
            }
        }

        if (!empty($r['gallery']) && is_array($r['gallery'])) {
            $order = 0;
            foreach ($r['gallery'] as $item) {
                $stmtGallery->execute([
                    ':room_id'    => $roomId,
                    ':image_src'  => $item['src'],
                    ':caption'    => $item['caption'] ?? '',
                    ':sort_order' => $order++
                ]);
            }
        }
    }
    echo "✓ Migrated " . count($rooms) . " rooms." . PHP_EOL;
}

// 2. Migrate Offers
$offersFile = dirname(__DIR__) . '/data/offers.json';
if (file_exists($offersFile)) {
    $offers = json_decode(file_get_contents($offersFile), true);

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE offer_benefits;");
    $pdo->exec("TRUNCATE TABLE offers;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    $stmtOffer = $pdo->prepare("
        INSERT INTO offers (title, category, description, image, terms, status)
        VALUES (:title, :category, :description, :image, :terms, 'active')
    ");

    $stmtBenefit = $pdo->prepare("
        INSERT INTO offer_benefits (offer_id, benefit) VALUES (:offer_id, :benefit)
    ");

    foreach ($offers as $o) {
        $stmtOffer->execute([
            ':title'       => $o['title'],
            ':category'    => $o['category'],
            ':description' => $o['description'],
            ':image'       => $o['image'],
            ':terms'       => $o['terms']
        ]);
        $offerId = $pdo->lastInsertId();

        if (!empty($o['included_perks']) && is_array($o['included_perks'])) {
            foreach ($o['included_perks'] as $benefit) {
                $stmtBenefit->execute([
                    ':offer_id' => $offerId,
                    ':benefit'  => $benefit
                ]);
            }
        }
    }
    echo "✓ Migrated " . count($offers) . " offers." . PHP_EOL;
}

// 3. Migrate Restaurants
$restaurantsFile = dirname(__DIR__) . '/data/restaurants.json';
$restaurantIdMap = [];
if (file_exists($restaurantsFile)) {
    $restaurants = json_decode(file_get_contents($restaurantsFile), true);

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE menu_items;");
    $pdo->exec("TRUNCATE TABLE restaurants;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    $stmtRest = $pdo->prepare("
        INSERT INTO restaurants (slug, name, cuisine, description, image, status)
        VALUES (:slug, :name, :cuisine, :description, :image, 'open')
    ");

    foreach ($restaurants as $r) {
        $cuisineStr = is_array($r['cuisine']) ? implode(', ', $r['cuisine']) : ($r['cuisine'] ?? '');
        $stmtRest->execute([
            ':slug'        => $r['slug'],
            ':name'        => $r['name'],
            ':cuisine'     => $cuisineStr,
            ':description' => $r['description'],
            ':image'       => $r['hero_image'] ?? $r['image'] ?? ''
        ]);
        $restId = $pdo->lastInsertId();
        $restaurantIdMap[$r['slug']] = $restId;
    }
    echo "✓ Migrated " . count($restaurants) . " restaurants." . PHP_EOL;
}

// 4. Migrate Menu Items
$menuFile = dirname(__DIR__) . '/data/menu-items.json';
if (file_exists($menuFile)) {
    $menuData = json_decode(file_get_contents($menuFile), true);
    $itemCount = 0;

    $stmtMenuItem = $pdo->prepare("
        INSERT INTO menu_items (restaurant_id, name, description, category, price, dietary_type, image)
        VALUES (:restaurant_id, :name, :description, :category, :price, :dietary_type, :image)
    ");

    foreach ($menuData as $slug => $items) {
        $restaurantId = $restaurantIdMap[$slug] ?? null;
        if (!$restaurantId) {
            $lookup = $pdo->prepare("SELECT id FROM restaurants WHERE slug = ?");
            $lookup->execute([$slug]);
            $restaurantId = $lookup->fetchColumn();
        }

        if ($restaurantId && is_array($items)) {
            foreach ($items as $item) {
                $dietaryType = (!empty($item['is_veg'])) ? 'veg' : 'non-veg';
                $stmtMenuItem->execute([
                    ':restaurant_id' => $restaurantId,
                    ':name'          => $item['name'],
                    ':description'   => $item['description'] ?? '',
                    ':category'      => $item['category'] ?? 'mains',
                    ':price'         => $item['price'] ?? 0,
                    ':dietary_type'  => $dietaryType,
                    ':image'         => $item['image'] ?? ''
                ]);
                $itemCount++;
            }
        }
    }
    echo "✓ Migrated " . $itemCount . " menu items." . PHP_EOL;
}

// Confirm row counts
echo PHP_EOL . "--- Final Database Row Counts ---" . PHP_EOL;
$tables = ['rooms', 'room_amenities', 'room_gallery', 'offers', 'offer_benefits', 'restaurants', 'menu_items'];
foreach ($tables as $t) {
    $count = $pdo->query("SELECT COUNT(*) FROM {$t}")->fetchColumn();
    echo "Table {$t}: {$count} rows" . PHP_EOL;
}
echo "Migration finished successfully!" . PHP_EOL;
