<?php
/**
 * GrandVista Hotel - Rooms API Endpoint
 * GET /backend/api/rooms.php
 * Returns all rooms with amenities and gallery matching rooms.json structure.
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
    // 1. Fetch all rooms
    $stmt = $pdo->query("SELECT * FROM rooms ORDER BY id ASC");
    $rooms = $stmt->fetchAll();

    // 2. Fetch all amenities grouped by room_id
    $stmtAmenities = $pdo->query("SELECT room_id, amenity FROM room_amenities ORDER BY id ASC");
    $amenitiesRows = $stmtAmenities->fetchAll();
    $amenitiesMap = [];
    foreach ($amenitiesRows as $row) {
        $amenitiesMap[$row['room_id']][] = $row['amenity'];
    }

    // 3. Fetch all gallery items grouped by room_id
    $stmtGallery = $pdo->query("SELECT room_id, image_src, caption FROM room_gallery ORDER BY sort_order ASC, id ASC");
    $galleryRows = $stmtGallery->fetchAll();
    $galleryMap = [];
    foreach ($galleryRows as $row) {
        $galleryMap[$row['room_id']][] = [
            'src'     => $row['image_src'],
            'caption' => $row['caption']
        ];
    }

    // 4. Map into frontend shape
    $response = [];
    foreach ($rooms as $r) {
        $roomId = (int)$r['id'];
        $response[] = [
            'id'                  => $roomId,
            'slug'                => $r['slug'],
            'name'                => $r['name'],
            'type'                => $r['room_type'],
            'price_per_night'     => (float)$r['price_per_night'],
            'size_sqft'           => (int)$r['size_sqft'],
            'max_guests'          => (int)$r['max_guests'],
            'bed_type'            => $r['bed_type'],
            'view'                => $r['view_type'],
            'description'         => $r['description'],
            'amenities'           => $amenitiesMap[$roomId] ?? [],
            'availability_status' => $r['availability_status'],
            'image'               => $r['main_image'],
            'is_featured'         => (bool)$r['is_featured'],
            'gallery'             => $galleryMap[$roomId] ?? []
        ];
    }

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error loading accommodations.'
    ]);
}
