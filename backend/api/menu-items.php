<?php
/**
 * GrandVista Hotel - Menu Items API Endpoint
 * GET /backend/api/menu-items.php?restaurant=<slug>
 * Returns digital menu items for a specific restaurant or all restaurants.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once dirname(__DIR__) . '/config.php';

try {
    $restaurantSlug = isset($_GET['restaurant']) ? trim($_GET['restaurant']) : '';

    if ($restaurantSlug !== '') {
        $stmt = $pdo->prepare("
            SELECT m.id, m.name, m.description, m.category, m.price, m.dietary_type, m.image, r.slug AS restaurant_slug
            FROM menu_items m
            JOIN restaurants r ON m.restaurant_id = r.id
            WHERE r.slug = :slug
            ORDER BY m.id ASC
        ");
        $stmt->execute([':slug' => $restaurantSlug]);
        $rows = $stmt->fetchAll();

        $items = [];
        foreach ($rows as $row) {
            $items[] = [
                'id'           => (int)$row['id'],
                'name'         => $row['name'],
                'category'     => $row['category'],
                'description'  => $row['description'],
                'price'        => (float)$row['price'],
                'is_veg'       => ($row['dietary_type'] === 'veg'),
                'dietary_type' => $row['dietary_type'],
                'image'        => $row['image']
            ];
        }

        echo json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    } else {
        // Return all menu items grouped by restaurant slug (matching menu-items.json)
        $stmt = $pdo->query("
            SELECT m.id, m.name, m.description, m.category, m.price, m.dietary_type, m.image, r.slug AS restaurant_slug
            FROM menu_items m
            JOIN restaurants r ON m.restaurant_id = r.id
            ORDER BY m.id ASC
        ");
        $rows = $stmt->fetchAll();

        $grouped = [];
        foreach ($rows as $row) {
            $slug = $row['restaurant_slug'];
            if (!isset($grouped[$slug])) {
                $grouped[$slug] = [];
            }
            $grouped[$slug][] = [
                'id'           => (int)$row['id'],
                'name'         => $row['name'],
                'category'     => $row['category'],
                'description'  => $row['description'],
                'price'        => (float)$row['price'],
                'is_veg'       => ($row['dietary_type'] === 'veg'),
                'dietary_type' => $row['dietary_type'],
                'image'        => $row['image']
            ];
        }

        echo json_encode($grouped, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error loading menu items.'
    ]);
}
